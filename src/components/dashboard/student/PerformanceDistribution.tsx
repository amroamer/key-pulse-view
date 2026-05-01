import { journeyStages } from "@/data/studentJourneyData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "@/lib/chartTooltip";

const data = journeyStages.map((s) => ({
  name: s.shortLabel,
  score: s.avgScore,
  status: s.status,
}));

const colorMap = {
  green: "hsl(var(--status-green-accent))",
  amber: "hsl(var(--status-amber-accent))",
  red: "hsl(var(--status-red-accent))",
};

const PerformanceDistribution = () => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
    <div>
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performance by Stage</h3>
      <p className="text-[10px] text-muted-foreground mt-0.5">Average assessment scores Â· Target: 80</p>
    </div>
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipContentStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
          <ReferenceLine y={80} stroke="hsl(var(--primary))" strokeDasharray="4 4" label={{ value: "Target", position: "insideTopRight", fontSize: 9, fill: "hsl(var(--primary))" }} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} name="Avg Score" barSize={36}>
            {data.map((d, i) => (
              <Cell key={i} fill={colorMap[d.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PerformanceDistribution;
