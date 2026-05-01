import { riskMatrix } from "@/data/studentJourneyData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const stages = ["KG", "Primary", "Middle", "Secondary", "Higher Ed"];
const dimensions = ["Attendance", "Learning", "Wellbeing", "Equity"];

const cellColor = (status: "green" | "amber" | "red") => {
  if (status === "green") return "bg-[hsl(var(--status-green-bg))] text-[hsl(var(--status-green-text))] border-[hsl(var(--status-green-accent)/0.3)]";
  if (status === "amber") return "bg-[hsl(var(--status-amber-bg))] text-[hsl(var(--status-amber-text))] border-[hsl(var(--status-amber-accent)/0.3)]";
  return "bg-[hsl(var(--status-red-bg))] text-[hsl(var(--status-red-text))] border-[hsl(var(--status-red-accent)/0.3)]";
};

const RiskHeatmap = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Risk Heatmap</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">Performance by stage × dimension</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-[10px] font-medium text-muted-foreground text-left pb-2 pr-2 w-20" />
              {stages.map((s) => (
                <th key={s} className="text-[10px] font-bold text-foreground text-center pb-2 px-1">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim) => (
              <tr key={dim}>
                <td className="text-[10px] font-medium text-muted-foreground pr-2 py-1">{dim}</td>
                {stages.map((stage) => {
                  const cell = riskMatrix.find((r) => r.stage === stage && r.dimension === dim);
                  if (!cell) return <td key={stage} />;
                  return (
                    <td key={stage} className="px-1 py-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`rounded-lg border p-2 text-center cursor-help transition-transform hover:scale-105 ${cellColor(cell.status)}`}>
                            <span className="text-sm font-extrabold">{cell.value}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-bold">{stage} · {dim}</p>
                          <p>Score: {cell.value}/100</p>
                          <p className="capitalize">Status: {cell.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskHeatmap;
