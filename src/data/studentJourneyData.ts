import raw from "./studentJourneyData.json";

export interface JourneyStage {
  id: string;
  label: string;
  shortLabel: string;
  ageRange: string;
  enrollment: number;
  completionRate: number;
  avgScore: number;
  status: "green" | "amber" | "red";
  keyMetrics: { label: string; value: string; trend: "up" | "down" | "flat" }[];
}

export interface TransitionPoint {
  from: string;
  to: string;
  rate: number;
  dropoff: number;
  status: "green" | "amber" | "red";
  riskFactors: string[];
}

export interface CohortData {
  year: string;
  kg: number;
  primary: number;
  middle: number;
  secondary: number;
  higher: number;
}

export interface RiskIndicator {
  stage: string;
  dimension: string;
  value: number;
  status: "green" | "amber" | "red";
}

export const journeyStages = raw.journeyStages as JourneyStage[];
export const transitions = raw.transitions as TransitionPoint[];
export const cohortTrends = raw.cohortTrends as CohortData[];
export const riskMatrix = raw.riskMatrix as RiskIndicator[];
