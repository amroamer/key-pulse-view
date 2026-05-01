import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { DashboardTab } from "@/components/dashboard/DashboardTabs";

export interface DashboardContextValue {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;

  // Chat control — lets cards open the chat with a pre-filled question.
  // The user still has to hit Enter to send it (no auto-send).
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  pendingInput: string | null;
  /** Open the chat AND pre-fill the input box. */
  askAbout: (text: string) => void;
  /** Called by ChatPanel after it copies pendingInput into its textarea. */
  consumePendingInput: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("landing");
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingInput, setPendingInput] = useState<string | null>(null);

  const askAbout = useCallback((text: string) => {
    setPendingInput(text);
    setChatOpen(true);
  }, []);

  const consumePendingInput = useCallback(() => {
    setPendingInput(null);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        chatOpen,
        setChatOpen,
        pendingInput,
        askAbout,
        consumePendingInput,
      }}
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
