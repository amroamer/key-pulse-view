import { cohortTrends } from "@/data/studentJourneyData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const stageColors = [
  { key: "kg", label: "Kindergarten", color: "hsl(var(--primary))" },
  { key: "primary", label: "Primary", color: "hsl(var(--info))" },
  { key: "middle", label: "Middle", color: "hsl(var(--status-amber-accent))" },
  { key: "secondary", label: "Secondary", color: "hsl(280, 60%, 55%)" },
  { key: "higher", label: "Higher Ed", color: "hsl(var(--status-red-accent))" },
];

const formatAxis = (v: number) => `${(v / 1000).toFixed(0)}K`;

const CohortFlowChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Enrollment Trends by Stage</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">6-year cohort flow · 2021–2026</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cohortTrends} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatAxis} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "11px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value: number, name: string) => {
                const stage = stageColors.find((s) => s.key === name);
                return [`${(value / 1000).toFixed(1)}K`, stage?.label || name];
              }}
            />
            <Legend
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
              formatter={(value: string) => stageColors.find((s) => s.key === value)?.label || value}
            />
            {stageColors.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stackId="1"
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CohortFlowChart;
