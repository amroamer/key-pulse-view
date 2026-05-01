import { createContext, useContext, useState, type ReactNode } from "react";
import type { DashboardTab } from "@/components/dashboard/DashboardTabs";

export interface DashboardContextValue {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  selectedStudent: string | null;
  setSelectedStudent: (id: string | null) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("landing");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  return (
    <DashboardContext.Provider
      value={{ activeTab, setActiveTab, selectedStudent, setSelectedStudent }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextValue => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within a DashboardProvider");
  return ctx;
};
