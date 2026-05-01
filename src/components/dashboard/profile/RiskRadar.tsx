import { getRiskDimensions, type StudentProfile } from "@/data/studentProfileData";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface RiskRadarProps {
  student: StudentProfile;
}

const trendIcon = (t: string) => {
  if (t === "improving") return <TrendingUp size={10} className="text-[hsl(var(--trend-up))]" />;
  if (t === "declining") return <TrendingDown size={10} className="text-[hsl(var(--trend-down))]" />;
  return <Minus size={10} className="text-muted-foreground" />;
};

const getOverallRisk = (score: number) => {
  if (score >= 75) return { label: "Low Risk", cls: "status-pill-green" };
  if (score >= 50) return { label: "Medium Risk", cls: "status-pill-amber" };
  return { label: "High Risk", cls: "status-pill-red" };
};

const RiskRadar = ({ student }: RiskRadarProps) => {
  const risks = getRiskDimensions(student.id);
  const avgScore = Math.round(risks.reduce((a, r) => a + r.score, 0) / risks.length);
  const overall = getOverallRisk(avgScore);

  const radarData = risks.map((r) => ({
    dimension: r.dimension.replace("Academic Performance", "Academics").replace("Social-Emotional", "Social").replace("Family Engagement", "Family").replace("University Readiness", "Uni Ready"),
    score: r.score,
    fullMark: 100,
  }));

  const strokeColor =
    avgScore >= 75
      ? "hsl(122, 39%, 49%)"
      : avgScore >= 50
      ? "hsl(36, 100%, 50%)"
      : "hsl(0, 65%, 51%)";

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Risk Assessment</h3>
          <p className="text-[10px] text-muted-foreground">6-dimension wellbeing profile</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-foreground">{avgScore}</span>
          <span className={`status-pill ${overall.cls}`}>{overall.label}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(160, 10%, 90%)" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: "hsl(168, 10%, 45%)" }} />
          <PolarRadiusAxis tick={false} domain={[0, 100]} />
          <Radar dataKey="score" stroke={strokeColor} fill={strokeColor} fillOpacity={0.15} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2">
        {risks.map((r) => (
          <div
            key={r.dimension}
            className={`flex items-center justify-between rounded-lg px-3 py-2 ${
              r.score >= 75
                ? "bg-[hsl(var(--status-green-bg)/0.3)]"
                : r.score >= 50
                ? "bg-[hsl(var(--status-amber-bg)/0.3)]"
                : "bg-[hsl(var(--status-red-bg)/0.3)]"
            }`}
          >
            <span className="text-[10px] text-muted-foreground">{r.dimension}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground">{r.score}</span>
              {trendIcon(r.trend)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskRadar;
