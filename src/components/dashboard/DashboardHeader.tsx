import { Download, Calendar, Filter } from "lucide-react";

interface DashboardHeaderProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

const periods = ["Current Week", "YTD", "Annual"];

const DashboardHeader = ({ period, onPeriodChange }: DashboardHeaderProps) => {
  return (
    <header className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground" style={{ lineHeight: 1.15 }}>
            Dubai Education Authority
          </h1>
          <p className="text-base text-primary font-semibold mt-1">E33 Strategic KPIs Dashboard</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
            <Calendar size={12} />
            Weekly Executive Summary &middot; Last Updated: March 20, 2026
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period selector */}
          <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95">
            <Filter size={12} /> E33 Pillar
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity active:scale-95">
            <Download size={12} /> Export PDF
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
