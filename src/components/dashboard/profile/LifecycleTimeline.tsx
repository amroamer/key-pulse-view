import { lifecycleStages, stageMap, getStudentMilestones, type StudentProfile, type StudentMilestone } from "@/data/studentProfileData";
import { Baby, BookOpen, Brain, GraduationCap, Building2, Star, AlertTriangle, ArrowRight, Shield, Zap } from "lucide-react";
import { useState } from "react";

const stageIcons: Record<string, React.ReactNode> = {
  baby: <Baby size={16} />,
  book: <BookOpen size={16} />,
  brain: <Brain size={16} />,
  graduation: <GraduationCap size={16} />,
  university: <Building2 size={16} />,
};

const milestoneIcons: Record<string, React.ReactNode> = {
  academic: <BookOpen size={12} />,
  behavioral: <AlertTriangle size={12} />,
  intervention: <Shield size={12} />,
  achievement: <Star size={12} />,
  transition: <ArrowRight size={12} />,
};

const milestoneColors: Record<string, { bg: string; text: string; border: string }> = {
  positive: { bg: "bg-[hsl(var(--status-green-bg))]", text: "text-[hsl(var(--status-green-text))]", border: "border-[hsl(var(--status-green-accent))]" },
  neutral: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
  negative: { bg: "bg-[hsl(var(--status-red-bg))]", text: "text-[hsl(var(--status-red-text))]", border: "border-[hsl(var(--status-red-accent))]" },
};

interface LifecycleTimelineProps {
  student: StudentProfile;
}

const LifecycleTimeline = ({ student }: LifecycleTimelineProps) => {
  const currentStageIdx = stageMap[student.currentStage] ?? 0;
  const milestones = getStudentMilestones(student.id);
  const [selectedMilestone, setSelectedMilestone] = useState<StudentMilestone | null>(null);

  // Group milestones by stage
  const milestonesByStage: Record<string, StudentMilestone[]> = {};
  milestones.forEach((m) => {
    if (!milestonesByStage[m.stage]) milestonesByStage[m.stage] = [];
    milestonesByStage[m.stage].push(m);
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Education Lifecycle</h3>
          <p className="text-[10px] text-muted-foreground">
            {milestones.length} milestones across {currentStageIdx + 1} stages
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          {[
            { label: "Achievement", color: "bg-[hsl(var(--status-green-accent))]" },
            { label: "Intervention", color: "bg-[hsl(var(--secondary))]" },
            { label: "Risk Event", color: "bg-[hsl(var(--status-red-accent))]" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1 text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${l.color}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Horizontal lifecycle track */}
      <div className="relative">
        {/* Stage bar */}
        <div className="flex items-center gap-0">
          {lifecycleStages.map((stage, i) => {
            const isCompleted = i < currentStageIdx;
            const isCurrent = i === currentStageIdx;
            const isFuture = i > currentStageIdx;
            const stageMilestones = milestonesByStage[stage.label] || milestonesByStage[stage.shortLabel] || [];

            return (
              <div key={stage.id} className="flex items-center" style={{ flex: 1 }}>
                <div className={`relative flex-1 rounded-xl p-3 border-2 transition-all ${
                  isCurrent
                    ? "bg-primary/10 border-primary shadow-md"
                    : isCompleted
                    ? "bg-[hsl(var(--status-green-bg)/0.5)] border-[hsl(var(--status-green-accent)/0.3)]"
                    : "bg-muted/30 border-border/50 opacity-50"
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={isCurrent ? "text-primary" : isCompleted ? "text-[hsl(var(--status-green-accent))]" : "text-muted-foreground"}>
                      {stageIcons[stage.icon]}
                    </span>
                    <span className="text-[10px] font-bold text-foreground">{stage.shortLabel}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground">{stage.years}</p>

                  {/* Milestone dots under each stage */}
                  {stageMilestones.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {stageMilestones.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMilestone(selectedMilestone?.id === m.id ? null : m)}
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all hover:scale-125 ${
                            selectedMilestone?.id === m.id ? "ring-2 ring-primary scale-125" : ""
                          } ${
                            m.impact === "positive"
                              ? "bg-[hsl(var(--status-green-accent))] text-white"
                              : m.impact === "negative"
                              ? "bg-[hsl(var(--status-red-accent))] text-white"
                              : "bg-muted-foreground/40 text-white"
                          }`}
                          title={m.title}
                        >
                          <span className="text-[7px] font-bold">
                            {m.type === "achievement" ? "★" : m.type === "intervention" ? "+" : m.type === "transition" ? "→" : "!"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
                  )}
                </div>

                {i < lifecycleStages.length - 1 && (
                  <div className={`w-6 h-0.5 shrink-0 ${
                    i < currentStageIdx
                      ? "bg-[hsl(var(--status-green-accent))]"
                      : "bg-border"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected milestone detail */}
      {selectedMilestone && (
        <div className={`rounded-xl border-2 p-4 animate-in fade-in-0 slide-in-from-top-2 duration-200 ${milestoneColors[selectedMilestone.impact].bg} ${milestoneColors[selectedMilestone.impact].border}`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${milestoneColors[selectedMilestone.impact].bg} ${milestoneColors[selectedMilestone.impact].text}`}>
              {milestoneIcons[selectedMilestone.type]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-foreground">{selectedMilestone.title}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-card text-muted-foreground font-medium">
                  {selectedMilestone.date}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-card text-muted-foreground font-medium capitalize">
                  {selectedMilestone.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{selectedMilestone.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Milestone timeline list */}
      <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Milestone History</p>
        {milestones.slice().reverse().map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMilestone(selectedMilestone?.id === m.id ? null : m)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-muted/60 ${
              selectedMilestone?.id === m.id ? "bg-muted/80 ring-1 ring-primary/20" : ""
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              m.impact === "positive"
                ? "bg-[hsl(var(--status-green-bg))] text-[hsl(var(--status-green-accent))]"
                : m.impact === "negative"
                ? "bg-[hsl(var(--status-red-bg))] text-[hsl(var(--status-red-accent))]"
                : "bg-muted text-muted-foreground"
            }`}>
              {milestoneIcons[m.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{m.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{m.stage} · {m.date}</p>
            </div>
            <Zap size={10} className={`shrink-0 ${m.impact === "positive" ? "text-[hsl(var(--status-green-accent))]" : m.impact === "negative" ? "text-[hsl(var(--status-red-accent))]" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LifecycleTimeline;
