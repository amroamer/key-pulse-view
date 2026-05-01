import { useState } from "react";
import { demographicGroups, equityDimensions, genderData, geoDistricts, inclusionMetrics } from "@/data/equityData";
import { TrendingUp, TrendingDown, Minus, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import ScrollReveal from "../ScrollReveal";

const statusDot = { green: "bg-[hsl(var(--status-green-accent))]", amber: "bg-[hsl(var(--status-amber-accent))]", red: "bg-[hsl(var(--status-red-accent))]" };
const statusBg = { green: "bg-[hsl(var(--status-green-bg))]", amber: "bg-[hsl(var(--status-amber-bg))]", red: "bg-[hsl(var(--status-red-bg))]" };
const statusText = { green: "text-[hsl(var(--status-green-text))]", amber: "text-[hsl(var(--status-amber-text))]", red: "text-[hsl(var(--status-red-text))]" };
const statusColor = { green: "hsl(var(--status-green-accent))", amber: "hsl(var(--status-amber-accent))", red: "hsl(var(--status-red-accent))" };

const trendIcon = (t: "up" | "down" | "flat") => {
  if (t === "up") return <TrendingUp size={10} className="text-[hsl(var(--trend-up))]" />;
  if (t === "down") return <TrendingDown size={10} className="text-[hsl(var(--trend-down))]" />;
  return <Minus size={10} className="text-muted-foreground" />;
};

const EquityView = () => {
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  const gapData = demographicGroups.map((g) => ({ name: g.group.length > 12 ? g.group.slice(0, 10) + "…" : g.group, gap: g.gap, status: g.status, full: g.group }));

  return (
    <div className="space-y-6">
      {/* Hero: Equity Scorecard */}
      <ScrollReveal>
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Equity Scorecard</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {equityDimensions.map((d) => (
              <button key={d.id} onClick={() => setExpandedDim(expandedDim === d.id ? null : d.id)} className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-sm cursor-pointer ${expandedDim === d.id ? "ring-2 ring-primary shadow-md" : ""} ${statusBg[d.status]} border-[hsl(var(--status-${d.status}-accent))]`} style={{ borderColor: d.status === "green" ? "hsl(var(--status-green-accent))" : d.status === "amber" ? "hsl(var(--status-amber-accent))" : "hsl(var(--status-red-accent))" }}>
                <p className="text-[10px] text-muted-foreground font-medium">{d.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-2xl font-extrabold text-foreground">{d.score}</span>
                  <span className="text-[10px] text-muted-foreground">/ {d.target}</span>
                </div>
                <div className="h-1.5 rounded-full bg-background/60 overflow-hidden mt-2">
                  <div className={`h-full rounded-full ${statusDot[d.status]}`} style={{ width: `${(d.score / d.target) * 100}%` }} />
                </div>
              </button>
            ))}
          </div>

          {/* Expanded dimension */}
          {expandedDim && (() => {
            const dim = equityDimensions.find((d) => d.id === expandedDim)!;
            return (
              <div className="rounded-xl border border-border bg-card p-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <h3 className="text-sm font-bold text-foreground mb-3">{dim.label} — Sub-metrics</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {dim.subMetrics.map((s) => {
                    const pct = (s.value / s.target) * 100;
                    const st = pct >= 90 ? "green" : pct >= 70 ? "amber" : "red";
                    return (
                      <div key={s.label} className="rounded-lg bg-muted/50 p-3 space-y-1.5">
                        <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                        <div className="flex items-end gap-1"><span className="text-lg font-extrabold text-foreground">{s.value}</span><span className="text-[10px] text-muted-foreground mb-0.5">/ {s.target}</span></div>
                        <div className="h-1 rounded-full bg-background/60 overflow-hidden"><div className={`h-full rounded-full ${statusDot[st as "green" | "amber" | "red"]}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </ScrollReveal>

      {/* Achievement Gap by Demographic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={80}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div><h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Achievement Gap by Demographic</h3><p className="text-[10px] text-muted-foreground mt-0.5">Score deviation from system average (74)</p></div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gapData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={70} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid hsl(var(--border))" }} formatter={(v: number, _: string, p: any) => [`${v > 0 ? "+" : ""}${v} pts`, p.payload.full]} />
                  <ReferenceLine x={0} stroke="hsl(var(--border))" />
                  <Bar dataKey="gap" radius={[0, 4, 4, 0]} name="Gap" barSize={18}>
                    {gapData.map((d, i) => (<Cell key={i} fill={d.gap >= 0 ? "hsl(var(--primary))" : "hsl(var(--status-red-accent))"} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        {/* Gender Parity */}
        <ScrollReveal delay={120}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gender Parity Analysis</h3>
            <div className="grid grid-cols-2 gap-3">
              {(["male", "female"] as const).map((g) => (
                <div key={g} className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <p className="text-sm font-bold text-foreground capitalize flex items-center gap-1.5"><Users size={12} className="text-muted-foreground" />{g}</p>
                  {[
                    { l: "Enrollment", v: `${(genderData[g].enrollment / 1000).toFixed(0)}K` },
                    { l: "Avg Score", v: `${genderData[g].avgScore}` },
                    { l: "Completion", v: `${genderData[g].completionRate}%` },
                    { l: "STEM Interest", v: `${genderData[g].stem}%` },
                  ].map((m) => (
                    <div key={m.l} className="flex justify-between text-xs"><span className="text-muted-foreground">{m.l}</span><span className="font-bold text-foreground">{m.v}</span></div>
                  ))}
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-[hsl(var(--status-amber-bg)/0.5)] p-2.5">
              <p className="text-[10px] font-bold text-foreground">⚠ Key Insight</p>
              <p className="text-[10px] text-muted-foreground">16-point STEM interest gap between genders. Female STEM enrollment declining despite higher overall scores.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Geographic + Inclusion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={160}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-1.5"><MapPin size={12} className="text-muted-foreground" /><h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">District Performance</h3></div>
            <div className="space-y-1.5">
              {geoDistricts.sort((a, b) => b.avgScore - a.avgScore).map((d) => (
                <div key={d.name} className="flex items-center gap-2 rounded-lg bg-muted/30 p-2 hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[d.status]}`} />
                  <span className="text-xs font-medium text-foreground flex-1 min-w-0 truncate">{d.name}</span>
                  <span className="text-[10px] text-muted-foreground">{d.schools} schools</span>
                  <span className="text-xs font-bold text-foreground w-8 text-right">{d.avgScore}</span>
                  <div className="w-16 h-1.5 rounded-full bg-background/60 overflow-hidden"><div className={`h-full rounded-full ${statusDot[d.status]}`} style={{ width: `${d.avgScore}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Inclusion & Support Metrics</h3>
            <div className="space-y-1">
              {["SEN", "Language", "Gifted", "Economic"].map((cat) => {
                const items = inclusionMetrics.filter((m) => m.category === cat);
                return (
                  <div key={cat}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 mt-2">{cat}</p>
                    {items.map((m) => (
                      <div key={m.metric} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status]}`} />
                        <span className="text-xs text-muted-foreground flex-1">{m.metric}</span>
                        <span className="text-xs font-bold text-foreground">{typeof m.value === "number" && m.value > 100 ? m.value.toLocaleString() : `${m.value}%`}</span>
                        {trendIcon(m.trend)}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default EquityView;
