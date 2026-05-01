"""Tests for the structured `status_summary()` output (pillar rollup).

The drilldown tool was removed when the card-click investigation flow was
cut, but the status_summary improvements stayed because the system prompt
relies on user-facing pillar names + slugs (no more "equity_inclusion"
dataset names leaking into chat replies).

Run inside the api container:

    docker exec kpv-api python -m unittest test_drilldown -v
"""

from __future__ import annotations

import unittest

from data_loader import status_summary


class TestStatusSummary(unittest.TestCase):
    def test_no_arg_returns_by_pillar_with_display_names(self):
        result = status_summary()
        self.assertIn("by_pillar", result)
        for row in result["by_pillar"]:
            # Display-ready, not internal dataset names like 'equity_inclusion'
            self.assertNotIn("_", row["name"])
            self.assertTrue(row["slug"].startswith("pillar-"))
            self.assertIn(
                row["tab"],
                {"executive", "student", "equity", "teacher", "quality", "efficiency"},
            )

    def test_pillars_sorted_by_red_count_desc(self):
        rows = status_summary()["by_pillar"]
        red_counts = [r["red"] for r in rows]
        self.assertEqual(red_counts, sorted(red_counts, reverse=True))

    def test_drill_down_with_dataset_name_includes_parent_pillar(self):
        result = status_summary("equity_inclusion")
        self.assertIn("pillar", result)
        self.assertEqual(result["pillar"]["slug"], "pillar-equity")
        self.assertEqual(result["pillar"]["name"], "Access & Equity")

    def test_unknown_dataset_returns_error(self):
        result = status_summary("not-a-real-dataset")
        self.assertIn("error", result)


if __name__ == "__main__":
    unittest.main()
