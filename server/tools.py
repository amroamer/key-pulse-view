"""Tool definitions for the chat assistant.

Tools operate on a KPI snapshot the frontend sends with each chat request.
This avoids the server needing to import or re-render the React-side data
files. Each tool returns plain JSON-serialisable Python objects.
"""

from __future__ import annotations

from typing import Any, Callable


def _filter_status(snapshot: list[dict], status: str) -> list[dict]:
    return [k for k in snapshot if k.get("status") == status]


def _by_id(snapshot: list[dict], kpi_id: str) -> dict | None:
    for k in snapshot:
        if k.get("id") == kpi_id:
            return k
    return None


def get_all_kpis(snapshot: list[dict], pillar: str | None = None) -> list[dict]:
    if pillar:
        return [k for k in snapshot if k.get("pillar") == pillar]
    return list(snapshot)


def get_red_kpis(snapshot: list[dict]) -> list[dict]:
    return _filter_status(snapshot, "red")


def get_amber_kpis(snapshot: list[dict]) -> list[dict]:
    return _filter_status(snapshot, "amber")


def get_green_kpis(snapshot: list[dict]) -> list[dict]:
    return _filter_status(snapshot, "green")


def get_kpi(snapshot: list[dict], kpi_id: str) -> dict | None:
    return _by_id(snapshot, kpi_id)


def status_summary(snapshot: list[dict]) -> dict:
    return {
        "total": len(snapshot),
        "red": sum(1 for k in snapshot if k.get("status") == "red"),
        "amber": sum(1 for k in snapshot if k.get("status") == "amber"),
        "green": sum(1 for k in snapshot if k.get("status") == "green"),
    }


# Tool dispatch table. Each entry maps a tool name to a callable that takes
# (snapshot, **kwargs) and returns a JSON-serialisable result.
TOOL_IMPLS: dict[str, Callable[..., Any]] = {
    "get_all_kpis": get_all_kpis,
    "get_red_kpis": get_red_kpis,
    "get_amber_kpis": get_amber_kpis,
    "get_green_kpis": get_green_kpis,
    "get_kpi": get_kpi,
    "status_summary": status_summary,
}


# Tool schemas, in the OpenAI-compatible function-calling format that
# Ollama's qwen2.5 (and other tool-enabled models) understands.
TOOL_SCHEMAS: list[dict] = [
    {
        "type": "function",
        "function": {
            "name": "get_all_kpis",
            "description": "Return every KPI on the dashboard. Optionally filter by pillar.",
            "parameters": {
                "type": "object",
                "properties": {
                    "pillar": {
                        "type": "string",
                        "description": "Optional pillar to filter by (e.g. 'executive').",
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_red_kpis",
            "description": "Return all KPIs with status 'red' (off-track / underperforming).",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_amber_kpis",
            "description": "Return all KPIs with status 'amber' (at-risk).",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_green_kpis",
            "description": "Return all KPIs with status 'green' (on-track).",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_kpi",
            "description": "Return one KPI's full details by its id (e.g. 'learning-gain').",
            "parameters": {
                "type": "object",
                "properties": {
                    "kpi_id": {
                        "type": "string",
                        "description": "The KPI id, e.g. 'learning-gain' or 'enrollment'.",
                    },
                },
                "required": ["kpi_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "status_summary",
            "description": "Return counts of KPIs by status (red, amber, green) plus total.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
]


def run_tool(name: str, args: dict, snapshot: list[dict]) -> Any:
    """Dispatch a tool call by name. Returns the tool's raw output."""
    impl = TOOL_IMPLS.get(name)
    if impl is None:
        return {"error": f"unknown tool: {name}"}
    try:
        return impl(snapshot, **(args or {}))
    except TypeError as exc:
        return {"error": f"bad arguments for {name}: {exc}"}
