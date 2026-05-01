import { type DashboardTab } from "../DashboardTabs";
import { LayoutDashboard, GraduationCap, Scale, Award, ShieldCheck, Building2, Users, ArrowRight, TrendingUp, Target, AlertTriangle, ChevronRight } from "lucide-react";
import ScrollReveal from "../ScrollReveal";
import { systemHealth, strategicPillars as pillarSummaries, systemFlow, type StrategicPillarSummary } from "@/data/landingData";

interface StrategicLandingProps {
  onNavigate: (tab: DashboardTab) => void;
}

const ICONS_BY_ID: Record<string, React.ReactNode> = {
  executive: <LayoutDashboard size={20} />,
  student: <GraduationCap size={20} />,
  equity: <Scale size={20} />,
  teacher: <Award size={20} />,
  quality: <ShieldCheck size={20} />,
  efficiency: <Building2 size={20} />,
};

const strategicPillars: (StrategicPillarSummary & { id: DashboardTab; icon: React.ReactNode })[] =
  pillarSummaries.map((p) => ({
    ...p,
    id: p.id as DashboardTab,
    icon: ICONS_BY_ID[p.id] ?? <LayoutDashboard size={20} />,
  }));

const StrategicLanding = ({ onNavigate }: StrategicLandingProps) => {
  const overallScore = Math.round(strategicPillars.reduce((a, p) => a + p.score, 0) / strategicPillars.length);
  const totalCritical = strategicPillars.reduce((a, p) => a + p.critical, 0);

  return (
    <div className="space-y-6">
      {/* Hero — System pulse */}
      <ScrollReveal>
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          <div className="relative p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">E33 Strategic Framework</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                  Education System<br />Health Overview
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Real-time strategic intelligence across all pillars of the Dubai education ecosystem.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2.5"
                        strokeDasharray={`${(overallScore / 100) * 100} 100`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-extrabold text-foreground">{overallScore}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">System Score</p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Users size={14} />, label: "Total Students", value: systemHealth.totalStudents, sub: "+3.2% YoY", featured: false },
                { icon: <Award size={14} />, label: "Total Teachers", value: systemHealth.totalTeachers, sub: "1:15 ratio", featured: false },
                { icon: <Building2 size={14} />, label: "Schools", value: systemHealth.totalSchools, sub: "98% inspected", featured: false },
                { icon: <AlertTriangle size={14} />, label: "Critical Items", value: totalCritical.toString(), sub: "Require action", featured: true },
              ].map((s) => (
                <div
                  key={s.label}
                  className={
                    s.featured
                      ? "rounded-xl bg-accent text-accent-foreground p-3 space-y-1 shadow-sm"
                      : "rounded-xl bg-background/60 border border-border/50 p-3 space-y-1"
                  }
                >
                  <div className={`flex items-center gap-1.5 ${s.featured ? "text-accent-foreground/80" : "text-muted-foreground"}`}>{s.icon}<span className="text-[9px] font-medium">{s.label}</span></div>
                  <p className={`text-lg font-extrabold ${s.featured ? "text-accent-foreground" : "text-foreground"}`}>{s.value}</p>
                  <p className={`text-[9px] ${s.featured ? "text-accent-foreground/80" : "text-muted-foreground"}`}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Strategic Pillars — the main navigation map */}
      <ScrollReveal delay={80}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Strategic Domains</h2>
            <p className="text-[10px] text-muted-foreground">Click any domain to explore</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {strategicPillars.map((pillar) => {
              const gapPercent = Math.round(((pillar.target - pillar.score) / pillar.target) * 100);
              return (
                <button
                  key={pillar.id}
                  onClick={() => onNavigate(pillar.id)}
                  className={`group relative rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] ${
                    pillar.status === "green"
                      ? "border-[hsl(var(--status-green-accent)/0.3)] hover:border-[hsl(var(--status-green-accent))]"
                      : pillar.status === "amber"
                      ? "border-[hsl(var(--status-amber-accent)/0.3)] hover:border-[hsl(var(--status-amber-accent))]"
                      : "border-[hsl(var(--status-red-accent)/0.3)] hover:border-[hsl(var(--status-red-accent))]"
                  } bg-card`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      pillar.status === "green"
                        ? "bg-[hsl(var(--status-green-bg))] text-[hsl(var(--status-green-accent))]"
                        : pillar.status === "amber"
                        ? "bg-[hsl(var(--status-amber-bg))] text-[hsl(var(--status-amber-accent))]"
                        : "bg-[hsl(var(--status-red-bg))] text-[hsl(var(--status-red-accent))]"
                    }`}>
                      {pillar.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-foreground">{pillar.score}</p>
                      <p className="text-[9px] text-muted-foreground">Target: {pillar.target}</p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-foreground mb-0.5">{pillar.title}</h3>
                  <p className="text-[10px] text-muted-foreground mb-3">{pillar.subtitle}</p>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        pillar.status === "green"
                          ? "bg-[hsl(var(--status-green-accent))]"
                          : pillar.status === "amber"
                          ? "bg-[hsl(var(--status-amber-accent))]"
                          : "bg-[hsl(var(--status-red-accent))]"
                      }`}
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>

                  {/* Insight */}
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5 mb-2">
                    <Target size={10} className="text-muted-foreground shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-tight">{pillar.insight}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                      <span>{pillar.kpis} KPIs</span>
                      {pillar.critical > 0 && (
                        <span className="text-[hsl(var(--status-red-text))] font-bold flex items-center gap-0.5">
                          <AlertTriangle size={8} /> {pillar.critical} critical
                        </span>
                      )}
                      <span>Gap: {gapPercent}%</span>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Flow narrative — how pillars connect */}
      <ScrollReveal delay={160}>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">System Flow — How It All Connects</h2>
          <div className="flex flex-col sm:flex-row items-stretch gap-0 overflow-x-auto">
            {systemFlow.map((step, i) => (
              <div key={step.label} className="flex items-stretch flex-1 min-w-0">
                <button
                  onClick={() => onNavigate(step.tab as DashboardTab)}
                  className="flex-1 rounded-xl border border-border bg-background/60 p-3 text-left hover:bg-muted/60 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-primary-foreground ${
                      step.color === "primary" ? "bg-primary" : "bg-secondary"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground">{step.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                </button>
                {i < 4 && (
                  <div className="flex items-center px-1 shrink-0">
                    <ArrowRight size={14} className="text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center italic">
            Each domain feeds into the next — creating a continuous improvement cycle monitored by the Executive Summary
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default StrategicLanding;
