import { useState } from "react";
import { journeyStages, transitions } from "@/data/studentJourneyData";
import { ChevronRight, TrendingUp, TrendingDown, Minus, Users, AlertTriangle, GraduationCap, BookOpen, Brain, Heart } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const statusClasses = {
  green: "bg-[hsl(var(--status-green-bg))] border-[hsl(var(--status-green-accent))]",
  amber: "bg-[hsl(var(--status-amber-bg))] border-[hsl(var(--status-amber-accent))]",
  red: "bg-[hsl(var(--status-red-bg))] border-[hsl(var(--status-red-accent))]",
};
const statusDot = {
  green: "bg-[hsl(var(--status-green-accent))]",
  amber: "bg-[hsl(var(--status-amber-accent))]",
  red: "bg-[hsl(var(--status-red-accent))]",
};
const statusColor = {
  green: "hsl(122, 39%, 49%)",
  amber: "hsl(36, 100%, 50%)",
  red: "hsl(0, 65%, 51%)",
};

const trendIcon = (dir: "up" | "down" | "flat") => {
  if (dir === "up") return <TrendingUp size={11} className="text-[hsl(var(--trend-up))]" />;
  if (dir === "down") return <TrendingDown size={11} className="text-[hsl(var(--trend-down))]" />;
  return <Minus size={11} className="text-muted-foreground" />;
};

const formatNum = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : n.toString());

const stageIcons: Record<string, React.ReactNode> = {
  kg: <Heart size={14} />,
  primary: <BookOpen size={14} />,
  middle: <Brain size={14} />,
  secondary: <GraduationCap size={14} />,
  higher: <GraduationCap size={14} />,
};

