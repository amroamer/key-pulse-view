import { getInterventions, type StudentProfile } from "@/data/studentProfileData";
import { CheckCircle2, Clock, CalendarClock, ArrowRight } from "lucide-react";

interface InterventionTimelineProps {
  student: StudentProfile;
}

const statusConfig = {
  completed: { icon: <CheckCircle2 size={14} />, bg: "bg-[hsl(var(--status-green-bg))]", text: "text-[hsl(var(--status-green-accent))]", label: "Completed" },
  active: { icon: <Clock size={14} />, bg: "bg-[hsl(var(--status-amber-bg))]", text: "text-[hsl(var(--status-amber-accent))]", label: "Active" },
  planned: { icon: <CalendarClock size={14} />, bg: "bg-muted", text: "text-muted-foreground", label: "Planned" },
};

const InterventionTimeline = ({ student }: InterventionTimelineProps) => {
  const interventions = getInterventions(student.id);
  const activeCount = interventions.filter((i) => i.status === "active").length;
  const completedCount = interventions.filter((i) => i.status === "completed").length;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Interventions & Support</h3>
          <p className="text-[10px] text-muted-foreground">
            {completedCount} completed · {activeCount} active · {interventions.length - completedCount - activeCount} planned
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {interventions.map((intervention, idx) => {
          const config = statusConfig[intervention.status];
          return (
            <div key={intervention.id} className="relative">
              {idx < interventions.length - 1 && (
                <div className="absolute left-[15px] top-10 bottom-0 w-px bg-border" />
              )}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg} ${config.text}`}>
                  {config.icon}
                </div>
                <div className="flex-1 rounded-lg bg-muted/30 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{intervention.type}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{intervention.date}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{intervention.description}</p>
                  {intervention.outcome && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <ArrowRight size={10} className="text-[hsl(var(--status-green-accent))]" />
                      <span className="text-[10px] font-medium text-[hsl(var(--status-green-text))]">
                        {intervention.outcome}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterventionTimeline;
