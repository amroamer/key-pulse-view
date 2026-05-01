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
            className={`relative flex items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2 text-sm transition-colors duration-150 active:scale-[0.98] ${
              active === tab.id
                ? "text-primary font-semibold bg-primary/5"
                : "text-muted-foreground font-medium hover:text-foreground hover:bg-muted/60"
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
