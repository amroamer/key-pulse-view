import { Construction } from "lucide-react";
import type { DashboardTab } from "./DashboardTabs";

const tabNames: Record<DashboardTab, string> = {
  landing: "Overview",
  executive: "Executive Summary",
  student: "Student Journey",
  profile: "Student Profile",
  equity: "Access & Equity",
  teacher: "Teacher Excellence",
  quality: "Quality Assurance",
  efficiency: "Institutional Efficiency",
};

const PlaceholderTab = ({ tab }: { tab: DashboardTab }) => (
  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
    <Construction size={48} strokeWidth={1.5} />
    <p className="text-lg font-semibold">{tabNames[tab]}</p>
    <p className="text-sm">Detailed metrics and analytics coming soon</p>
  </div>
);

export default PlaceholderTab;
