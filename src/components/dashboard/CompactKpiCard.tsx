import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import Sparkline from "./Sparkline";
import type { KpiData, AmpelaeStatus } from "./KpiCard";

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

/* ── Compact Card (Grid View) ── */
export const CompactKpiCard = ({ kpi }: { kpi: KpiData }) => {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={`group w-full text-left rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-px active:scale-[0.98] overflow-hidden focus-visible:ring-2 focus-visible:ring-ring outline-none`}
    >
      {/* Top row: status dot + name + e33 badge + value */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[kpi.status]}`} aria-label={statusLabel[kpi.status]} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground truncate">{kpi.name}</span>
            <span className="e33-badge shrink-0">{kpi.e33Code}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl font-extrabold text-foreground tracking-tight leading-none">{kpi.value}</span>
          <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.trendDirection === "up" ? "kpi-trend-up" : "kpi-trend-down"}`}>
            {kpi.trendDirection === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{kpi.trendPercent}</span>
          </div>
          <Sparkline data={kpi.sparklineData} width={64} height={24} status={kpi.status} />
          <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Expandable detail */}
      {open && (
        <div className="px-4 pb-3 pt-0 border-t border-border/50 animate-fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-6 mt-2.5 text-xs text-muted-foreground">
            <span>Target: <strong className="text-foreground">{kpi.target}</strong></span>
            <span>Gap: <strong className={kpi.gapPercent.startsWith("-") ? "kpi-trend-down" : "kpi-trend-up"}>{kpi.gap} ({kpi.gapPercent})</strong></span>
            {kpi.benchmark && <span>Benchmark: <strong className="text-foreground">{kpi.benchmark}</strong></span>}
            <span>Trend: <strong className="text-foreground">{kpi.trendValue} YoY</strong></span>
          </div>
          <div className="mt-2">
            <Sparkline data={kpi.sparklineData} width={320} height={36} status={kpi.status} />
          </div>
        </div>
      )}
    </button>
  );
};

/* ── List Row (Table View) ── */
export const KpiListRow = ({ kpi, onClick, isOpen }: { kpi: KpiData; onClick: () => void; isOpen: boolean }) => {
  return (
    <>
      <tr
        onClick={onClick}
        className="group cursor-pointer hover:bg-muted/40 transition-colors active:bg-muted/60"
      >
        <td className="py-2.5 px-3 w-8">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${statusDot[kpi.status]}`} />
        </td>
        <td className="py-2.5 px-2">
          <div className="flex items-center gap-2">
            <span className="text-foreground w-5 h-5 flex items-center justify-center opacity-60">{kpi.icon}</span>
            <span className="text-sm font-medium text-foreground">{kpi.name}</span>
          </div>
        </td>
        <td className="py-2.5 px-2">
          <span className="e33-badge">{kpi.e33Code}</span>
        </td>
        <td className="py-2.5 px-2 text-right">
          <span className="text-lg font-bold text-foreground tabular-nums">{kpi.value}</span>
          {kpi.unit && <span className="text-xs text-muted-foreground ml-1">{kpi.unit}</span>}
        </td>
        <td className="py-2.5 px-2 text-right">
          <span className="text-xs text-muted-foreground">{kpi.target}</span>
        </td>
        <td className="py-2.5 px-2 text-right">
          <span className={`text-xs font-medium ${kpi.trendDirection === "up" ? "kpi-trend-up" : "kpi-trend-down"} inline-flex items-center gap-0.5`}>
            {kpi.trendDirection === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {kpi.trendValue}
          </span>
        </td>
        <td className="py-2.5 px-2">
          <Sparkline data={kpi.sparklineData} width={72} height={22} status={kpi.status} />
        </td>
        <td className="py-2.5 px-2 text-right">
          <span className={`status-pill text-[10px] py-0.5 px-2 ${
            kpi.status === "green" ? "status-pill-green" : kpi.status === "amber" ? "status-pill-amber" : "status-pill-red"
          }`}>
            {statusLabel[kpi.status]}
          </span>
        </td>
        <td className="py-2.5 px-2 w-6">
          {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </td>
      </tr>
      {isOpen && (
        <tr className="animate-fade-in">
          <td colSpan={9} className="px-8 pb-3 pt-0">
            <div className="flex items-center gap-8 text-xs text-muted-foreground">
              <span>Gap: <strong className={kpi.gapPercent.startsWith("-") ? "kpi-trend-down" : "kpi-trend-up"}>{kpi.gap} ({kpi.gapPercent})</strong></span>
              {kpi.benchmark && <span>Benchmark: <strong className="text-foreground">{kpi.benchmark}</strong></span>}
              <span>YoY: <strong className="text-foreground">{kpi.trendPercent}</strong></span>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
