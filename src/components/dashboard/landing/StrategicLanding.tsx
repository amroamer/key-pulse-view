import { type DashboardTab } from "../DashboardTabs";
import { LayoutDashboard, GraduationCap, Scale, Award, ShieldCheck, Building2, Users, ArrowRight, TrendingUp, Target, AlertTriangle, ChevronRight } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

interface StrategicLandingProps {
  onNavigate: (tab: DashboardTab) => void;
}

const systemHealth = {
  totalStudents: "361.5K",
  totalTeachers: "24.2K",
  totalSchools: "218",
  systemScore: 74,
  targetScore: 85,
};

const strategicPillars: {
  id: DashboardTab;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  score: number;
  target: number;
  status: "green" | "amber" | "red";
  insight: string;
  kpis: number;
  critical: number;
}[] = [
  {
    id: "executive",
    title: "Executive Summary",
    subtitle: "Strategic overview & priority actions",
    icon: <LayoutDashboard size={20} />,
    score: 74,
    target: 85,
    status: "amber",
    insight: "3 KPIs require immediate attention across pillars",
    kpis: 12,
    critical: 3,
  },
  {
    id: "student",
    title: "Student Performance",
    subtitle: "Lifecycle journey from KG to Higher Ed",
    icon: <GraduationCap size={20} />,
    score: 72,
    target: 90,
    status: "amber",
    insight: "29% drop-off at Secondary → Higher Ed transition",
    kpis: 5,
    critical: 2,
  },
  {
    id: "equity",
    title: "Access & Equity",
    subtitle: "Demographic gaps & inclusion metrics",
    icon: <Scale size={20} />,
    score: 68,
    target: 85,
    status: "red",
    insight: "Significant gaps in SEN & low-income cohorts",
    kpis: 4,
    critical: 2,
  },
  {
    id: "teacher",
    title: "Teacher Excellence",
    subtitle: "Workforce quality & development",
    icon: <Award size={20} />,
    score: 76,
    target: 85,
    status: "amber",
    insight: "PD completion at 68%, retention improving",
    kpis: 3,
    critical: 1,
  },
  {
    id: "quality",
    title: "Quality Assurance",
    subtitle: "School ratings & inspection outcomes",
    icon: <ShieldCheck size={20} />,
    score: 71,
    target: 85,
    status: "amber",
    insight: "18% of schools need improvement plans",
    kpis: 3,
    critical: 1,
  },
  {
    id: "efficiency",
    title: "Institutional Efficiency",
    subtitle: "Budget execution & resource utilization",
    icon: <Building2 size={20} />,
    score: 79,
    target: 90,
    status: "amber",
    insight: "Budget execution at 87%, facilities at 72%",
    kpis: 3,
    critical: 0,
  },
];

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
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(160, 10%, 92%)" strokeWidth="2.5" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke="hsl(155, 75%, 42%)"
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
                { icon: <Users size={14} />, label: "Total Students", value: systemHealth.totalStudents, sub: "+3.2% YoY" },
                { icon: <Award size={14} />, label: "Total Teachers", value: systemHealth.totalTeachers, sub: "1:15 ratio" },
                { icon: <Building2 size={14} />, label: "Schools", value: systemHealth.totalSchools, sub: "98% inspected" },
                { icon: <AlertTriangle size={14} />, label: "Critical Items", value: totalCritical.toString(), sub: "Require action" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-background/60 border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">{s.icon}<span className="text-[9px] font-medium">{s.label}</span></div>
                  <p className="text-lg font-extrabold text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground">{s.sub}</p>
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
            {[
              { label: "Student Enrollment", desc: "361.5K students enter the system", color: "primary", tab: "student" as DashboardTab },
              { label: "Teaching & Learning", desc: "24.2K teachers deliver curriculum", color: "secondary", tab: "teacher" as DashboardTab },
              { label: "Quality Assurance", desc: "218 schools inspected & rated", color: "primary", tab: "quality" as DashboardTab },
              { label: "Equity Check", desc: "Gaps measured across demographics", color: "secondary", tab: "equity" as DashboardTab },
              { label: "Outcomes & Efficiency", desc: "Budget executed, results delivered", color: "primary", tab: "efficiency" as DashboardTab },
            ].map((step, i) => (
              <div key={step.label} className="flex items-stretch flex-1 min-w-0">
                <button
                  onClick={() => onNavigate(step.tab)}
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
