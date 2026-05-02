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

from data_loader import get_pillar
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


class ChatRequest(BaseModel):
    messages: list[Message]
    context: Optional[ScreenContext] = None
    # Optional per-request model override. When omitted, falls back to
    # OLLAMA_MODEL env var. Set by the Settings page so the user can pick
    # whichever model is reliably available on their Ollama server.
    model: Optional[str] = None


# Map dashboard tab names (used in the frontend) to pillar keys the tools
# understand. Keep both sides aligned.
TAB_TO_PILLAR = {
    "landing": "executive",
    "overview": "executive",
    "executive": "executive",
    "student": "student",
    "profile": "profile",
    "equity": "equity",
    "teacher": "teacher",
    "quality": "quality",
    "efficiency": "efficiency",
}


SYSTEM_PROMPT = (
    "You are an assistant inside the KHDA KPIs dashboard, a UAE "
    "education-sector portal with eight tabs: overview, executive summary, "
    "student journey, student profile, access & equity, teacher excellence, "
    "quality assurance, institutional efficiency.\n\n"

    "## Output format\n\n"
    "- Lead with the value or fact. No preamble.\n"
    "- 1–3 sentences for value/status/\"tell me about\" questions.\n"
    "- Bullet list only when listing 3 or more items.\n"
    "- Quote metric names exactly as the tool returns them.\n"
    "- The visible summary below is grounding context — do NOT recap it "
    "unless the user explicitly asks for an overview.\n\n"
    "Never write any of these:\n"
    "- \"Let me check...\", \"I will use...\", \"I'll call...\", \"Here is the result...\"\n"
    "- \"Based on the data...\", \"From this output...\", \"Looking at this...\", "
    "\"According to...\"\n"
    "- \"In summary...\", \"Let me know if...\", \"I hope this helps...\", \"Certainly!\"\n\n"

    "## Examples\n\n"
    "User: Tell me about Total Schools.\n"
    "Assistant: **218 schools** in the system.\n\n"
    "User: Tell me about the System Score.\n"
    "Assistant: **74 / 85** (amber). Three pillars pull it down: Access & "
    "Equity (red, 68), Quality Assurance (71), and Student Performance (72).\n\n"
    "User: What's red right now?\n"
    "Assistant: One pillar is red:\n"
    "- **Access & Equity** — score 68 / target 85, 2 critical KPIs\n\n"
    "User: Tell me about the Teacher Excellence pillar.\n"
    "Assistant: Score **76 / 85** (amber, 1 critical KPI). The pillar covers "
    "teacher quality, professional development, and retention.\n\n"
    "User: Why is Total Students 361.5K?\n"
    "Assistant: That's the headcount across all 218 schools this term — up "
    "from last term's enrollment, driven by intake growth in primary years.\n\n"

    "## Tools\n\n"
    "Use a tool before answering anything specific to dashboard data. Never "
    "invent metric names or numbers.\n\n"
    "- `get_pillar_data(pillar)` — overview of one tab\n"
    "- `get_dataset(name)` — one specific table; call `list_datasets` if unsure\n"
    "- `filter_by_status(dataset, status)` — \"which X are red / amber / green\"\n"
    "- `status_summary()` — overall red/amber/green rollup\n"
    "- `get_kpi(id)` — single executive-scoreboard KPI\n"
    "- `search_data(query)` — topic could span pillars\n"
    "- `get_student_profile(id)` — full bundle for one student\n"
    "- `render_chart(dataset, chart_type)` — ONLY when the user asks to "
    "chart / graph / visualize / plot something. Pick bar / line / pie. "
    "After it runs, write one short caption — do not list the values.\n\n"

    "## Tool routing for common clicks\n\n"
    "When the user asks \"Tell me about <metric>\" or a sharper variant, use:\n"
    "- Total Students / Total Teachers / Total Schools / System Score / "
    "Student–Teacher Ratio → `get_dataset('landing_system_health')`\n"
    "- A pillar name (Executive Summary, Student Performance, Access & "
    "Equity, Teacher Excellence, Quality Assurance, Institutional "
    "Efficiency) → `get_pillar_data(<pillar>)`\n"
    "- A specific KPI from the executive scoreboard → "
    "`get_kpi(<kebab-case-id>)`\n"
    "- Anything else, or unsure → `search_data(<query>)`\n\n"

    "## Behavior rules\n\n"
    "- Never paste tool output as JSON or code blocks. Summarize in prose.\n"
    "- Never describe the UI (\"click here\", \"scroll down\", \"view the chart\").\n"
    "- On follow-ups (\"why?\", \"show details\", \"what should we do?\"), stay "
    "on the user's current tab unless they explicitly name another pillar.\n"
    "- If a tool returns nothing, say so plainly — don't guess.\n\n"

    "## Formatting\n\n"
    "Render markdown: **bold**, bullet lists, small tables, inline `code`.\n"
    "No h1/h2 headings — use **bold labels** for sections when needed."
)


