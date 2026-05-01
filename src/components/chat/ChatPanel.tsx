import { useEffect, useRef, useState } from "react";
import { ChevronDown, Send, Square, Wrench } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  streamChat,
  type ChatMessage,
  type ToolInvocation,
} from "@/lib/chatClient";
import type { DashboardTab } from "@/components/dashboard/DashboardTabs";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  streaming: boolean;
  setStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

const STARTER_PROMPTS: Record<DashboardTab, string[]> = {
  landing: ["What's red — top 3 only", "System Score breakdown in 3 lines", "Three biggest wins, one line each"],
  executive: ["Three KPIs needing attention this week", "Red KPIs only — one line each", "Which KPIs moved most vs last term?"],
  student: ["Biggest dropoff stage and why", "Retention trend in one paragraph", "Cohort with highest risk"],
  profile: ["Top 3 risk factors", "Recommended interventions, ranked", "How does this student compare to peers?"],
  equity: ["Three largest equity gaps", "Top action to close the biggest gap", "Equity score trend over time"],
  teacher: ["Top 3 teacher metrics", "Where do we need PD most?", "Quality vs tenure — one paragraph"],
  quality: ["Inspection coverage in one line", "Schools flagged red", "Top 3 schools at risk"],
  efficiency: ["Cost per student vs target", "Top 3 areas to optimize", "Headcount trend in one paragraph"],
};

const FOLLOWUP_PROMPTS = ["Why?", "Show details", "What should we do?"];

const TypingDots = () => (
  <div className="flex items-center gap-1 py-1" aria-label="Assistant is thinking">
    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-chat-dot" />
    <span
      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-chat-dot"
      style={{ animationDelay: "150ms" }}
    />
    <span
      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-chat-dot"
      style={{ animationDelay: "300ms" }}
    />
  </div>
);

const StreamingCursor = () => (
  <span
    className="inline-block w-[3px] h-3.5 -mb-0.5 ml-0.5 bg-foreground/70 align-middle animate-chat-cursor"
    aria-hidden
  />
);

const ToolCard = ({ tool }: { tool: ToolInvocation }) => {
  const [open, setOpen] = useState(false);
  const dotColor =
    tool.status === "running"
      ? "bg-[hsl(var(--status-amber-accent))]"
      : tool.status === "failed"
        ? "bg-destructive"
        : "bg-[hsl(var(--status-green-accent))]";
  const summary =
    tool.status === "running"
      ? "running…"
      : tool.status === "failed"
        ? "failed"
        : tool.result !== undefined && tool.result !== null
          ? String(tool.result)
          : "ok";
  return (
    <div className="rounded-md border border-border/70 bg-background/70 text-xs mb-2 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-muted/40 text-left"
      >
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full shrink-0",
            dotColor,
            tool.status === "running" && "animate-pulse",
          )}
        />
        <Wrench className="h-3 w-3 text-muted-foreground shrink-0" />
        <code className="font-mono text-[11px] text-foreground truncate">
          {tool.name}
        </code>
        <span className="text-muted-foreground ml-auto truncate max-w-[40%] text-right">
          {summary}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="px-2.5 py-2 border-t border-border/70 bg-muted/30 space-y-2">
          {tool.args !== undefined && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                Input
              </div>
              <pre className="text-[11px] font-mono whitespace-pre-wrap break-all text-foreground/80">
                {typeof tool.args === "string"
                  ? tool.args
                  : JSON.stringify(tool.args, null, 2)}
              </pre>
            </div>
          )}
          {tool.result !== undefined && tool.result !== null && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                Result
              </div>
              <pre className="text-[11px] font-mono whitespace-pre-wrap break-all text-foreground/80">
                {String(tool.result)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChatPanel = ({
  messages,
  setMessages,
  streaming,
  setStreaming,
}: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottomRef = useRef(true);
  const { activeTab, pendingInput, consumePendingInput } = useDashboard();

  // Don't yank the user back to the bottom if they've scrolled up to read.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      stickToBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // When a card calls askAbout(), drop its question into the input box and
  // focus the textarea — but DON'T send. User reviews, edits if they want,
  // hits Enter themselves.
  useEffect(() => {
    if (!pendingInput) return;
    setInput(pendingInput);
    consumePendingInput();
    // Slight delay so the Sheet has time to mount the textarea on first open.
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }, [pendingInput, consumePendingInput]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const assistantMsg: ChatMessage = { role: "assistant", content: "" };
    const baseHistory = [...messages, userMsg];
    setMessages([...baseHistory, assistantMsg]);
    if (override === undefined) setInput("");
    setStreaming(true);
    stickToBottomRef.current = true;

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let answer = "";
    const toolCalls: ToolInvocation[] = [];

    const render = () => {
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        if (last && last.role === "assistant") {
          next[next.length - 1] = {
            ...last,
            content: answer,
            toolCalls: toolCalls.map((t) => ({ ...t })),
          };
        }
        return next;
      });
    };

    try {
      for await (const event of streamChat(
        {
          messages: baseHistory,
          context: { activeTab },
        },
        ctrl.signal,
      )) {
        if (event.type === "chunk") {
          answer += event.content;
          render();
        } else if (event.type === "tool_call") {
          toolCalls.push({ name: event.name, args: event.args, status: "running" });
          render();
        } else if (event.type === "tool_result") {
          const last = toolCalls[toolCalls.length - 1];
          if (last && last.status === "running" && last.name === event.name) {
            last.status = "done";
            last.result = event.count;
          } else {
            toolCalls.push({ name: event.name, status: "done", result: event.count });
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
            next[next.length - 1] = {
              ...last,
              content: `⚠ ${(err as Error).message}`,
            };
          }
          return next;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const starters = STARTER_PROMPTS[activeTab] ?? STARTER_PROMPTS.landing;
  const lastIdx = messages.length - 1;
  const lastMsg = messages[lastIdx];
  const showFollowups =
    !streaming &&
    lastMsg?.role === "assistant" &&
    (lastMsg.content?.length ?? 0) > 0;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="py-6">
            <p className="text-sm font-medium text-foreground">
              Ask about your dashboard
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              I can read every chart on this page.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const isLastAssistant = !isUser && i === messages.length - 1;
          return (
            <div
              key={i}
              className={cn("flex", isUser ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] px-3.5 py-2.5 text-sm break-words",
                  isUser
                    ? "bg-primary text-primary-foreground whitespace-pre-wrap rounded-2xl rounded-br-md shadow-sm"
                    : "bg-muted text-foreground rounded-2xl rounded-bl-md",
                )}
              >
                {isUser ? (
                  m.content
                ) : (
                  <>
                    {m.toolCalls?.map((tc, ti) => (
                      <ToolCard key={ti} tool={tc} />
                    ))}
                    {m.content ? (
                      <div
                        className={cn(
                          "prose prose-sm max-w-none dark:prose-invert",
                          "prose-p:my-2 prose-p:leading-relaxed prose-p:first:mt-0 prose-p:last:mb-0",
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
                        {streaming && isLastAssistant && <StreamingCursor />}
                      </div>
                    ) : streaming && isLastAssistant ? (
                      <TypingDots />
                    ) : null}
                  </>
                )}
              </div>
            </div>
          );
        })}
        {showFollowups && (
          <div className="flex flex-wrap gap-2 pl-1 pt-1">
            {FOLLOWUP_PROMPTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
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
        {streaming ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={stop}
            aria-label="Stop generating"
            title="Stop generating"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            aria-label="Send message"
            title="Send"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
};

export default ChatPanel;
