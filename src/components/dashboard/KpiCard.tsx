import { useState } from "react";
import { TrendingUp, TrendingDown, Info, MapPin, Users, MoreVertical } from "lucide-react";
import Sparkline from "./Sparkline";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { kpiTooltip } from "@/lib/tooltips";
import { useDashboard } from "@/contexts/DashboardContext";

export type AmpelaeStatus = "green" | "amber" | "red";

export interface KpiData {
  id: string;
  icon: React.ReactNode;
  name: string;
  e33Code: string;
  value: string;
  unit?: string;
  trendValue: string;
  trendDirection: "up" | "down";
  trendPercent: string;
  status: AmpelaeStatus;
  sparklineData: number[];
  target: string;
  gap: string;
  gapPercent: string;
  benchmark?: string;
}

const statusLabels: Record<AmpelaeStatus, string> = {
  green: "On Track",
  amber: "At Risk",
  red: "Off Track",
};

const KpiCard = ({ kpi }: { kpi: KpiData }) => {
  const [expanded, setExpanded] = useState(false);
  const { askAbout } = useDashboard();
  // Click anywhere on the card → pre-fill the chat with a question. The
  // small action-bar buttons (Info / Geo / Demo) stop propagation so they
  // don't double-fire.
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const cardStatusClass = {
    green: "card-status-green",
    amber: "card-status-amber",
    red: "card-status-red",
  }[kpi.status];

  const statusPillClass = {
    green: "status-pill-green",
    amber: "status-pill-amber",
    red: "status-pill-red",
  }[kpi.status];

  const statusIcon = {
    green: "🟢",
    amber: "🟡",
    red: "🔴",
  }[kpi.status];

  return (
    <Tooltip delayDuration={250}>
      <TooltipTrigger asChild>
    <div
      onClick={() => askAbout(`${kpi.name} — current value, target, and status in 2 sentences.`)}
      className={`group rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 ${cardStatusClass} overflow-hidden cursor-pointer`}
      style={{ minHeight: 340 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-foreground">
            {kpi.icon}
          </span>
          <span className="kpi-label truncate max-w-[200px]">{kpi.name}</span>
        </div>
        <span className="e33-badge">{kpi.e33Code}</span>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-border/50" />

      {/* Value */}
      <div className="px-5 py-4">
        <div className="kpi-value">{kpi.value}</div>
        {kpi.unit && <div className="text-sm text-muted-foreground mt-0.5">{kpi.unit}</div>}
      </div>

      {/* Trend + Status */}
      <div className="flex items-center justify-between px-5 pb-3">
        <div className={`flex items-center gap-1 ${kpi.trendDirection === "up" ? "kpi-trend-up" : "kpi-trend-down"}`}>
          {kpi.trendDirection === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{kpi.trendValue} ({kpi.trendPercent} YoY)</span>
        </div>
        <span className={`status-pill ${statusPillClass}`}>
          {statusIcon} {statusLabels[kpi.status]}
        </span>
      </div>

      {/* Sparkline */}
      <div className="px-5 pb-3">
        <Sparkline data={kpi.sparklineData} width={360} height={44} status={kpi.status} />
      </div>

      {/* Target / Gap */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Target: <strong className="text-foreground">{kpi.target}</strong></span>
          <span>Gap: <strong className={kpi.gapPercent.startsWith("-") ? "kpi-trend-down" : "kpi-trend-up"}>{kpi.gap} ({kpi.gapPercent})</strong></span>
        </div>
        {kpi.benchmark && (
          <div className="text-xs text-muted-foreground mt-1">
            Benchmark: <strong className="text-foreground">{kpi.benchmark}</strong>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div onClick={stop} className="flex items-center gap-1 px-4 pb-3 pt-1 border-t border-border/30">
        <button
          onClick={(e) => { stop(e); setExpanded(!expanded); }}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:scale-95"
          aria-label="More info"
        >
          <Info size={14} /> Info
        </button>
        <button onClick={stop} className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:scale-95" aria-label="Geo view">
          <MapPin size={14} /> Geo
        </button>
        <button onClick={stop} className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:scale-95" aria-label="Demographics">
          <Users size={14} /> Demo
        </button>
        <button onClick={stop} className="ml-auto flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:scale-95" aria-label="More options">
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Expanded info */}
      {expanded && (
        <div className="px-5 pb-4 text-xs text-muted-foreground border-t border-border/30 pt-3 animate-fade-in space-y-1">
          <p><strong>Data Source:</strong> Student Information System</p>
          <p><strong>Refresh:</strong> Weekly (Monday 6 AM)</p>
          <p><strong>Owner:</strong> Strategic Planning Division</p>
        </div>
      )}
    </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm leading-snug">{kpiTooltip(kpi)}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default KpiCard;
