import type { DashboardTab } from "@/components/dashboard/DashboardTabs";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ScreenContext {
  activeTab: DashboardTab;
  selectedStudent?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  context?: ScreenContext;
}

export type ChatEvent =
  | { type: "chunk"; content: string }
  | { type: "tool_call"; name: string; args: unknown }
  | { type: "tool_result"; name: string; count?: number }
  | { type: "done" }
  | { type: "error"; message: string };

export async function* streamChat(
  req: ChatRequest,
  signal?: AbortSignal,
): AsyncGenerator<ChatEvent> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`Chat request failed: ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (!data) continue;
        try {
          yield JSON.parse(data) as ChatEvent;
        } catch {
          // ignore malformed chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
