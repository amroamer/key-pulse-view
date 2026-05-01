import raw from "./efficiencyData.json";

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

export const budgetCategories = raw.budgetCategories as BudgetCategory[];
export const resourceMetrics = raw.resourceMetrics as ResourceMetric[];
export const costEfficiencyData = raw.costEfficiencyData as CostEfficiency[];
export const operationalKPIs = raw.operationalKPIs as OperationalKPI[];
export const efficiencyHeroMetrics = raw.efficiencyHeroMetrics;
