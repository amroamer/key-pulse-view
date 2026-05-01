"""Tool definitions for the chat assistant.

Tools read live data from the JSON files mounted into the container at
`/data` (see `data_loader.py`). They cover every dashboard tab.
"""

from __future__ import annotations

from typing import Any

from data_loader import (
    PILLAR_TO_DATASETS,
    filter_by_status,
    get_dataset,
    get_kpi,
    get_pillar,
    get_student_profile,
    list_datasets,
    search,
    status_summary,
)

# ---------------------------------------------------------------------------
# Implementations
# ---------------------------------------------------------------------------


def _list_datasets(**_: Any) -> dict:
    return {"datasets": list_datasets(), "pillars": sorted(PILLAR_TO_DATASETS.keys())}


def _get_pillar_data(pillar: str, **_: Any) -> Any:
    return get_pillar(pillar)


def _get_dataset(name: str, **_: Any) -> Any:
    return get_dataset(name)


def _filter_by_status(dataset: str, status: str, **_: Any) -> Any:
    return filter_by_status(dataset, status)


def _status_summary(dataset: str | None = None, **_: Any) -> Any:
    return status_summary(dataset)


def _get_kpi(kpi_id: str, **_: Any) -> Any:
    return get_kpi(kpi_id)


def _search_data(query: str, **_: Any) -> Any:
    hits = search(query)
    return {"query": query, "count": len(hits), "hits": hits}


def _get_student(student_id: str, **_: Any) -> Any:
    return get_student_profile(student_id)


TOOL_IMPLS = {
    "list_datasets": _list_datasets,
    "get_pillar_data": _get_pillar_data,
    "get_dataset": _get_dataset,
    "filter_by_status": _filter_by_status,
    "status_summary": _status_summary,
    "get_kpi": _get_kpi,
    "search_data": _search_data,
    "get_student_profile": _get_student,
}


# ---------------------------------------------------------------------------
# JSON schemas for Ollama
# ---------------------------------------------------------------------------

PILLAR_NAMES = sorted(PILLAR_TO_DATASETS.keys())

TOOL_SCHEMAS: list[dict] = [
    {
        "type": "function",
        "function": {
            "name": "list_datasets",
            "description": (
                "List every dataset name (for `get_dataset`) and every pillar "
                "(for `get_pillar_data`). Call this first if you're unsure what "
                "is available."
            ),
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_pillar_data",
            "description": (
                "Return all datasets for a dashboard pillar/tab. Use for "
                "tab-overview questions like \"what's on the X tab?\" — NOT "
                "for single-metric questions, which should use get_dataset or "
                "get_kpi instead. "
                "Pillars: " + ", ".join(PILLAR_NAMES) + "."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "pillar": {
                        "type": "string",
                        "enum": PILLAR_NAMES,
                        "description": "The pillar (tab) to fetch.",
                    },
                },
                "required": ["pillar"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_dataset",
            "description": (
                "Return one specific dataset by name (e.g. "
                "'landing_system_health', 'equity_dimensions', "
                "'quality_school_ratings'). Use when you need a single table "
                "rather than a whole pillar — including for hero-metric "
                "questions like Total Schools, Total Students, Total "
                "Teachers, and System Score, which all live in "
                "'landing_system_health'. "
                "Call `list_datasets` first if you don't know the name."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Dataset name from `list_datasets`.",
                    },
                },
                "required": ["name"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "filter_by_status",
            "description": (
                "Return rows in a dataset whose `status` field matches "
                "(red / amber / green). Useful for 'which X are off-track' "
                "questions."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "dataset": {"type": "string", "description": "Dataset name."},
                    "status": {
                        "type": "string",
                        "enum": ["red", "amber", "green"],
                        "description": "Status to filter by.",
                    },
                },
                "required": ["dataset", "status"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "status_summary",
            "description": (
                "Red/amber/green rollup. With no argument, returns "
                "`{by_pillar: [{name, tab, red, amber, green, total}]}` "
                "sorted by red count desc, using user-facing pillar names. "
                "With `dataset`, returns counts for that single dataset plus "
                "its parent pillar's name. Use the no-arg call for "
                "'how are we doing overall?' or 'where are the biggest red KPIs?' "
                "questions — never echo internal dataset names like "
                "'equity_inclusion' to the user."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "dataset": {
                        "type": "string",
                        "description": "Optional dataset name (drill-down).",
                    },
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_kpi",
            "description": (
                "Return one executive-scoreboard KPI's full details by id "
                "(e.g. 'learning-gain', 'enrollment'). Use for single-KPI "
                "questions on the executive scoreboard."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "kpi_id": {"type": "string", "description": "KPI id."},
                },
                "required": ["kpi_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_data",
            "description": (
                "Fuzzy text search across every dataset. Use when the user asks "
                "about a topic that might appear in any pillar (a school name, "
                "a subject, a metric label, etc.) and you don't know which "
                "dataset to query."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Free-text search."},
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_student_profile",
            "description": (
                "Return everything known about a student: profile, milestones, "
                "academic records, risk dimensions, interventions."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "student_id": {
                        "type": "string",
                        "description": "Student id, e.g. 'STU-2024-0847'.",
                    },
                },
                "required": ["student_id"],
            },
        },
    },
]


def run_tool(name: str, args: dict, _snapshot_unused: Any = None) -> Any:
    """Dispatch a tool call by name.

    The third argument is kept for backward-compat with the previous
    snapshot-based call site in main.py and is ignored — tools now read
    from disk via `data_loader`.
    """
    impl = TOOL_IMPLS.get(name)
    if impl is None:
        return {"error": f"unknown tool: {name}"}
    try:
        return impl(**(args or {}))
    except TypeError as exc:
        return {"error": f"bad arguments for {name}: {exc}"}
