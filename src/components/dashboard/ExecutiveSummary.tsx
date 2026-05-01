import HeroMetrics from "./HeroMetrics";
import PillarSummary from "./PillarSummary";
import PriorityMatrix from "./PriorityMatrix";
import GapAnalysisChart from "./GapAnalysisChart";
import KpiTable from "./KpiTable";
import ScrollReveal from "./ScrollReveal";

/**
 * BCG-style Executive Summary — a strategic narrative:
 * 1. Hero metrics → what are the headline numbers?
 * 2. Pillar health → which strategic pillars are struggling?
 * 3. Priority matrix + Gap chart → where to focus?
 * 4. Full KPI table → the detail layer
 */
const ExecutiveSummary = () => {
  return (
    <div className="space-y-6">
      {/* Layer 1: Hero headline metrics */}
      <ScrollReveal>
        <HeroMetrics />
      </ScrollReveal>

      {/* Layer 2: E33 Pillar health cards */}
      <ScrollReveal delay={80}>
        <div>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">E33 Pillar Health</h2>
          <PillarSummary />
        </div>
      </ScrollReveal>

      {/* Layer 3: Analytics — two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={120}>
          <PriorityMatrix />
        </ScrollReveal>
        <ScrollReveal delay={180}>
          <GapAnalysisChart />
        </ScrollReveal>
      </div>

      {/* Layer 4: Full KPI table */}
      <ScrollReveal delay={200}>
        <KpiTable />
      </ScrollReveal>
    </div>
  );
};

export default ExecutiveSummary;
