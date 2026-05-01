import { Suspense, lazy, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import StatusSummaryBar from "@/components/dashboard/StatusSummaryBar";
import { useDashboard } from "@/contexts/DashboardContext";

const StrategicLanding = lazy(() => import("@/components/dashboard/landing/StrategicLanding"));
const ExecutiveSummary = lazy(() => import("@/components/dashboard/ExecutiveSummary"));
const StudentJourneyView = lazy(() => import("@/components/dashboard/student/StudentJourneyView"));
const StudentProfileView = lazy(() => import("@/components/dashboard/profile/StudentProfileView"));
const EquityView = lazy(() => import("@/components/dashboard/equity/EquityView"));
const TeacherView = lazy(() => import("@/components/dashboard/teacher/TeacherView"));
const QualityView = lazy(() => import("@/components/dashboard/quality/QualityView"));
const EfficiencyView = lazy(() => import("@/components/dashboard/efficiency/EfficiencyView"));

const TabFallback = () => (
  <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
    Loading…
  </div>
);

const Index = () => {
  const [period, setPeriod] = useState("Current Week");
  const { activeTab, setActiveTab } = useDashboard();

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
        <Suspense fallback={<TabFallback />}>{renderTab()}</Suspense>
      </div>
    </div>
  );
};

export default Index;
