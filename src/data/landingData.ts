import raw from "./landingData.json";

export interface SystemHealth {
  totalStudents: string;
  totalTeachers: string;
  totalSchools: string;
  systemScore: number;
  targetScore: number;
  studentTeacherRatio: string;
  studentsTrend: string;
  schoolsInspected: string;
}

export interface StrategicPillarSummary {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  target: number;
  status: "green" | "amber" | "red";
  insight: string;
  kpis: number;
  critical: number;
}

export interface SystemFlowStep {
  label: string;
  desc: string;
  color: "primary" | "secondary";
  tab: string;
}

export const systemHealth = raw.systemHealth as SystemHealth;
export const strategicPillars = raw.strategicPillars as StrategicPillarSummary[];
export const systemFlow = raw.systemFlow as SystemFlowStep[];