const JourneyPipeline = () => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const selectedData = selectedStage ? journeyStages.find((s) => s.id === selectedStage) : null;

  // Radar data for selected stage
  const radarData = selectedData
    ? selectedData.keyMetrics.map((m) => ({
        metric: m.label,
        value: parseInt(m.value),
        fullMark: 100,
      }))
    : [];

  // Comparison bar data
  const comparisonData = journeyStages.map((s) => ({
    name: s.shortLabel,
    score: s.avgScore,
    completion: s.completionRate,
    status: s.status,
  }));

  return (
    <div className="space-y-4">
      {/* Hero strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Enrollment", value: "361.5K", icon: <Users size={16} />, sub: "+3.2% YoY" },
          { label: "System Avg Score", value: "74", icon: <BookOpen size={16} />, sub: "Target: 80" },
          { label: "Overall Completion", value: "88%", icon: <GraduationCap size={16} />, sub: "Target: 95%" },
          { label: "Critical Drop-offs", value: "2", icon: <AlertTriangle size={16} />, sub: "Middle → Higher" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">{m.icon}<span className="text-[10px] font-medium">{m.label}</span></div>
            <p className="text-xl font-extrabold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Pipeline header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Student Lifecycle Pipeline</h2>
        <p className="text-[10px] text-muted-foreground">Click any stage to explore</p>
      </div>

      {/* Pipeline — Desktop */}
      <div className="hidden md:flex items-stretch gap-0">
        {journeyStages.map((stage, i) => {
          const transition = transitions[i];
          const isSelected = selectedStage === stage.id;
          const maxEnroll = Math.max(...journeyStages.map((s) => s.enrollment));
          const widthPercent = Math.max(15, (stage.enrollment / maxEnroll) * 100);
          return (
            <div key={stage.id} className="flex items-stretch" style={{ flex: `${widthPercent} 1 0%` }}>
              <button
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                className={`relative flex-1 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer ${statusClasses[stage.status]} ${
                  isSelected ? "ring-2 ring-primary shadow-lg scale-[1.03] z-10" : "hover:shadow-sm hover:scale-[1.01]"
                }`}
              >
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${statusDot[stage.status]} ${isSelected ? "animate-pulse" : ""}`} />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground">{stageIcons[stage.id]}<span className="text-[10px] font-medium">{stage.ageRange}</span></div>
                  <p className="text-sm font-bold text-foreground">{stage.shortLabel}</p>
                  <p className="text-xl font-extrabold text-foreground leading-none">{formatNum(stage.enrollment)}</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-bold text-foreground">{stage.completionRate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-background/60 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${statusDot[stage.status]}`} style={{ width: `${stage.completionRate}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Avg Score</span>
                    <span className="font-bold text-foreground">{stage.avgScore}/100</span>
                  </div>
                </div>
              </button>
              {transition && (
                <HoverCard openDelay={100} closeDelay={50}>
                  <HoverCardTrigger asChild>
                    <div className="flex flex-col items-center justify-center px-1.5 min-w-[44px] cursor-help group">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${transition.status === "red" ? "bg-[hsl(var(--status-red-bg))]" : transition.status === "amber" ? "bg-[hsl(var(--status-amber-bg))]" : "bg-[hsl(var(--status-green-bg))]"}`}>
                        <ChevronRight size={14} className={transition.status === "red" ? "text-[hsl(var(--status-red-accent))]" : transition.status === "amber" ? "text-[hsl(var(--status-amber-accent))]" : "text-[hsl(var(--status-green-accent))]"} />
                      </div>
                      <span className={`text-[9px] font-bold mt-0.5 ${transition.status === "red" ? "text-[hsl(var(--status-red-text))]" : transition.status === "amber" ? "text-[hsl(var(--status-amber-text))]" : "text-[hsl(var(--status-green-text))]"}`}>
                        {transition.rate}%
                      </span>
                      {transition.status === "red" && <AlertTriangle size={9} className="text-[hsl(var(--status-red-accent))] mt-0.5" />}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-60 p-3 space-y-2">
                    <p className="text-xs font-bold text-foreground">{journeyStages[i].shortLabel} → {journeyStages[i + 1].shortLabel}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted/50 p-2 text-center"><p className="text-[10px] text-muted-foreground">Pass Rate</p><p className="text-sm font-bold text-foreground">{transition.rate}%</p></div>
                      <div className="rounded-lg bg-[hsl(var(--status-red-bg)/0.5)] p-2 text-center"><p className="text-[10px] text-muted-foreground">Drop-off</p><p className="text-sm font-bold text-[hsl(var(--trend-down))]">{transition.dropoff}%</p></div>
                    </div>
                    <div className="border-t border-border pt-1.5">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">Risk Factors</p>
                      {transition.riskFactors.map((r) => (
                        <p key={r} className="text-[10px] text-muted-foreground flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[hsl(var(--status-red-accent))]" />{r}</p>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile pipeline */}
      <div className="md:hidden space-y-2">
        {journeyStages.map((stage, i) => {
          const transition = transitions[i];
          return (
            <div key={stage.id}>
              <button onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)} className={`w-full rounded-xl border-2 p-3 text-left transition-all ${statusClasses[stage.status]} ${selectedStage === stage.id ? "ring-2 ring-primary" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="text-muted-foreground">{stageIcons[stage.id]}</div><div><p className="text-sm font-bold text-foreground">{stage.label}</p><p className="text-[10px] text-muted-foreground">{stage.ageRange}</p></div></div>
                  <div className="text-right"><p className="text-lg font-extrabold text-foreground">{formatNum(stage.enrollment)}</p><p className="text-[10px] text-muted-foreground">{stage.completionRate}% · Score {stage.avgScore}</p></div>
                </div>
              </button>
              {transition && <div className="flex items-center justify-center py-1 text-[10px] font-bold text-muted-foreground">↓ {transition.rate}% transition · {transition.dropoff}% drop-off</div>}
            </div>
          );
        })}
      </div>

      {/* Deep-dive panel */}
      {selectedData && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">{stageIcons[selectedData.id]} {selectedData.label}</h3>
              <p className="text-xs text-muted-foreground">{selectedData.ageRange} · {selectedData.enrollment.toLocaleString()} students</p>
            </div>
            <div className={`status-pill ${selectedData.status === "green" ? "status-pill-green" : selectedData.status === "amber" ? "status-pill-amber" : "status-pill-red"}`}>
              {selectedData.status === "green" ? "On Track" : selectedData.status === "amber" ? "At Risk" : "Off Track"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Key metrics */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Key Indicators</p>
              {selectedData.keyMetrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between rounded-lg bg-muted/50 p-2.5">
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  <div className="flex items-center gap-1.5"><span className="text-sm font-bold text-foreground">{m.value}</span>{trendIcon(m.trend)}</div>
                </div>
              ))}
            </div>

            {/* Radar chart */}
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Performance Profile</p>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(160, 10%, 90%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "hsl(168, 10%, 45%)" }} />
                  <PolarRadiusAxis tick={false} domain={[0, 100]} />
                  <Radar dataKey="value" stroke={statusColor[selectedData.status]} fill={statusColor[selectedData.status]} fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Cross-stage comparison */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Cross-Stage Comparison</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={comparisonData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(168, 10%, 45%)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(168, 10%, 45%)" }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid hsl(160, 10%, 90%)" }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} name="Avg Score">
                    {comparisonData.map((d, idx) => (
                      <Cell key={idx} fill={d.name === selectedData.shortLabel ? statusColor[selectedData.status] : "hsl(160, 10%, 85%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyPipeline;
