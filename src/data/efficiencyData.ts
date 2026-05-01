export interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
  percent: number;
  status: "green" | "amber" | "red";
}

export interface ResourceMetric {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "flat";
  status: "green" | "amber" | "red";
}

export interface CostEfficiency {
  metric: string;
  dubai: number;
  benchmark: number;
  unit: string;
  status: "green" | "amber" | "red";
  insight: string;
}

export interface OperationalKPI {
  category: string;
  kpis: { label: string; value: string; target: string; status: "green" | "amber" | "red" }[];
}

export const budgetCategories: BudgetCategory[] = [
  { category: "Teacher Salaries", allocated: 2800, spent: 2650, percent: 95, status: "green" },
  { category: "Infrastructure", allocated: 850, spent: 620, percent: 73, status: "amber" },
  { category: "Technology & Digital", allocated: 420, spent: 280, percent: 67, status: "amber" },
  { category: "Curriculum Development", allocated: 320, spent: 195, percent: 61, status: "red" },
  { category: "Professional Development", allocated: 180, spent: 112, percent: 62, status: "red" },
  { category: "Student Services", allocated: 240, spent: 198, percent: 83, status: "amber" },
  { category: "Administration", allocated: 380, spent: 362, percent: 95, status: "green" },
  { category: "Research & Innovation", allocated: 150, spent: 68, percent: 45, status: "red" },
];

export const resourceMetrics: ResourceMetric[] = [
  { label: "Student-Teacher Ratio", value: 18.2, target: 15, unit: ":1", trend: "down", status: "amber" },
  { label: "Classroom Utilization", value: 82, target: 90, unit: "%", trend: "up", status: "amber" },
  { label: "Digital Device Ratio", value: 0.6, target: 1.0, unit: ":1", trend: "up", status: "red" },
  { label: "Library Access", value: 72, target: 95, unit: "%", trend: "flat", status: "amber" },
  { label: "Lab Availability", value: 68, target: 85, unit: "%", trend: "up", status: "amber" },
  { label: "Sports Facility Usage", value: 78, target: 85, unit: "%", trend: "flat", status: "amber" },
];

export const costEfficiencyData: CostEfficiency[] = [
  { metric: "Cost per Student", dubai: 42000, benchmark: 38000, unit: "AED", status: "amber", insight: "11% above regional benchmark" },
  { metric: "Admin Cost Ratio", dubai: 18, benchmark: 12, unit: "%", status: "red", insight: "High overhead vs peers" },
  { metric: "Digital Spend / Student", dubai: 1200, benchmark: 2800, unit: "AED", status: "red", insight: "Under-investing in technology" },
  { metric: "PD Spend / Teacher", dubai: 2600, benchmark: 4500, unit: "AED", status: "red", insight: "Below international standards" },
  { metric: "Infrastructure ROI", dubai: 72, benchmark: 85, unit: "index", status: "amber", insight: "Utilization drag on returns" },
  { metric: "Energy Cost / sqm", dubai: 145, benchmark: 120, unit: "AED", status: "amber", insight: "Sustainability initiatives needed" },
];

export const operationalKPIs: OperationalKPI[] = [
  {
    category: "Human Resources",
    kpis: [
      { label: "Staff Vacancy Rate", value: "5.2%", target: "≤3%", status: "amber" },
      { label: "Avg Time to Hire", value: "42 days", target: "≤30 days", status: "red" },
      { label: "Staff Satisfaction", value: "72%", target: "≥85%", status: "amber" },
    ],
  },
  {
    category: "Operations",
    kpis: [
      { label: "Maintenance Backlog", value: "18%", target: "≤5%", status: "red" },
      { label: "IT Uptime", value: "99.2%", target: "≥99.5%", status: "amber" },
      { label: "Transport Efficiency", value: "88%", target: "≥95%", status: "amber" },
    ],
  },
  {
    category: "Finance",
    kpis: [
      { label: "Budget Variance", value: "-22%", target: "±5%", status: "red" },
      { label: "Procurement Cycle", value: "35 days", target: "≤21 days", status: "red" },
      { label: "Revenue Collection", value: "91%", target: "≥98%", status: "amber" },
    ],
  },
];

export const efficiencyHeroMetrics = [
  { label: "Total Budget", value: "5.34B", unit: "AED", subtext: "FY 2025-26" },
  { label: "Execution Rate", value: "68%", unit: "", subtext: "Target: 90–110%" },
  { label: "Cost / Student", value: "42K", unit: "AED", subtext: "vs 38K benchmark" },
  { label: "ROI Index", value: "72", unit: "/100", subtext: "+4 pts YoY" },
];
