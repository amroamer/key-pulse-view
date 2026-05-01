import { executiveKpis } from "@/data/kpiData";
import type { AmpelaeStatus } from "./KpiCard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { pillarTooltip } from "@/lib/tooltips";
import { useDashboard } from "@/contexts/DashboardContext";

/**
 * E33 Pillar summary — groups KPIs by their E33 code
 * and shows an aggregate health status per pillar.
 */

const pillarNames: Record<string, string> = {
  "E33.1": "Learning Outcomes",
  "E33.2": "Access & Enrollment",
  "E33.3": "Teacher Excellence",
  "E33.4": "Digital Readiness",
  "E33.5": "Quality & Satisfaction",
  "E33.6": "Operational Efficiency",
};

const statusWeight = { green: 2, amber: 1, red: 0 };

const PillarSummary = () => {
  const { askAbout } = useDashboard();
  const pillars = Object.entries(pillarNames).map(([code, name]) => {
    const kpis = executiveKpis.filter((k) => k.e33Code === code);
    const avgScore = kpis.length > 0
      ? kpis.reduce((sum, k) => sum + statusWeight[k.status], 0) / kpis.length
      : 2;

    const overallStatus: AmpelaeStatus =
      avgScore >= 1.5 ? "green" : avgScore >= 0.5 ? "amber" : "red";
    const redCount = kpis.filter((k) => k.status === "red").length;
    const amberCount = kpis.filter((k) => k.status === "amber").length;
    const greenCount = kpis.filter((k) => k.status === "green").length;

    return { code, name, kpis, overallStatus, redCount, amberCount, greenCount };
  });

  const statusBg: Record<AmpelaeStatus, string> = {
    green: "bg-dashboard-green/10 border-dashboard-green/30",
    amber: "bg-dashboard-amber/10 border-dashboard-amber/30",
    red: "bg-dashboard-red/10 border-dashboard-red/30",
  };

  const statusDot: Record<AmpelaeStatus, string> = {
    green: "bg-dashboard-green",
    amber: "bg-dashboard-amber",
    red: "bg-dashboard-red",
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {pillars.map((p) => (
        <Tooltip key={p.code} delayDuration={250}>
          <TooltipTrigger asChild>
            <div onClick={() => askAbout(`${p.name} pillar (${p.code}) — score, target, and what's pulling it.`)} className={`rounded-xl border p-4 ${statusBg[p.overallStatus]} transition-shadow hover:shadow-md cursor-pointer`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${statusDot[p.overallStatus]}`} />
                <span className="e33-badge text-[10px]">{p.code}</span>
              </div>
              <p className="text-xs font-bold text-foreground leading-tight">{p.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{p.kpis.length} KPI{p.kpis.length !== 1 ? "s" : ""}</p>
              {/* Mini status breakdown */}
              <div className="flex items-center gap-1.5 mt-2">
                {p.redCount > 0 && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-dashboard-red">
                    <span className="w-1.5 h-1.5 rounded-full bg-dashboard-red" />{p.redCount}
                  </span>
                )}
                {p.amberCount > 0 && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-dashboard-amber">
                    <span className="w-1.5 h-1.5 rounded-full bg-dashboard-amber" />{p.amberCount}
                  </span>
                )}
                {p.greenCount > 0 && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-dashboard-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-dashboard-green" />{p.greenCount}
                  </span>
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm leading-snug">
              {pillarTooltip({ name: p.name, total: p.kpis.length, redCount: p.redCount, amberCount: p.amberCount, greenCount: p.greenCount, status: p.overallStatus })}
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default PillarSummary;
