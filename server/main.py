from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ollama import AsyncClient
from pydantic import BaseModel

from tools import TOOL_SCHEMAS, run_tool

load_dotenv(Path(__file__).parent / ".env")

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

# Cap how many tool-call rounds the model can take per user message.
# qwen2.5:7b typically resolves a question in 1-2 rounds; the cap
# protects against pathological loops.
MAX_TOOL_ROUNDS = 5

app = FastAPI(title="key-pulse-view assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ScreenContext(BaseModel):
    activeTab: str
    selectedStudent: Optional[str] = None


class ChatRequest(BaseModel):
    messages: list[Message]
    context: Optional[ScreenContext] = None
    kpiSnapshot: Optional[list[dict]] = None


SYSTEM_PROMPT = (
    "You are an assistant embedded inside the KHDA KPIs dashboard, a UAE "
    "education-sector KPI portal. The dashboard has eight tabs covering: "
    "overview, executive summary, student journey, student profile, access & "
    "equity, teacher excellence, quality assurance, and institutional efficiency.\n\n"
    "You have tools to read the live KPI data the user is looking at. **Always "
    "use the tools** before answering questions about KPI values, trends, "
    "targets, gaps, or status. Do not invent KPI names or numbers — call a "
    "tool, then base your answer strictly on what comes back.\n\n"
    "Formatting rules:\n"
    "- Render rich markdown: **bold**, bullet lists, tables, inline `code`.\n"
    "- Keep replies compact. Prefer short paragraphs, tight bullets, or a "
    "small table over deep heading hierarchies.\n"
    "- Avoid h1/h2 headings. Use **bold labels** for sections instead.\n"
    "- No filler ('Certainly!', 'Here is...'). Lead with the answer.\n\n"
    "Content rules:\n"
    "- When citing a KPI, use its real name and value as returned by the tool.\n"
    "- If a tool returns nothing, say so plainly rather than improvising."
)


def build_system_prompt(ctx: Optional[ScreenContext], snapshot_size: int) -> str:
    extras: list[str] = []
    if ctx is not None:
        extras.append(f"Current tab: {ctx.activeTab}.")
        if ctx.selectedStudent:
            extras.append(f"Selected student: {ctx.selectedStudent}.")
    if snapshot_size:
        extras.append(
            f"There are {snapshot_size} KPIs visible in the current data snapshot."
        )
    if not extras:
        return SYSTEM_PROMPT
    return SYSTEM_PROMPT + "\n\n" + " ".join(extras)


@app.get("/api/health")
async def health() -> dict:
    return {"ok": True, "model": OLLAMA_MODEL, "host": OLLAMA_HOST}


def _sse(event: dict) -> str:
    return f"data: {json.dumps(event)}\n\n"


def _result_count(result: Any) -> Optional[int]:
    if isinstance(result, list):
        return len(result)
    if isinstance(result, dict):
        if "total" in result and isinstance(result["total"], int):
            return result["total"]
    return None


@app.post("/api/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    client = AsyncClient(host=OLLAMA_HOST)
    snapshot = req.kpiSnapshot or []

    msgs: list[dict] = [
        {"role": "system", "content": build_system_prompt(req.context, len(snapshot))}
    ]
    msgs.extend(m.model_dump() for m in req.messages)

    async def event_stream():
        try:
            for _round in range(MAX_TOOL_ROUNDS):
                # Stream each round. Tool models (qwen2.5) emit either
                # content tokens *or* a tool_calls payload, not both, so
                # streaming is safe — we simply collect anything on the
                # way through and decide at end-of-round.
                accumulated = ""
                tool_calls: list = []

                async for chunk in await client.chat(
                    model=OLLAMA_MODEL,
                    messages=msgs,
                    tools=TOOL_SCHEMAS,
                    stream=True,
                    keep_alive=-1,
                ):
                    c = chunk if isinstance(chunk, dict) else chunk.model_dump()
                    msg = c.get("message", {}) or {}
                    delta = msg.get("content", "")
                    if delta:
                        accumulated += delta
                        yield _sse({"type": "chunk", "content": delta})
                    tcs = msg.get("tool_calls")
                    if tcs:
                        tool_calls = tcs

                # Record this turn in history.
                turn: dict = {"role": "assistant", "content": accumulated}
                if tool_calls:
                    turn["tool_calls"] = [
                        tc if isinstance(tc, dict) else tc.model_dump() for tc in tool_calls
                    ]
                msgs.append(turn)

                if not tool_calls:
                    yield _sse({"type": "done"})
                    return

                # Execute tools and feed results back into history.
                for tc in tool_calls:
                    fn = tc["function"] if isinstance(tc, dict) else tc.function
                    name = fn["name"] if isinstance(fn, dict) else fn.name
                    raw_args = (
                        fn.get("arguments") if isinstance(fn, dict) else fn.arguments
                    )
                    if isinstance(raw_args, str):
                        try:
                            args = json.loads(raw_args) if raw_args else {}
                        except json.JSONDecodeError:
                            args = {}
                    else:
                        args = dict(raw_args or {})

                    yield _sse({"type": "tool_call", "name": name, "args": args})
                    result = run_tool(name, args, snapshot)
                    yield _sse(
                        {
                            "type": "tool_result",
                            "name": name,
                            "count": _result_count(result),
                        }
                    )
                    msgs.append(
                        {
                            "role": "tool",
                            "name": name,
                            "content": json.dumps(result),
                        }
                    )

            yield _sse(
                {
                    "type": "error",
                    "message": f"reached max tool rounds ({MAX_TOOL_ROUNDS})",
                }
            )
        except Exception as exc:  # noqa: BLE001
            yield _sse({"type": "error", "message": str(exc)})

    return StreamingResponse(event_stream(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8765, reload=True)
