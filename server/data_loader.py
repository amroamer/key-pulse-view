"""Read and shape dashboard data for the assistant tools.

The frontend keeps its mock data in JSON files under src/data, mounted into
this container as /data. We read them on demand (with a tiny cache) so the
assistant can answer questions about every tab without the frontend having
to round-trip data on every chat request.
"""

from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_DIR = Path(os.getenv("DATA_DIR", "/data"))


def _read_json(name: str) -> Any:
    path = DATA_DIR / name
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


@lru_cache(maxsize=1)
def _executive_kpis() -> list[dict]:
    """Top-level KPI scoreboard, with the React-only iconKey stripped out."""
    raw = _read_json("kpiData.json")
    return [{k: v for k, v in item.items() if k != "iconKey"} for item in raw]


@lru_cache(maxsize=1)
def _datasets() -> dict[str, Any]:
    """Build the registry of datasets exposed to tools.

    Keys are the names the model addresses (`overview_kpis`,
    `equity_dimensions`, ...). Values are the raw JSON-decoded data.
    """
    efficiency = _read_json("efficiencyData.json")
    equity = _read_json("equityData.json")
    quality = _read_json("qualityData.json")
    teacher = _read_json("teacherData.json")
    journey = _read_json("studentJourneyData.json")
    profile = _read_json("studentProfileData.json")
    landing = _read_json("landingData.json")
    hero_highlights = _read_json("heroHighlights.json")

    return {
        # Landing / Overview header
        "landing_system_health": landing["systemHealth"],
        "landing_pillar_scores": landing["strategicPillars"],
        "landing_system_flow": landing["systemFlow"],
        "landing_hero_highlights": hero_highlights,

        # Executive scoreboard
        "overview_kpis": _executive_kpis(),

        # Efficiency tab
        "efficiency_budget": efficiency["budgetCategories"],
        "efficiency_resources": efficiency["resourceMetrics"],
        "efficiency_cost_benchmarks": efficiency["costEfficiencyData"],
        "efficiency_operational_kpis": efficiency["operationalKPIs"],
        "efficiency_hero_metrics": efficiency["efficiencyHeroMetrics"],

        # Equity tab
        "equity_demographics": equity["demographicGroups"],
        "equity_gender": equity["genderData"],
        "equity_dimensions": equity["equityDimensions"],
        "equity_districts": equity["geoDistricts"],
        "equity_inclusion": equity["inclusionMetrics"],

        # Quality tab
        "quality_school_ratings": quality["schoolRatings"],
        "quality_inspections": quality["recentInspections"],
        "quality_compliance": quality["complianceAreas"],
        "quality_trajectories": quality["improvementTrajectories"],
        "quality_hero_metrics": quality["qualityHeroMetrics"],

        # Teacher tab
        "teacher_quality_bands": teacher["qualityBands"],
        "teacher_retention_cohorts": teacher["retentionCohorts"],
        "teacher_pd_programs": teacher["pdPrograms"],
        "teacher_hero_metrics": teacher["teacherHeroMetrics"],
        "teacher_by_subject": teacher["teacherBySubject"],

        # Student Journey tab
        "journey_hero_metrics": journey["journeyHeroMetrics"],
        "journey_stages": journey["journeyStages"],
        "journey_transitions": journey["transitions"],
        "journey_cohort_trends": journey["cohortTrends"],
        "journey_risk_matrix": journey["riskMatrix"],

        # Student Profile tab
        "students": profile["sampleStudents"],
        "student_milestones": profile["milestones"],
        "student_academic_records": profile["academicRecords"],
        "student_risk_dimensions": profile["riskDimensions"],
        "student_interventions": profile["interventions"],
    }


