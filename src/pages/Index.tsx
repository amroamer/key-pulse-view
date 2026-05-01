import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs, { type DashboardTab } from "@/components/dashboard/DashboardTabs";
import StatusSummaryBar from "@/components/dashboard/StatusSummaryBar";
import StrategicLanding from "@/components/dashboard/landing/StrategicLanding";
import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary";
import StudentJourneyView from "@/components/dashboard/student/StudentJourneyView";
import StudentProfileView from "@/components/dashboard/profile/StudentProfileView";
import EquityView from "@/components/dashboard/equity/EquityView";
import TeacherView from "@/components/dashboard/teacher/TeacherView";
import QualityView from "@/components/dashboard/quality/QualityView";
import EfficiencyView from "@/components/dashboard/efficiency/EfficiencyView";

const Index = () => {
  const [period, setPeriod] = useState("Current Week");
  const [activeTab, setActiveTab] = useState<DashboardTab>("landing");

  const renderTab = () => {
    switch (activeTab) {
      case "landing": return <StrategicLanding onNavigate={setActiveTab} />;
      case "executive": return <ExecutiveSummary />;
      case "student": return <StudentJourneyView />;
      case "profile": return <StudentProfileView />;
      case "equity": return <EquityView />;
      case "teacher": return <TeacherView />;
      case "quality": return <QualityView />;
      case "efficiency": return <EfficiencyView />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <DashboardHeader period={period} onPeriodChange={setPeriod} />
        <DashboardTabs active={activeTab} onChange={setActiveTab} />
        {activeTab !== "landing" && <StatusSummaryBar green={3} amber={6} red={3} />}
        {renderTab()}
      </div>
    </div>
  );
};

export default Index;
