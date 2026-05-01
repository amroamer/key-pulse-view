import { budgetCategories, resourceMetrics, costEfficiencyData, operationalKPIs, efficiencyHeroMetrics } from "@/data/efficiencyData";
import { TrendingUp, TrendingDown, Minus, DollarSign, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ScrollReveal from "../ScrollReveal";
import { tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "@/lib/chartTooltip";

const statusDot = { green: "bg-[hsl(var(--status-green-accent))]", amber: "bg-[hsl(var(--status-amber-accent))]", red: "bg-[hsl(var(--status-red-accent))]" };
const statusBg = { green: "bg-[hsl(var(--status-green-bg))]", amber: "bg-[hsl(var(--status-amber-bg))]", red: "bg-[hsl(var(--status-red-bg))]" };
const statusColor = { green: "hsl(var(--status-green-accent))", amber: "hsl(var(--status-amber-accent))", red: "hsl(var(--status-red-accent))" };
const trendIcon = (t: "up" | "down" | "flat") => {
  if (t === "up") return <TrendingUp size={10} className="text-[hsl(var(--trend-up))]" />;
  if (t === "down") return <TrendingDown size={10} className="text-[hsl(var(--trend-down))]" />;
  return <Minus size={10} className="text-muted-foreground" />;
};

const budgetChartData = budgetCategories.map((b) => ({
  name: b.category.length > 14 ? b.category.slice(0, 12) + "…" : b.category,
  allocated: b.allocated,
  spent: b.spent,
  full: b.category,
  status: b.status,
}));

const EfficiencyView = () => {
  const totalAllocated = budgetCategories.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = budgetCategories.reduce((a, b) => a + b.spent, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <ScrollReveal>
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Institutional Efficiency</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {efficiencyHeroMetrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border bg-card p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground"><DollarSign size={12} /><span className="text-[10px] font-medium">{m.label}</span></div>
                <div className="flex items-baseline gap-1"><span className="text-2xl font-extrabold text-foreground">{m.value}</span>{m.unit && <span className="text-xs text-muted-foreground">{m.unit}</span>}</div>
                <p className="text-[10px] text-muted-foreground">{m.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Budget execution */}
        <ScrollReveal delay={80}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div><h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Budget Execution</h3><p className="text-[10px] text-muted-foreground mt-0.5">{totalSpent}M / {totalAllocated}M AED spent ({Math.round((totalSpent / totalAllocated) * 100)}%)</p></div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetChartData} layout="vertical" margin={{ top: 5, right: 15, left: 5, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}M`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={80} />
                  <Tooltip contentStyle={tooltipContentStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} formatter={(v: number, n: string, p: any) => [`${v}M AED`, n === "spent" ? "Spent" : "Allocated"]} />
                  <Bar dataKey="allocated" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} barSize={10} name="Allocated" />
                  <Bar dataKey="spent" radius={[0, 4, 4, 0]} barSize={10} name="Spent">
                    {budgetChartData.map((d, i) => (<Cell key={i} fill={statusColor[d.status]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        {/* Resource utilization */}
        <ScrollReveal delay={120}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resource Utilization</h3>
            <div className="space-y-2.5">
              {resourceMetrics.map((r) => (
                <div key={r.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{r.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground">{r.value}{r.unit}</span>
                      {trendIcon(r.trend)}
                      <span className="text-[10px] text-muted-foreground">/ {r.target}{r.unit}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${statusDot[r.status]}`} style={{ width: `${Math.min((r.value / r.target) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cost efficiency benchmarks */}
        <ScrollReveal delay={160}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cost Efficiency vs Benchmarks</h3>
            <div className="space-y-2">
              {costEfficiencyData.map((c) => (
                <div key={c.metric} className={`rounded-lg p-2.5 ${statusBg[c.status]} transition-all hover:shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs font-bold text-foreground">{c.metric}</p><p className="text-[9px] text-muted-foreground">{c.insight}</p></div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-foreground">{c.dubai.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">{c.unit}</span></p>
                      <p className="text-[9px] text-muted-foreground">Benchmark: {c.benchmark.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Operational KPIs */}
        <ScrollReveal delay={200}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Operational KPIs</h3>
            {operationalKPIs.map((cat) => (
              <div key={cat.category}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{cat.category}</p>
                <div className="space-y-1 mb-3">
                  {cat.kpis.map((k) => (
                    <div key={k.label} className="flex items-center gap-2 rounded-lg bg-muted/30 p-2 hover:bg-muted/50 transition-colors">
                      <div className={`w-1.5 h-1.5 rounded-full ${statusDot[k.status]}`} />
                      <span className="text-xs text-muted-foreground flex-1">{k.label}</span>
                      <span className="text-xs font-bold text-foreground">{k.value}</span>
                      <span className="text-[10px] text-muted-foreground">{k.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default EfficiencyView;
