import raw from "./equityData.json";

export interface DemographicGroup {
  group: string;
  enrollment: number;
  completionRate: number;
  avgScore: number;
  gap: number;
  trend: "up" | "down" | "flat";
  status: "green" | "amber" | "red";
}

export interface EquityDimension {
  id: string;
  label: string;
  score: number;
  target: number;
  status: "green" | "amber" | "red";
  subMetrics: { label: string; value: number; target: number }[];
}

export interface GeoDistrict {
  name: string;
  schools: number;
  students: number;
  avgScore: number;
  status: "green" | "amber" | "red";
  accessIndex: number;
}

export interface InclusionMetric {
  category: string;
  metric: string;
  value: number;
  target: number;
  status: "green" | "amber" | "red";
  trend: "up" | "down" | "flat";
}

export const demographicGroups = raw.demographicGroups as DemographicGroup[];
export const genderData = raw.genderData;
export const equityDimensions = raw.equityDimensions as EquityDimension[];
export const geoDistricts = raw.geoDistricts as GeoDistrict[];
export const inclusionMetrics = raw.inclusionMetrics as InclusionMetric[];
