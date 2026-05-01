import JourneyPipeline from "./JourneyPipeline";
import CohortFlowChart from "./CohortFlowChart";
import RiskHeatmap from "./RiskHeatmap";
import DropoffAnalysis from "./DropoffAnalysis";
import PerformanceDistribution from "./PerformanceDistribution";
import ScrollReveal from "../ScrollReveal";

const StudentJourneyView = () => {
  return (
    <div className="space-y-6">
      <ScrollReveal>
        <JourneyPipeline />
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={80}>
          <DropoffAnalysis />
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <PerformanceDistribution />
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={160}>
          <RiskHeatmap />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <CohortFlowChart />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default StudentJourneyView;
