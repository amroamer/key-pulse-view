import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/contexts/DashboardContext";
import { streamChat, type ChatMessage } from "@/lib/chatClient";
import { cn } from "@/lib/utils";

const ChatPanel = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { activeTab, selectedStudent } = useDashboard();

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    const baseHistory = [...messages, userMsg];
    setMessages([...baseHistory, assistantMsg]);
    setInput("");
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    // Tool annotations accumulate above the streamed answer.
    let toolBlock = "";
    let answer = "";

    const render = () => {
      const combined = [toolBlock, answer].filter(Boolean).join("\n\n");
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last && last.role === "assistant") {
          next[next.length - 1] = { ...last, content: combined };
        }
        return next;
      });
    };

    try {
      for await (const event of streamChat(
        {
          messages: baseHistory,
          context: { activeTab, selectedStudent: selectedStudent ?? undefined },
        },
        ctrl.signal,
      )) {
        if (event.type === "chunk") {
          answer += event.content;
          render();
        } else if (event.type === "tool_call") {
          const line = `_🔧 calling \`${event.name}\`…_`;
          toolBlock = toolBlock ? `${toolBlock}\n${line}` : line;
          render();
        } else if (event.type === "tool_result") {
          const line = `_🔧 \`${event.name}\` → ${event.count ?? "ok"}_`;
          // Replace the most recent "calling" line with the resolved one.
          const lines = toolBlock.split("\n");
          if (lines.length && lines[lines.length - 1].includes("calling")) {
            lines[lines.length - 1] = line;
            toolBlock = lines.join("\n");
          } else {
            toolBlock = toolBlock ? `${toolBlock}\n${line}` : line;
          }
          render();
        } else if (event.type === "error") {
          setMessages((m) => {
            const next = [...m];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = { ...last, content: `⚠ ${event.message}` };
            }
            return next;
          });
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((m) => {
          const next = [...m];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            next[next.length - 1] = { ...last, content: `⚠ ${(err as Error).message}` };
          }
          return next;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-12">
            <p className="font-medium">Ask about your dashboard</p>
            <p className="mt-2 text-xs">
              Try: "What does the {activeTab} tab show?" or "What are the biggest red KPIs?"
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm break-words",
                m.role === "user"
                  ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                  : "bg-muted text-foreground",
              )}
            >
              {m.role === "user" ? (
                m.content
              ) : m.content ? (
                <div
                  className={cn(
                    "prose prose-sm max-w-none dark:prose-invert",
                    "prose-p:my-2 prose-p:leading-relaxed",
                    "prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-semibold",
                    "prose-h1:text-base prose-h2:text-base prose-h3:text-sm prose-h4:text-sm",
                    "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:marker:text-muted-foreground",
                    "prose-pre:my-2 prose-pre:bg-background prose-pre:border prose-pre:text-xs",
                    "prose-code:before:content-none prose-code:after:content-none",
                    "prose-code:bg-background prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-normal",
                    "prose-a:text-primary",
                    "prose-table:my-2 prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1",
                    "prose-hr:my-3",
                  )}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : streaming && i === messages.length - 1 ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 border-t p-3 items-end"
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask about your KPIs... (Shift+Enter for newline)"
          disabled={streaming}
          autoFocus
          rows={1}
          className="min-h-[40px] max-h-[200px] resize-none py-2 leading-tight"
        />
        <Button type="submit" size="icon" disabled={streaming || !input.trim()}>
          {streaming ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;
