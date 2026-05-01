import { useEffect, useState } from "react";
import { Bot, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDashboard } from "@/contexts/DashboardContext";
import type { DashboardTab } from "@/components/dashboard/DashboardTabs";
import ChatPanel from "./ChatPanel";
import type { ChatMessage } from "@/lib/chatClient";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kpv:chat-history";

const TAB_LABELS: Record<DashboardTab, string> = {
  landing: "Overview",
  executive: "Executive Summary",
  student: "Student Journey",
  profile: "Student Profile",
  equity: "Access & Equity",
  teacher: "Teacher Excellence",
  quality: "Quality Assurance",
  efficiency: "Institutional Efficiency",
};

const loadHistory = (): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChatMessage[]) : [];
  } catch {
    return [];
  }
};

const ChatBubble = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [streaming, setStreaming] = useState(false);
  const { activeTab, chatOpen, setChatOpen } = useDashboard();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // quota or disabled storage — fall through silently
    }
  }, [messages]);

  return (
    <Sheet open={chatOpen} onOpenChange={setChatOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          aria-label="Open assistant"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-[hsl(var(--info))] hover:bg-[hsl(var(--info))]/90 text-[hsl(var(--info-foreground))]"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b px-4 py-3 space-y-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                    streaming
                      ? "bg-[hsl(var(--status-amber-accent))] animate-pulse"
                      : "bg-[hsl(var(--status-green-accent))]",
                  )}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 text-left">
                <SheetTitle className="text-sm leading-tight">Assistant</SheetTitle>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  {streaming ? "Thinking…" : "Online · reads this dashboard"}
                </div>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mr-6 text-muted-foreground hover:text-foreground shrink-0"
                  disabled={messages.length === 0}
                  aria-label="Clear chat history"
                  title="Clear chat history"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the current conversation. You can't undo this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setMessages([])}>
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Context
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium">
              {TAB_LABELS[activeTab]}
            </span>
          </div>
        </SheetHeader>
        <ChatPanel
          messages={messages}
          setMessages={setMessages}
          streaming={streaming}
          setStreaming={setStreaming}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatBubble;
