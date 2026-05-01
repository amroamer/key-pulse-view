import raw from "./qualityData.json";

export interface SchoolRating {
  rating: string;
  count: number;
  percent: number;
  color: string;
  prevPercent: number;
}

export interface InspectionOutcome {
  school: string;
  type: string;
  rating: string;
  prevRating: string;
  date: string;
  status: "green" | "amber" | "red";
  keyFindings: string[];
}

export interface ComplianceArea {
  area: string;
  score: number;
  target: number;
  status: "green" | "amber" | "red";
  trend: "up" | "down" | "flat";
  issues: number;
}

export interface ImprovementTrajectory {
  school: string;
  ratings: { year: string; score: number }[];
  currentStatus: "green" | "amber" | "red";
  trajectory: "improving" | "declining" | "stable";
}

export const schoolRatings = raw.schoolRatings as SchoolRating[];
export const recentInspections = raw.recentInspections as InspectionOutcome[];
export const complianceAreas = raw.complianceAreas as ComplianceArea[];
export const improvementTrajectories = raw.improvementTrajectories as ImprovementTrajectory[];
export const qualityHeroMetrics = raw.qualityHeroMetrics as {
  label: string;
  value: string;
  target: string;
  percent: number;
  status: "green" | "amber" | "red";
}[];
