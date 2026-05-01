import { useState } from "react";
import { qualityBands, teacherHeroMetrics, retentionCohorts, pdPrograms, teacherBySubject } from "@/data/teacherData";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import ScrollReveal from "../ScrollReveal";
import { tooltipContentStyle, tooltipItemStyle, tooltipLabelStyle } from "@/lib/chartTooltip";

const statusDot = { green: "bg-[hsl(var(--status-green-accent))]", amber: "bg-[hsl(var(--status-amber-accent))]", red: "bg-[hsl(var(--status-red-accent))]" };
const statusPill = { green: "status-pill status-pill-green", amber: "status-pill status-pill-amber", red: "status-pill status-pill-red" };
const trendIcon = (t: "up" | "down" | "flat") => {
  if (t === "up") return <TrendingUp size={10} className="text-[hsl(var(--trend-up))]" />;
  if (t === "down") return <TrendingDown size={10} className="text-[hsl(var(--trend-down))]" />;
  return <Minus size={10} className="text-muted-foreground" />;
};

const TeacherView = () => {
  const [showAllPD, setShowAllPD] = useState(false);
  const visiblePD = showAllPD ? pdPrograms : pdPrograms.slice(0, 4);

  const retentionData = retentionCohorts.map((c) => ({
    year: c.year,
    hired: c.hired,
    "Year 1": c.year1 || undefined,
    "Year 2": c.year2 || undefined,
    "Year 3": c.year3 || undefined,
    "Year 5": c.year5 || undefined,
  }));

  return (
    <div className="space-y-6">
      {/* Hero metrics */}
      <ScrollReveal>
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Teacher Workforce Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {teacherHeroMetrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border bg-card p-3 space-y-1">
                <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-foreground">{m.value}</span>
                  {trendIcon(m.trend)}
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Target: {m.target}</span>
                  <span className={`font-medium ${m.status === "green" ? "text-[hsl(var(--status-green-text))]" : m.status === "amber" ? "text-[hsl(var(--status-amber-text))]" : "text-[hsl(var(--status-red-text))]"}`}>{m.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quality distribution */}
        <ScrollReveal delay={80}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quality Distribution</h3>
            {/* Stacked bar */}
            <div className="flex h-8 rounded-lg overflow-hidden">
              {qualityBands.map((b) => (
                <div key={b.band} className="relative group" style={{ width: `${b.percent}%`, background: b.color }} title={`${b.band}: ${b.percent}%`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-bold text-white drop-shadow">{b.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {qualityBands.map((b) => (
                <div key={b.band} className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: b.color }} />
                  <span className="text-muted-foreground">{b.band}</span>
                  <span className="font-bold text-foreground">{b.count}</span>
                </div>
              ))}
            </div>
            {/* Subject breakdown */}
            <div className="border-t border-border pt-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">By Subject Area</p>
              <div className="space-y-1">
                {teacherBySubject.map((s) => (
                  <div key={s.subject} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-24 truncate">{s.subject}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full" style={{ width: `${s.quality}%`, background: s.quality >= 70 ? "hsl(var(--primary))" : s.quality >= 60 ? "hsl(var(--status-amber-accent))" : "hsl(var(--status-red-accent))" }} /></div>
                    <span className="font-bold text-foreground w-6 text-right">{s.quality}</span>
                    {s.vacancy > 10 && <span className="text-[9px] text-[hsl(var(--status-red-text))] bg-[hsl(var(--status-red-bg))] rounded-full px-1.5">{s.vacancy}% vacant</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Retention cohort */}
        <ScrollReveal delay={120}>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div><h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Retention Cohort Analysis</h3><p className="text-[10px] text-muted-foreground mt-0.5">Tracking hired cohorts over time</p></div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipContentStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                  <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="hired" stroke="hsl(var(--info))" strokeWidth={2} dot={{ r: 3 }} name="Hired" connectNulls />
                  <Line type="monotone" dataKey="Year 1" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="Year 2" stroke="hsl(var(--status-amber-accent))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="Year 3" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="Year 5" stroke="hsl(var(--status-red-accent))" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* PD Programs */}
      <ScrollReveal delay={160}>
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div><h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Professional Development Programs</h3><p className="text-[10px] text-muted-foreground mt-0.5">Enrollment, completion & impact</p></div>
            <button onClick={() => setShowAllPD(!showAllPD)} className="text-[10px] font-medium text-primary flex items-center gap-1 hover:underline">
              {showAllPD ? "Show less" : "Show all"}{showAllPD ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {visiblePD.map((p) => {
              const completionRate = Math.round((p.completed / p.enrolled) * 100);
              return (
                <div key={p.name} className="rounded-lg border border-border/50 p-3 space-y-2 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-bold text-foreground leading-tight pr-2">{p.name}</p>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${statusDot[p.status]}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-muted-foreground">Enrolled</span><p className="font-bold text-foreground">{p.enrolled}</p></div>
                    <div><span className="text-muted-foreground">Completed</span><p className="font-bold text-foreground">{completionRate}%</p></div>
                    <div><span className="text-muted-foreground">Satisfaction</span><p className="font-bold text-foreground">{p.satisfaction}%</p></div>
                    <div><span className="text-muted-foreground">Impact Score</span><p className="font-bold text-foreground">{p.impactScore}</p></div>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${statusDot[p.status]}`} style={{ width: `${completionRate}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default TeacherView;
