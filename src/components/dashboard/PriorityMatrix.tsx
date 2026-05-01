import { executiveKpis } from "@/data/kpiData";

/**
 * BCG Priority Matrix — plots KPIs on a 2D space:
 * X-axis: Gap to target (how far behind)
 * Y-axis: Trend momentum (YoY improvement rate)
 * Bubble color: Ampelae status
 * This tells executives: "Where should we intervene?"
 */

const statusColors = {
  green: "hsl(var(--status-green-accent))",
  amber: "hsl(var(--status-amber-accent))",
  red: "hsl(var(--status-red-accent))",
};

const statusBg = {
  green: "hsl(var(--status-green-accent) / 0.15)",
  amber: "hsl(var(--status-amber-accent) / 0.15)",
  red: "hsl(var(--status-red-accent) / 0.15)",
};

// Parse gap percent to a number
const parseGap = (gapPct: string) => Math.abs(parseFloat(gapPct.replace("%", "")));
// Parse trend percent
const parseTrend = (trendPct: string) => parseFloat(trendPct.replace("%", "").replace("+", ""));

const PriorityMatrix = () => {
  const points = executiveKpis.map((kpi) => ({
    ...kpi,
    gapVal: parseGap(kpi.gapPercent),
    trendVal: parseTrend(kpi.trendPercent),
  }));

  const maxGap = Math.max(...points.map((p) => p.gapVal), 1);
  const maxTrend = Math.max(...points.map((p) => Math.abs(p.trendVal)), 1);

  const chartW = 100; // percentage-based
  const chartH = 100;

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Strategic Priority Matrix</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Gap to target vs. improvement momentum — top-right needs urgent attention</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          {(["red", "amber", "green"] as const).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: statusColors[s] }} />
              {s === "red" ? "Off Track" : s === "amber" ? "At Risk" : "On Track"}
            </span>
          ))}
        </div>
      </div>

      <div className="relative w-full" style={{ paddingBottom: "50%" }}>
        <div className="absolute inset-0">
          {/* Quadrant backgrounds */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden">
            <div className="bg-muted/20 border-r border-b border-border/30" /> {/* Low gap, high trend = MONITOR */}
            <div className="bg-muted/40 border-b border-border/30" /> {/* High gap, high trend = ACCELERATE */}
            <div className="bg-muted/10 border-r border-border/30" /> {/* Low gap, low trend = MAINTAIN */}
            <div style={{ background: "hsl(var(--status-red-accent) / 0.06)" }} /> {/* High gap, low trend = INTERVENE */}
          </div>

          {/* Quadrant labels */}
          <span className="absolute top-2 left-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">Monitor</span>
          <span className="absolute top-2 right-3 text-[9px] font-bold uppercase tracking-wider text-dashboard-amber/70">Accelerate</span>
          <span className="absolute bottom-2 left-3 text-[9px] font-bold uppercase tracking-wider text-primary/50">Maintain</span>
          <span className="absolute bottom-2 right-3 text-[9px] font-bold uppercase tracking-wider text-dashboard-red/70">Intervene</span>

          {/* Axis labels */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">← Small Gap | Large Gap →</span>
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground whitespace-nowrap origin-center">← Low Momentum | High Momentum →</span>

          {/* Data points */}
          {points.map((p) => {
            const x = (p.gapVal / maxGap) * 90 + 5; // 5-95% range
            const y = 95 - (Math.abs(p.trendVal) / maxTrend) * 90; // inverted Y

            return (
              <div
                key={p.id}
                className="absolute group/dot"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-card shadow-sm hover:scale-150 transition-transform duration-200 cursor-pointer"
                  style={{ background: statusColors[p.status] }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/dot:block z-10">
                  <div className="bg-foreground text-card rounded-lg px-3 py-2 text-[10px] whitespace-nowrap shadow-lg">
                    <p className="font-bold">{p.name}</p>
                    <p>Value: {p.value} | Gap: {p.gapPercent} | Trend: {p.trendPercent}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriorityMatrix;