def _format_visible_summary(pillar: str) -> str:
    """Return a short markdown summary of the values rendered on the active
    tab so the model can answer 'what's on screen' questions without tool calls."""
    data = get_pillar(pillar)
    if not isinstance(data, dict) or "error" in data:
        return ""
    lines: list[str] = []

    health = data.get("landing_system_health")
    if isinstance(health, dict):
        lines.append("Visible header metrics (overview / landing tab):")
        lines.append(f"- Total Students: {health.get('totalStudents')}")
        lines.append(f"- Total Teachers: {health.get('totalTeachers')}")
        lines.append(f"- Total Schools: {health.get('totalSchools')}")
        lines.append(
            f"- System Score: {health.get('systemScore')} (target {health.get('targetScore')})"
        )
        lines.append(f"- Student–Teacher Ratio: {health.get('studentTeacherRatio')}")

    pillars = data.get("landing_pillar_scores")
    if isinstance(pillars, list):
        lines.append("\nPillar scores visible on landing:")
        for p in pillars:
            lines.append(
                f"- {p['title']}: score {p['score']} / target {p['target']} ({p['status']}, {p['critical']} critical)"
            )

    journey_hero = data.get("journey_hero_metrics")
    if isinstance(journey_hero, list):
        lines.append("\nVisible header metrics (student journey tab):")
        for m in journey_hero:
            lines.append(f"- {m['label']}: {m['value']} ({m.get('sub','')})")

    if not lines:
        return ""
    return "\n".join(lines)


def build_system_prompt(ctx: Optional[ScreenContext]) -> str:
    if ctx is None:
        return SYSTEM_PROMPT

    pillar = TAB_TO_PILLAR.get(ctx.activeTab, ctx.activeTab)
    summary = _format_visible_summary(pillar)
    if summary:
        # Tab has visible-on-screen metrics — give the model the values, but
        # tell it not to recap them unless asked.
        header = (
            f"Current tab: {ctx.activeTab} (pillar `{pillar}`).\n\n"
            f"For deeper questions on this tab, call get_pillar_data(pillar='{pillar}').\n\n"
            f"The values below are visible on the user's screen right now. Use them "
            f"to ground specific answers, but do NOT recap or summarize them unless "
            f"the user explicitly asks for a tab overview. When the user asks about "
            f"ONE metric, answer about THAT metric only.\n\n"
            f"{summary}"
        )
    else:
        header = (
            f"Current tab: {ctx.activeTab} (pillar `{pillar}`). For deeper questions "
            f"call `get_pillar_data(pillar='{pillar}')`."
        )
    return SYSTEM_PROMPT + "\n\n" + header


@app.get("/api/health")
async def health() -> dict:
    return {"ok": True, "model": OLLAMA_MODEL, "host": OLLAMA_HOST}


@app.get("/api/models")
async def list_models() -> dict:
    """Proxy Ollama's /api/tags so the Settings page can show what's
    actually installed on the server. Returns `default` (the env-var fallback)
    so the UI can mark which model is used when no override is set."""
    try:
        client = AsyncClient(host=OLLAMA_HOST)
        result = await client.list()
        raw = (
            result.get("models", [])
            if isinstance(result, dict)
            else getattr(result, "models", [])
        )
        models: list[dict[str, Any]] = []
        for m in raw:
            entry = m if isinstance(m, dict) else m.model_dump()
            name = entry.get("name") or entry.get("model")
            if not name:
                continue
            models.append(
                {
                    "name": name,
                    "size": entry.get("size"),
                    "modified_at": (
                        entry.get("modified_at").isoformat()
                        if hasattr(entry.get("modified_at"), "isoformat")
                        else entry.get("modified_at")
                    ),
                }
            )
        models.sort(key=lambda m: m["name"])
        return {"models": models, "default": OLLAMA_MODEL}
    except Exception as exc:  # noqa: BLE001
        return {"error": str(exc), "models": [], "default": OLLAMA_MODEL}


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
    selected_model = req.model or OLLAMA_MODEL

    msgs: list[dict] = [
        {"role": "system", "content": build_system_prompt(req.context)}
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
                    model=selected_model,
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
                    result = run_tool(name, args)

                    # Chart tools emit a chart event AND return a short
                    # confirmation to the model so it doesn't list the values.
                    is_chart = (
                        isinstance(result, dict) and result.get("kind") == "chart"
                    )
                    if is_chart:
                        yield _sse(
                            {
                                "type": "chart",
                                "spec": result["spec"],
                            }
                        )
                        yield _sse(
                            {"type": "tool_result", "name": name, "count": None}
                        )
                        spec = result["spec"]
                        n = len(spec.get("data", []))
                        y_keys = ", ".join(spec.get("y", []))
                        tool_payload = (
                            f"Chart rendered: {spec['type']} chart titled "
                            f"'{spec.get('title')}' with {n} rows "
                            f"(x={spec.get('x')}, y={y_keys}). "
                            "The chart is now visible to the user. Now write "
                            "EXACTLY ONE short caption sentence — describe "
                            "the chart's shape only. Do NOT list, cite, "
                            "rank, or invent any specific numbers, names, "
                            "or values; they would just duplicate the chart "
                            "the user is already looking at. Good example: "
                            f"\"Bar chart of {spec.get('y', ['value'])[0]} "
                            f"across {n} items.\""
                        )
                        msgs.append(
                            {"role": "tool", "name": name, "content": tool_payload}
                        )
                    else:
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
