import raw from "./kpiData.json";
import { getKpiIcon } from "./kpiIcons";
import type { KpiData } from "@/components/dashboard/KpiCard";

interface RawKpi extends Omit<KpiData, "icon"> {
  iconKey: string;
}

export const executiveKpis: KpiData[] = (raw as RawKpi[]).map(({ iconKey, ...rest }) => ({
  ...rest,
  icon: getKpiIcon(iconKey),
}));
