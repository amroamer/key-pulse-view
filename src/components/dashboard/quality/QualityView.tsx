import { useState } from "react";
import { schoolRatings, recentInspections, complianceAreas, improvementTrajectories, qualityHeroMetrics } from "@/data/qualityData";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Equal } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ScrollReveal from "../ScrollReveal";
import { Tooltip as InfoTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { scoreCardTooltip } from "@/lib/tooltips";
import { useDashboard } from "@/contexts/DashboardContext";

const statusDot = { green: "bg-[hsl(var(--status-green-accent))]", amber: "bg-[hsl(var(--status-amber-accent))]", red: "bg-[hsl(var(--status-red-accent))]" };
const statusBg = { green: "bg-[hsl(var(--status-green-bg))]", amber: "bg-[hsl(var(--status-amber-bg))]", red: "bg-[hsl(var(--status-red-bg))]" };

const trajectoryIcon = (t: string) => {
  if (t === "improving") return <ArrowUp size={12} className="text-[hsl(var(--trend-up))]" />;
  if (t === "declining") return <ArrowDown size={12} className="text-[hsl(var(--trend-down))]" />;
  return <Equal size={12} className="text-muted-foreground" />;
};

const QualityView = () => {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const { askAbout } = useDashboard();

  const totalSchools = schoolRatings.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <ScrollReveal>
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quality Assurance Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {qualityHeroMetrics.map((m) => (
              <InfoTooltip key={m.label} delayDuration={250}>
                <TooltipTrigger asChild>
                  <div onClick={() => askAbout(`${m.label} — value and one-line context.`)} className="rounded-xl border border-border bg-card p-3 space-y-1 cursor-pointer">
                    <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                    <span className="text-2xl font-extrabold text-foreground">{m.value}</span>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Target: {m.target}</span>
                      <div className={`w-2 h-2 rounded-full ${statusDot[m.status]}`} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm leading-snug">
                    {scoreCardTooltip({ label: m.label, score: m.value, target: m.target, status: m.status })}
                  </p>
                </TooltipContent>
              </InfoTooltip>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* School ratings distribution */}
        <ScrollReveal delay={80}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">School Ratings Distribution</h3>
            <div className="flex h-10 rounded-lg overflow-hidden">
              {schoolRatings.map((r) => (
                <div key={r.rating} className="relative group flex items-center justify-center" style={{ width: `${r.percent}%`, background: r.color }}>
                  <span className="text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">{r.percent}%</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {schoolRatings.map((r) => {
                const change = r.percent - r.prevPercent;
                return (
                  <div key={r.rating} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: r.color }} />
                    <span className="text-muted-foreground flex-1">{r.rating}</span>
                    <span className="font-bold text-foreground">{r.count}</span>
                    <span className="text-muted-foreground">({r.percent}%)</span>
                    <span className={`text-[10px] font-medium ${change > 0 ? "text-[hsl(var(--trend-up))]" : change < 0 ? "text-[hsl(var(--trend-down))]" : "text-muted-foreground"}`}>
                      {change > 0 ? "+" : ""}{change}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Recent inspections */}
        <ScrollReveal delay={120}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Inspections</h3>
            <div className="space-y-2">
              {recentInspections.map((ins) => {
                const improved = ins.rating !== ins.prevRating;
                return (
                  <div key={ins.school} className={`rounded-lg p-2.5 ${statusBg[ins.status]} transition-all hover:shadow-sm`}>
                    <div className="flex items-start justify-between">
                      <div><p className="text-xs font-bold text-foreground">{ins.school}</p><p className="text-[10px] text-muted-foreground">{ins.type} Â· {ins.date}</p></div>
                      <div className="text-right"><p className="text-xs font-bold text-foreground">{ins.rating}</p>{improved && <p className="text-[9px] text-muted-foreground">was {ins.prevRating}</p>}</div>
                    </div>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {ins.keyFindings.map((f) => (<span key={f} className="text-[9px] rounded-full bg-background/80 px-2 py-0.5 text-muted-foreground">{f}</span>))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Compliance tracker */}
        <ScrollReveal delay={160}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Compliance Tracker</h3>
            <div className="space-y-2">
              {complianceAreas.sort((a, b) => a.score - b.score).map((c) => (
                <div key={c.area} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[c.status]}`} />
                  <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">{c.area}</span>
                  <span className="text-[10px] text-muted-foreground">{c.issues} issues</span>
                  <span className="text-xs font-bold text-foreground w-8 text-right">{c.score}%</span>
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${statusDot[c.status]}`} style={{ width: `${c.score}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Improvement trajectories */}
        <ScrollReveal delay={200}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">School Improvement Trajectories</h3>
            <div className="space-y-2">
              {improvementTrajectories.map((t) => (
                <button key={t.school} onClick={() => setSelectedSchool(selectedSchool === t.school ? null : t.school)} className={`w-full rounded-lg p-2.5 text-left transition-all hover:bg-muted/50 ${selectedSchool === t.school ? "bg-muted/80 ring-1 ring-primary" : "bg-muted/30"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${statusDot[t.currentStatus]}`} /><span className="text-xs font-bold text-foreground">{t.school}</span></div>
                    <div className="flex items-center gap-1.5">{trajectoryIcon(t.trajectory)}<span className="text-[10px] capitalize text-muted-foreground">{t.trajectory}</span></div>
                  </div>
                  {selectedSchool === t.school && (
                    <div className="mt-2 h-[80px] animate-in fade-in-0 duration-200">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={t.ratings} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <XAxis dataKey="year" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[30, 100]} />
                          <Line type="monotone" dataKey="score" stroke={t.trajectory === "improving" ? "hsl(var(--primary))" : t.trajectory === "declining" ? "hsl(var(--status-red-accent))" : "hsl(var(--status-amber-accent))"} strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default QualityView;