# Display-ready metadata for each strategic pillar. Used by status_summary()
# so the model cites user-facing pillar names ("Access & Equity") instead of
# internal dataset keys like `equity_inclusion`.
PILLAR_REGISTRY: list[dict[str, str]] = [
    {"key": "executive",  "name": "Executive Summary",       "slug": "pillar-executive",  "tab": "executive"},
    {"key": "student",    "name": "Student Performance",     "slug": "pillar-student",    "tab": "student"},
    {"key": "equity",     "name": "Access & Equity",         "slug": "pillar-equity",     "tab": "equity"},
    {"key": "teacher",    "name": "Teacher Excellence",      "slug": "pillar-teacher",    "tab": "teacher"},
    {"key": "quality",    "name": "Quality Assurance",       "slug": "pillar-quality",    "tab": "quality"},
    {"key": "efficiency", "name": "Institutional Efficiency","slug": "pillar-efficiency", "tab": "efficiency"},
]
PILLAR_BY_KEY: dict[str, dict[str, str]] = {p["key"]: p for p in PILLAR_REGISTRY}


PILLAR_TO_DATASETS: dict[str, list[str]] = {
    "executive": [
        "landing_system_health",
        "landing_pillar_scores",
        "overview_kpis",
    ],
    "landing": [
        "landing_system_health",
        "landing_pillar_scores",
        "overview_kpis",
    ],
    "overview": [
        "landing_system_health",
        "landing_pillar_scores",
        "overview_kpis",
    ],
    "efficiency": [
        "efficiency_hero_metrics",
        "efficiency_budget",
        "efficiency_resources",
        "efficiency_cost_benchmarks",
        "efficiency_operational_kpis",
    ],
    "equity": [
        "equity_dimensions",
        "equity_demographics",
        "equity_gender",
        "equity_districts",
        "equity_inclusion",
    ],
    "quality": [
        "quality_hero_metrics",
        "quality_school_ratings",
        "quality_inspections",
        "quality_compliance",
        "quality_trajectories",
    ],
    "teacher": [
        "teacher_hero_metrics",
        "teacher_quality_bands",
        "teacher_retention_cohorts",
        "teacher_pd_programs",
        "teacher_by_subject",
    ],
    "student": [
        "journey_hero_metrics",
        "journey_stages",
        "journey_transitions",
        "journey_cohort_trends",
        "journey_risk_matrix",
    ],
    "profile": [
        "students",
    ],
}


def list_datasets() -> list[str]:
    return sorted(_datasets().keys())


def get_dataset(name: str) -> Any:
    data = _datasets()
    if name not in data:
        return {"error": f"unknown dataset '{name}'", "available": sorted(data.keys())}
    return data[name]


def get_pillar(name: str) -> dict[str, Any]:
    """Return all datasets that make up a tab/pillar, keyed by dataset name."""
    pillar_key = name.lower()
    dataset_names = PILLAR_TO_DATASETS.get(pillar_key)
    if not dataset_names:
        return {
            "error": f"unknown pillar '{name}'",
            "available": sorted(PILLAR_TO_DATASETS.keys()),
        }
    data = _datasets()
    return {ds: data[ds] for ds in dataset_names if ds in data}


def get_kpi(kpi_id: str) -> Any:
    for k in _executive_kpis():
        if k.get("id") == kpi_id:
            return k
    return {"error": f"unknown kpi '{kpi_id}'"}


def filter_by_status(name: str, status: str) -> Any:
    """Filter any dataset that has a string `status` field."""
    data = get_dataset(name)
    if isinstance(data, dict) and "error" in data:
        return data
    if not isinstance(data, list):
        return {"error": f"dataset '{name}' is not a list and cannot be filtered by status"}
    rows = [r for r in data if isinstance(r, dict) and r.get("status") == status]
    return rows


def _dataset_to_pillar_key(ds_name: str) -> str | None:
    """Given a dataset name, return the canonical pillar key it belongs to.
    Skips the landing/overview aliases that share datasets with executive."""
    for key in PILLAR_BY_KEY:
        if ds_name in PILLAR_TO_DATASETS.get(key, []):
            return key
    return None


