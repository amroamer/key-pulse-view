import type { DashboardTab } from "@/components/dashboard/DashboardTabs";

export interface ToolInvocation {
  name: string;
  args?: unknown;
  status: "running" | "done" | "failed";
  result?: unknown;
}

export type ChartType = "bar" | "line" | "pie";

export interface ChartSpec {
  type: ChartType;
  title?: string;
  data: Array<Record<string, string | number>>;
  /** Field name on each row used for the x axis (or pie slice label). */
  x: string;
  /** Field name(s) on each row used for y values (one or more series). */
  y: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolInvocation[];
  charts?: ChartSpec[];
}

export interface ScreenContext {
  activeTab: DashboardTab;
}

export interface ChatRequest {
  messages: ChatMessage[];
  context?: ScreenContext;
  /** Override the server's default LLM. Set by the Settings page via
   * localStorage; omit to use the server's `OLLAMA_MODEL` default. */
  model?: string;
}

export interface ModelInfo {
  name: string;
  size?: number;
  modified_at?: string;
}

export interface ListModelsResponse {
  models: ModelInfo[];
  /** The server's fallback model (env-var default). Used to mark which
   * model is in effect when the user hasn't picked an override. */
  default: string;
  /** Populated when the model server (Ollama) is unreachable. */
  error?: string;
}

export async function listModels(): Promise<ListModelsResponse> {
  const res = await fetch("/api/models");
  if (!res.ok) {
    throw new Error(`Failed to list models: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export type ChatEvent =
  | { type: "chunk"; content: string }
  | { type: "tool_call"; name: string; args: unknown }
  | { type: "tool_result"; name: string; count?: number }
  | { type: "chart"; spec: ChartSpec }
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
