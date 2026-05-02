"""Tool definitions for the chat assistant.

Tools read live data from the JSON files mounted into the container at
`/data` (see `data_loader.py`). They cover every dashboard tab.
"""

from __future__ import annotations

import re
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
# Numeric coercion — many JSON values are formatted strings ("3.2%", "361.5K",
# "$1.2M", "≥5%"). Charts need numbers, so we parse them on the way out.
# ---------------------------------------------------------------------------

_NUMERIC_RE = re.compile(
    r"^(?P<sign>[+\-]?)\$?(?P<num>\d[\d,]*\.?\d*|\.\d+)\s*(?P<suffix>[%KMB]?)\s*$"
)
_SUFFIX_MULT = {"": 1, "%": 1, "K": 1_000, "M": 1_000_000, "B": 1_000_000_000}
_OPERATOR_PREFIX_RE = re.compile(r"^[≥≤<>≈~]+\s*")


def _to_number(v: Any) -> float | None:
    """Best-effort coercion of mixed-format scalars to a float.

    Returns None when the value isn't a number we can plot (booleans, "1:15"
    ratios, free text, etc.).
    """
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    if not isinstance(v, str):
        return None
    s = _OPERATOR_PREFIX_RE.sub("", v.strip())
    m = _NUMERIC_RE.match(s)
    if not m:
        return None
    try:
        val = float(m.group("num").replace(",", ""))
    except ValueError:
        return None
    if m.group("sign") == "-":
        val = -val
    return val * _SUFFIX_MULT.get(m.group("suffix") or "", 1)

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


_PREFERRED_X_KEYS = (
    "title", "name", "label", "category", "stage",
    "month", "term", "year", "period", "subject",
)
_PREFERRED_Y_KEYS = (
    "value", "current", "score", "count", "total",
    "amount", "rate", "pct", "percent",
)


def _numeric_keys(sample: dict) -> list[str]:
    """Field names whose values can be coerced to a number (int / float /
    formatted string like '3.2%' or '361.5K')."""
    return [k for k, v in sample.items() if _to_number(v) is not None]


def _chartable_datasets() -> list[str]:
    """Return dataset names that are lists of dicts with at least one
    coercibly-numeric field — the only shape `_render_chart` can plot."""
    from data_loader import _datasets  # type: ignore[attr-defined]

    out: list[str] = []
    for name, ds in _datasets().items():
        if not isinstance(ds, list) or not ds:
            continue
        if not isinstance(ds[0], dict):
            continue
        if _numeric_keys(ds[0]):
            out.append(name)
    return sorted(out)


