import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface StatusSummaryBarProps {
  green: number;
  amber: number;
  red: number;
}

const StatusSummaryBar = ({ green, amber, red }: StatusSummaryBarProps) => {
  const total = green + amber + red;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-card border border-border px-5 py-3 shadow-sm">
      <span className="text-sm font-semibold text-foreground mr-2">KPI Status Overview</span>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full status-pill-green">
            <CheckCircle2 size={14} />
          </span>
          <span className="text-sm font-bold text-foreground">{green}</span>
          <span className="text-xs text-muted-foreground">On Track</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full status-pill-amber">
            <AlertTriangle size={14} />
          </span>
          <span className="text-sm font-bold text-foreground">{amber}</span>
          <span className="text-xs text-muted-foreground">At Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full status-pill-red">
            <XCircle size={14} />
          </span>
          <span className="text-sm font-bold text-foreground">{red}</span>
          <span className="text-xs text-muted-foreground">Off Track</span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="hidden sm:flex items-center gap-0 ml-auto rounded-full overflow-hidden h-2.5 w-40">
        <div className="h-full" style={{ width: `${(green / total) * 100}%`, background: "hsl(var(--status-green-accent))" }} />
        <div className="h-full" style={{ width: `${(amber / total) * 100}%`, background: "hsl(var(--status-amber-accent))" }} />
        <div className="h-full" style={{ width: `${(red / total) * 100}%`, background: "hsl(var(--status-red-accent))" }} />
      </div>
    </div>
  );
};

export default StatusSummaryBar;
