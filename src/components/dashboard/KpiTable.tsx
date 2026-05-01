import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ExternalLink } from "lucide-react";
import Sparkline from "./Sparkline";
import { executiveKpis } from "@/data/kpiData";
import type { AmpelaeStatus } from "./KpiCard";

const statusDot: Record<AmpelaeStatus, string> = {
  green: "bg-dashboard-green",
  amber: "bg-dashboard-amber",
  red: "bg-dashboard-red",
};

const statusLabel: Record<AmpelaeStatus, string> = {
  green: "On Track",
  amber: "At Risk",
  red: "Off Track",
};

type SortKey = "name" | "status" | "gap" | "trend";

const KpiTable = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("status");

  const sorted = [...executiveKpis].sort((a, b) => {
    switch (sortBy) {
      case "status": {
        const order = { red: 0, amber: 1, green: 2 };
        return order[a.status] - order[b.status];
      }
      case "gap":
        return Math.abs(parseFloat(b.gapPercent)) - Math.abs(parseFloat(a.gapPercent));
      case "trend":
        return parseFloat(b.trendPercent.replace("+", "")) - parseFloat(a.trendPercent.replace("+", ""));
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const SortBtn = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
    <button
      onClick={() => setSortBy(sortKey)}
      className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
        sortBy === sortKey ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">All KPIs</h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Sort:</span>
          <SortBtn label="Status" sortKey="status" />
          <SortBtn label="Gap" sortKey="gap" />
          <SortBtn label="Trend" sortKey="trend" />
          <SortBtn label="A-Z" sortKey="name" />
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {sorted.map((kpi) => {
          const isOpen = expandedId === kpi.id;
          return (
            <div key={kpi.id}>
              <button
                onClick={() => setExpandedId(isOpen ? null : kpi.id)}
                className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-muted/30 transition-colors active:bg-muted/50 group"
              >
                {/* Status */}
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[kpi.status]}`} />

                {/* Icon + Name */}
                <span className="flex items-center gap-2 w-[220px] shrink-0">
                  <span className="text-muted-foreground">{kpi.icon}</span>
                  <span className="text-sm font-medium text-foreground truncate">{kpi.name}</span>
                </span>

                {/* E33 Badge */}
                <span className="e33-badge shrink-0">{kpi.e33Code}</span>

                {/* Value */}
                <span className="text-lg font-extrabold text-foreground tabular-nums w-16 text-right shrink-0">{kpi.value}</span>

                {/* Target */}
                <span className="text-xs text-muted-foreground w-16 text-right shrink-0 hidden md:block">{kpi.target}</span>

                {/* Trend */}
                <span className={`flex items-center gap-1 text-xs font-medium w-20 justify-end shrink-0 ${kpi.trendDirection === "up" ? "kpi-trend-up" : "kpi-trend-down"}`}>
                  {kpi.trendDirection === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.trendValue}
                </span>

                {/* Sparkline */}
                <span className="hidden lg:block shrink-0">
                  <Sparkline data={kpi.sparklineData} width={80} height={24} status={kpi.status} />
                </span>

                {/* Status pill */}
                <span className={`status-pill text-[10px] py-0.5 px-2 ml-auto shrink-0 ${
                  kpi.status === "green" ? "status-pill-green" : kpi.status === "amber" ? "status-pill-amber" : "status-pill-red"
                }`}>
                  {statusLabel[kpi.status]}
                </span>

                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-10 pb-4 flex flex-col sm:flex-row items-start gap-6 animate-fade-in bg-muted/10">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <span>Gap: <strong className={parseFloat(kpi.gapPercent) < 0 ? "kpi-trend-down" : "kpi-trend-up"}>{kpi.gap} ({kpi.gapPercent})</strong></span>
                      {kpi.benchmark && <span>Benchmark: <strong className="text-foreground">{kpi.benchmark}</strong></span>}
                      <span>YoY Change: <strong className="text-foreground">{kpi.trendPercent}</strong></span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Data Source: Student Information System</p>
                      <p>Owner: Strategic Planning Division</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Sparkline data={kpi.sparklineData} width={200} height={48} status={kpi.status} />
                    <p className="text-[10px] text-muted-foreground mt-1 text-center">7-week trend</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KpiTable;
