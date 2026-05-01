import { transitions, journeyStages } from "@/data/studentJourneyData";
import { AlertTriangle, ArrowRight } from "lucide-react";

const statusAccent = {
  green: "text-[hsl(var(--status-green-accent))]",
  amber: "text-[hsl(var(--status-amber-accent))]",
  red: "text-[hsl(var(--status-red-accent))]",
};

const statusBg = {
  green: "bg-[hsl(var(--status-green-bg))]",
  amber: "bg-[hsl(var(--status-amber-bg))]",
  red: "bg-[hsl(var(--status-red-bg))]",
};

const DropoffAnalysis = () => {
  const sortedTransitions = [...transitions].sort((a, b) => b.dropoff - a.dropoff);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Critical Transition Points</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">Drop-off rates sorted by severity</p>
      </div>

      <div className="space-y-2">
        {sortedTransitions.map((t) => {
          const fromStage = journeyStages.find((s) => s.id === t.from)!;
          const toStage = journeyStages.find((s) => s.id === t.to)!;
          const studentsLost = Math.round(fromStage.enrollment * (t.dropoff / 100));

          return (
            <div key={`${t.from}-${t.to}`} className={`rounded-lg p-3 ${statusBg[t.status]} transition-all hover:shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <span>{fromStage.shortLabel}</span>
                  <ArrowRight size={14} className="text-muted-foreground" />
                  <span>{toStage.shortLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  {t.status === "red" && <AlertTriangle size={12} className={statusAccent[t.status]} />}
                  <span className={`text-lg font-extrabold ${statusAccent[t.status]}`}>{t.dropoff}%</span>
                </div>
              </div>

              {/* Drop-off bar */}
              <div className="h-1.5 rounded-full bg-background/60 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${t.status === "red" ? "bg-[hsl(var(--status-red-accent))]" : t.status === "amber" ? "bg-[hsl(var(--status-amber-accent))]" : "bg-[hsl(var(--status-green-accent))]"}`}
                  style={{ width: `${t.dropoff}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>~{(studentsLost / 1000).toFixed(1)}K students at risk</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {t.riskFactors.slice(0, 2).map((r) => (
                    <span key={r} className="rounded-full bg-background/80 px-2 py-0.5 text-[9px] font-medium">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DropoffAnalysis;
