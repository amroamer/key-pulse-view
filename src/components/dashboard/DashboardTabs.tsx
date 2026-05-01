import { LayoutDashboard, GraduationCap, Scale, Award, ShieldCheck, Building2, User, Home } from "lucide-react";

export type DashboardTab =
  | "landing"
  | "executive"
  | "student"
  | "profile"
  | "equity"
  | "teacher"
  | "quality"
  | "efficiency";

const tabs: { id: DashboardTab; label: string; icon: React.ReactNode; group?: string }[] = [
  { id: "landing", label: "Overview", icon: <Home size={16} /> },
  { id: "executive", label: "Executive Summary", icon: <LayoutDashboard size={16} />, group: "divider" },
  { id: "student", label: "Student Journey", icon: <GraduationCap size={16} /> },
  { id: "profile", label: "Student Profile", icon: <User size={16} /> },
  { id: "equity", label: "Access & Equity", icon: <Scale size={16} /> },
  { id: "teacher", label: "Teacher Excellence", icon: <Award size={16} /> },
  { id: "quality", label: "Quality Assurance", icon: <ShieldCheck size={16} /> },
  { id: "efficiency", label: "Institutional Efficiency", icon: <Building2 size={16} /> },
];

interface DashboardTabsProps {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}

const DashboardTabs = ({ active, onChange }: DashboardTabsProps) => {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none" role="tablist">
      {tabs.map((tab, i) => (
        <div key={tab.id} className="flex items-center gap-1">
          {tab.group === "divider" && (
            <div className="w-px h-5 bg-border mx-1 shrink-0" />
          )}
          <button
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              active === tab.id
                ? tab.id === "landing"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        </div>
      ))}
    </nav>
  );
};

export default DashboardTabs;
