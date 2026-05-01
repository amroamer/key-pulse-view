import { executiveKpis } from "@/data/kpiData";
import type { KpiData } from "@/components/dashboard/KpiCard";

export interface KpiSnapshotItem {
  id: string;
  pillar: string;
  name: string;
  e33Code: string;
  value: string;
  unit?: string;
  trendValue: string;
  trendDirection: "up" | "down";
  trendPercent: string;
  status: "green" | "amber" | "red";
  target: string;
  gap: string;
  gapPercent: string;
  benchmark?: string;
}

const stripIcon = (kpi: KpiData, pillar: string): KpiSnapshotItem => {
  const { icon: _icon, sparklineData: _sd, ...rest } = kpi;
  void _icon;
  void _sd;
  return { ...rest, pillar };
};

export const getKpiSnapshot = (): KpiSnapshotItem[] => [
  ...executiveKpis.map((k) => stripIcon(k, "executive")),
];