def status_summary(name: str | None = None) -> Any:
    """Red/amber/green rollup for the dashboard.

    With no argument: returns a pillar-level rollup using user-facing display
    names + frontend slugs. The model should cite these names in its replies
    and wrap them as `[Display Name](#kpi:slug)` links.

    With a dataset name: returns counts for that specific dataset, enriched
    with the parent pillar's display name + slug so links still work.
    """
    data = _datasets()

    if name:
        if name not in data:
            return {"error": f"unknown dataset '{name}'"}
        summary = _summarise(name, data[name])
        if summary is None:
            return {"error": f"dataset '{name}' has no status fields"}
        pillar_key = _dataset_to_pillar_key(name)
        if pillar_key:
            pillar = PILLAR_BY_KEY[pillar_key]
            summary["pillar"] = {"name": pillar["name"], "slug": pillar["slug"]}
        return summary

    # Pillar-level rollup. Iterate the 6 canonical pillars (skip landing/
    # overview aliases) so each dataset is counted exactly once.
    rows: list[dict[str, Any]] = []
    for pillar in PILLAR_REGISTRY:
        ds_names = PILLAR_TO_DATASETS.get(pillar["key"], [])
        red = amber = green = total = 0
        for ds in ds_names:
            if ds not in data:
                continue
            s = _summarise(ds, data[ds])
            if not s:
                continue
            red += s["red"]
            amber += s["amber"]
            green += s["green"]
            total += s["total"]
        if total == 0:
            continue
        rows.append({
            "name": pillar["name"],
            "slug": pillar["slug"],
            "tab": pillar["tab"],
            "red": red,
            "amber": amber,
            "green": green,
            "total": total,
        })

    rows.sort(key=lambda r: (-r["red"], -r["amber"], r["name"]))
    return {"by_pillar": rows}


def _summarise(name: str, ds: Any) -> dict | None:
    if not isinstance(ds, list):
        return None
    counts = {"red": 0, "amber": 0, "green": 0}
    total_with_status = 0
    for row in ds:
        if not isinstance(row, dict):
            continue
        status = row.get("status") or row.get("currentStatus") or row.get("overallStatus")
        if status in counts:
            counts[status] += 1
            total_with_status += 1
    if total_with_status == 0:
        return None
    return {"total": total_with_status, **counts}


def search(query: str, limit: int = 12) -> list[dict]:
    """Naive string-contains search across every dataset row."""
    needle = query.lower().strip()
    if not needle:
        return []
    hits: list[dict] = []
    for name, ds in _datasets().items():
        if isinstance(ds, list):
            for row in ds:
                if not isinstance(row, dict):
                    continue
                blob = json.dumps(row, ensure_ascii=False).lower()
                if needle in blob:
                    hits.append({"dataset": name, "row": row})
                    if len(hits) >= limit:
                        return hits
        elif isinstance(ds, dict):
            for sub_key, sub_val in ds.items():
                blob = json.dumps({sub_key: sub_val}, ensure_ascii=False).lower()
                if needle in blob:
                    hits.append({"dataset": name, "key": sub_key, "row": sub_val})
                    if len(hits) >= limit:
                        return hits
    return hits


def get_student_profile(student_id: str) -> dict:
    """Aggregate everything we know about one student."""
    data = _datasets()
    students_by_id = {s["id"]: s for s in data["students"]}
    if student_id not in students_by_id:
        return {
            "error": f"unknown student '{student_id}'",
            "available_ids": list(students_by_id.keys()),
        }
    return {
        "profile": students_by_id[student_id],
        "milestones": data["student_milestones"].get(student_id, []),
        "academic_records": data["student_academic_records"].get(student_id, []),
        "risk_dimensions": data["student_risk_dimensions"].get(student_id, []),
        "interventions": data["student_interventions"].get(student_id, []),
    }
