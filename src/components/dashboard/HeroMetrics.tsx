import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { executiveKpis } from "@/data/kpiData";

/**
 * BCG-style hero strip: 4 headline metrics pulled from KPIs,
 * each with a different visual treatment.
 */
const highlights = [
  { id: "learning-gain", label: "Learning Gain", prefix: "", suffix: "" },
  { id: "enrollment", label: "Enrollment", prefix: "", suffix: "" },
  { id: "teacher-quality", label: "Teacher Quality", prefix: "", suffix: "/100" },
  { id: "budget-execution", label: "Budget Execution", prefix: "", suffix: "" },
];

const HeroMetrics = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {highlights.map((h, i) => {
        const kpi = executiveKpis.find((k) => k.id === h.id)!;
        const isUp = kpi.trendDirection === "up";
        const statusBorder = {
          green: "border-l-dashboard-green",
          amber: "border-l-dashboard-amber",
          red: "border-l-dashboard-red",
        }[kpi.status];

        return (
          <div
            key={h.id}
            className={`relative bg-card rounded-xl border border-border border-l-4 ${statusBorder} p-5 shadow-sm hover:shadow-md transition-shadow duration-200 group`}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{h.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight" style={{ lineHeight: 1.1 }}>
                {kpi.value}
              </span>
              {h.suffix && <span className="text-sm text-muted-foreground font-medium">{h.suffix}</span>}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isUp ? "kpi-trend-up" : "kpi-trend-down"}`}>
                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trendValue} YoY
              </span>
              <span className="text-xs text-muted-foreground">→ Target {kpi.target}</span>
            </div>
            {/* Progress toward target */}
            <div className="mt-3">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (parseFloat(kpi.value) / parseFloat(kpi.target.replace(/[≥%]/g, "").split("–")[0])) * 100)}%`,
                    background: `hsl(var(--status-${kpi.status === "green" ? "green" : kpi.status === "amber" ? "amber" : "red"}-accent))`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroMetrics;
