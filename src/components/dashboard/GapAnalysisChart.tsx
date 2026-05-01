import { executiveKpis } from "@/data/kpiData";

/**
 * Horizontal bar chart showing gap-to-target for each KPI.
 * Sorted worst-first so executives see what needs attention immediately.
 */

const statusColor = {
  green: "hsl(var(--status-green-accent))",
  amber: "hsl(var(--status-amber-accent))",
  red: "hsl(var(--status-red-accent))",
};

const GapAnalysisChart = () => {
  const sorted = [...executiveKpis].sort((a, b) => {
    const gapA = Math.abs(parseFloat(a.gapPercent.replace("%", "")));
    const gapB = Math.abs(parseFloat(b.gapPercent.replace("%", "")));
    return gapB - gapA;
  });

  const maxGap = Math.max(...sorted.map((k) => Math.abs(parseFloat(k.gapPercent.replace("%", "")))));

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Gap to Target Analysis</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Sorted by largest gap — focus resources where the gap is widest</p>
      </div>

      <div className="space-y-2">
        {sorted.map((kpi) => {
          const gap = Math.abs(parseFloat(kpi.gapPercent.replace("%", "")));
          const pct = (gap / maxGap) * 100;

          return (
            <div key={kpi.id} className="flex items-center gap-3 group">
              <span className="w-[140px] text-xs text-foreground font-medium truncate shrink-0" title={kpi.name}>
                {kpi.name.length > 22 ? kpi.name.slice(0, 20) + "…" : kpi.name}
              </span>
              <div className="flex-1 h-5 bg-muted/50 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${pct}%`, background: statusColor[kpi.status] }}
                >
                  <span className="text-[10px] font-bold text-card drop-shadow-sm">
                    {kpi.gapPercent}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground w-14 text-right shrink-0 tabular-nums">
                {kpi.value} / {kpi.target}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GapAnalysisChart;
