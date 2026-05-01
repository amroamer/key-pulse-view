from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ollama import AsyncClient
from pydantic import BaseModel

load_dotenv(Path(__file__).parent / ".env")

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

app = FastAPI(title="key-pulse-view assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:8081",
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


SYSTEM_PROMPT = (
    "You are an assistant embedded inside the KHDA KPIs dashboard, a UAE "
    "education-sector KPI portal. The dashboard has eight tabs covering: "
    "overview, executive summary, student journey, student profile, access & "
    "equity, teacher excellence, quality assurance, and institutional efficiency. "
    "Help the user understand what they are seeing on screen. Be concise and "
    "factual. If you don't have data, say so rather than inventing numbers."
)


def build_system_prompt(ctx: Optional[ScreenContext]) -> str:
    if ctx is None:
        return SYSTEM_PROMPT
    extras = [f"Current tab: {ctx.activeTab}."]
    if ctx.selectedStudent:
        extras.append(f"Selected student: {ctx.selectedStudent}.")
    return SYSTEM_PROMPT + "\n\n" + " ".join(extras)


@app.get("/api/health")
async def health() -> dict:
    return {"ok": True, "model": OLLAMA_MODEL, "host": OLLAMA_HOST}


@app.post("/api/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    client = AsyncClient(host=OLLAMA_HOST)

    msgs: list[dict] = [{"role": "system", "content": build_system_prompt(req.context)}]
    msgs.extend(m.model_dump() for m in req.messages)

    async def event_stream():
        try:
            async for chunk in await client.chat(
                model=OLLAMA_MODEL,
                messages=msgs,
                stream=True,
            ):
                content = chunk.get("message", {}).get("content", "") if isinstance(chunk, dict) else getattr(chunk.message, "content", "")
                if content:
                    yield f"data: {json.dumps({'type': 'chunk', 'content': content})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
        except Exception as exc:  # noqa: BLE001
            yield f"data: {json.dumps({'type': 'error', 'message': str(exc)})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8765, reload=True)
