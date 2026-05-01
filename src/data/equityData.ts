export interface DemographicGroup {
  group: string;
  enrollment: number;
  completionRate: number;
  avgScore: number;
  gap: number; // gap to system average
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

export const demographicGroups: DemographicGroup[] = [
  { group: "UAE Nationals", enrollment: 87000, completionRate: 94, avgScore: 76, gap: 2, trend: "up", status: "green" },
  { group: "Arab Expats", enrollment: 112000, completionRate: 91, avgScore: 72, gap: -2, trend: "flat", status: "amber" },
  { group: "South Asian", enrollment: 98000, completionRate: 89, avgScore: 70, gap: -4, trend: "up", status: "amber" },
  { group: "Western Expats", enrollment: 34000, completionRate: 96, avgScore: 82, gap: 8, trend: "flat", status: "green" },
  { group: "East Asian", enrollment: 18500, completionRate: 95, avgScore: 84, gap: 10, trend: "up", status: "green" },
  { group: "African", enrollment: 12000, completionRate: 82, avgScore: 64, gap: -10, trend: "up", status: "red" },
];

export const genderData = {
  male: { enrollment: 186000, avgScore: 71, completionRate: 89, stem: 64 },
  female: { enrollment: 175500, avgScore: 76, completionRate: 93, stem: 48 },
};

export const equityDimensions: EquityDimension[] = [
  {
    id: "access",
    label: "Access to Education",
    score: 88,
    target: 95,
    status: "amber",
    subMetrics: [
      { label: "Geographic Coverage", value: 92, target: 98 },
      { label: "Affordability Index", value: 78, target: 90 },
      { label: "Special Needs Inclusion", value: 65, target: 85 },
      { label: "Language Support", value: 82, target: 95 },
    ],
  },
  {
    id: "outcomes",
    label: "Outcome Equity",
    score: 62,
    target: 80,
    status: "red",
    subMetrics: [
      { label: "Achievement Gap (Income)", value: 55, target: 80 },
      { label: "Achievement Gap (Nationality)", value: 68, target: 85 },
      { label: "Gender Parity Index", value: 92, target: 95 },
      { label: "SEN Achievement", value: 48, target: 70 },
    ],
  },
  {
    id: "resources",
    label: "Resource Equity",
    score: 71,
    target: 85,
    status: "amber",
    subMetrics: [
      { label: "Per-Pupil Spending Parity", value: 74, target: 90 },
      { label: "Teacher Quality Distribution", value: 65, target: 80 },
      { label: "Digital Access Parity", value: 58, target: 85 },
      { label: "Facility Quality Parity", value: 82, target: 90 },
    ],
  },
  {
    id: "participation",
    label: "Participation Equity",
    score: 79,
    target: 90,
    status: "amber",
    subMetrics: [
      { label: "Extracurricular Access", value: 72, target: 85 },
      { label: "Gifted Program Diversity", value: 58, target: 80 },
      { label: "Vocational Pathway Access", value: 85, target: 90 },
      { label: "Higher Ed Pipeline Equity", value: 68, target: 85 },
    ],
  },
];

export const geoDistricts: GeoDistrict[] = [
  { name: "Dubai Marina", schools: 28, students: 32000, avgScore: 82, status: "green", accessIndex: 94 },
  { name: "Jumeirah", schools: 35, students: 41000, avgScore: 79, status: "green", accessIndex: 91 },
  { name: "Business Bay", schools: 22, students: 24000, avgScore: 76, status: "amber", accessIndex: 88 },
  { name: "Deira", schools: 42, students: 58000, avgScore: 68, status: "amber", accessIndex: 72 },
  { name: "Al Quoz", schools: 18, students: 28000, avgScore: 62, status: "red", accessIndex: 65 },
  { name: "International City", schools: 15, students: 35000, avgScore: 58, status: "red", accessIndex: 58 },
  { name: "Dubai Silicon Oasis", schools: 12, students: 18000, avgScore: 74, status: "amber", accessIndex: 82 },
  { name: "Al Barsha", schools: 30, students: 38000, avgScore: 77, status: "green", accessIndex: 89 },
];

export const inclusionMetrics: InclusionMetric[] = [
  { category: "SEN", metric: "Students with IEPs", value: 4200, target: 5500, status: "amber", trend: "up" },
  { category: "SEN", metric: "Inclusion Rate", value: 72, target: 90, status: "red", trend: "up" },
  { category: "SEN", metric: "Support Staff Ratio", value: 65, target: 85, status: "red", trend: "flat" },
  { category: "Language", metric: "ELL Support Coverage", value: 78, target: 95, status: "amber", trend: "up" },
  { category: "Language", metric: "Arabic Proficiency", value: 68, target: 85, status: "amber", trend: "flat" },
  { category: "Gifted", metric: "Identification Rate", value: 5.2, target: 8, status: "amber", trend: "up" },
  { category: "Gifted", metric: "Program Enrollment", value: 3800, target: 6000, status: "red", trend: "up" },
  { category: "Economic", metric: "Scholarship Coverage", value: 82, target: 95, status: "amber", trend: "up" },
  { category: "Economic", metric: "Fee Assistance", value: 68, target: 85, status: "amber", trend: "flat" },
];