def _render_chart(
    dataset: str,
    chart_type: str,
    x: str | None = None,
    y: list[str] | str | None = None,
    title: str | None = None,
    limit: int = 24,
    **_: Any,
) -> Any:
    """Build a chart spec the frontend can render with Recharts.

    The dataset must be a list of dicts with ≥1 numeric field. If `x` / `y`
    are omitted we prefer human-readable keys (`title`, `name`, `label`, …)
    for x and the first one or two numeric keys for y.
    """
    if chart_type not in {"bar", "line", "pie"}:
        return {
            "error": f"chart_type must be 'bar', 'line', or 'pie' (got '{chart_type}')",
        }

    rows = get_dataset(dataset)
    if isinstance(rows, dict) and "error" in rows:
        return {**rows, "chartable_datasets": _chartable_datasets()}
    if not isinstance(rows, list) or not rows or not all(isinstance(r, dict) for r in rows):
        return {
            "error": (
                f"dataset '{dataset}' is not chartable — must be a non-empty "
                "list of objects with at least one numeric field. Pick one of "
                "`chartable_datasets` instead."
            ),
            "chartable_datasets": _chartable_datasets(),
        }

    sample = rows[0]
    num_keys = _numeric_keys(sample)
    string_keys = [
        k for k, v in sample.items()
        if isinstance(v, str) and _to_number(v) is None
    ]

    if x is None:
        for pref in _PREFERRED_X_KEYS:
            if pref in sample and isinstance(sample[pref], str):
                x = pref
                break
        if x is None:
            x = string_keys[0] if string_keys else next(iter(sample.keys()), "name")

    if y is None:
        # Prefer well-known measure names; fall back to any numeric. Default
        # to a single series — multi-series only when the model asks for it.
        preferred = [k for k in _PREFERRED_Y_KEYS if k in num_keys]
        ordered = preferred + [k for k in num_keys if k not in preferred]
        y_list = ordered[:1]
    elif isinstance(y, str):
        y_list = [y]
    else:
        y_list = list(y)

    if not y_list:
        return {
            "error": (
                f"dataset '{dataset}' has no numeric fields to chart. "
                "Pick one of `chartable_datasets`."
            ),
            "chartable_datasets": _chartable_datasets(),
        }

    trimmed: list[dict] = []
    for r in rows[:limit]:
        row: dict[str, Any] = {x: r.get(x)}
        for k in y_list:
            row[k] = _to_number(r.get(k)) or 0
        trimmed.append(row)

    if not title:
        # 'overview_kpis' → 'Overview Kpis'; the frontend re-humanizes too,
        # but this gives the model something nicer when it cites the chart.
        title = dataset.replace("_", " ").title()

    return {
        "kind": "chart",
        "spec": {
            "type": chart_type,
            "title": title,
            "data": trimmed,
            "x": x,
            "y": y_list,
        },
    }


TOOL_IMPLS = {
    "list_datasets": _list_datasets,
    "get_pillar_data": _get_pillar_data,
    "get_dataset": _get_dataset,
    "filter_by_status": _filter_by_status,
    "status_summary": _status_summary,
    "get_kpi": _get_kpi,
    "search_data": _search_data,
    "get_student_profile": _get_student,
    "render_chart": _render_chart,
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
            "name": "render_chart",
            "description": (
                "Render a chart inline in the chat — bar, line, or pie. Use "
                "ONLY when the user explicitly asks to chart / graph / "
                "visualize / plot / show <something> as a chart. Do NOT call "
                "this for normal 'what's red' or 'tell me about' questions. "
                "Pick `chart_type`: 'bar' for category comparisons, 'line' "
                "for trends over time, 'pie' for share-of-total. "
                "`dataset` MUST be a list-of-objects dataset name, NOT a "
                "pillar/tab name. Common picks:\n"
                "- 'overview KPIs / scoreboard / executive KPIs' → "
                "'overview_kpis'\n"
                "- 'pillar scores' → 'landing_pillar_scores'\n"
                "- 'equity dimensions' → 'equity_dimensions'\n"
                "- 'school ratings' → 'quality_school_ratings'\n"
                "- 'budget' → 'efficiency_budget'\n"
                "- 'teacher quality bands' → 'teacher_quality_bands'\n"
                "- 'student journey stages' → 'journey_stages'\n"
                "Do NOT use 'landing_system_health' (it's a single object, "
                "not a list). When unsure, call `list_datasets` first. "
                "`x` and `y` are optional — omit them and the server picks "
                "human-readable defaults. After this tool runs, write ONE "
                "short caption sentence describing what the chart shows — "
                "e.g. \"Bar chart of current value across 12 KPIs.\" Do NOT "
                "invent numbers, ranges, counts, or pillar names that aren't "
                "in the data — describe shape only. The user can read the "
                "chart themselves."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "dataset": {
                        "type": "string",
                        "description": "Dataset name from `list_datasets`.",
                    },
                    "chart_type": {
                        "type": "string",
                        "enum": ["bar", "line", "pie"],
                        "description": "Which chart to render.",
                    },
                    "x": {
                        "type": "string",
                        "description": "Optional. Field name for x axis / pie label.",
                    },
                    "y": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Optional. Field names for y values (one or more numeric series).",
                    },
                    "title": {
                        "type": "string",
                        "description": "Optional chart title.",
                    },
                },
                "required": ["dataset", "chart_type"],
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
