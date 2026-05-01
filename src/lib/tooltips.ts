// Conversational hover-tooltip helpers for dashboard cards. Pure functions
// — no LLM, no chat, no side effects. Each one returns a single sentence
// (or two) that paraphrases the visible numbers in plain English.

import type { KpiData, AmpelaeStatus } from "@/components/dashboard/KpiCard";

const STATUS_PHRASE: Record<AmpelaeStatus, string> = {
  green: "On track",
  amber: "At risk",
  red: "Off track",
};

const stripSign = (s: string) => s.replace(/^[+-]/, "");

/** Tooltip for an executive scoreboard KPI — full data available. */
export function kpiTooltip(kpi: KpiData): string {
  const phrase = STATUS_PHRASE[kpi.status];
  const trendDir = kpi.trendDirection === "up" ? "up" : "down";
  const trendSuffix = ` Trending ${trendDir} ${stripSign(kpi.trendPercent)} year over year.`;

  if (kpi.status === "green") {
    return `${phrase}. Currently ${kpi.value}, meeting the ${kpi.target} target.${trendSuffix}`;
  }
  return `${phrase}. Currently ${kpi.value}, ${stripSign(kpi.gapPercent)} below the ${kpi.target} target.${trendSuffix}`;
}

/** Tooltip for cards that have a score, target, and status (equity dimensions,
 * teacher / quality hero tiles, etc.). */
export function scoreCardTooltip(opts: {
  label: string;
  score: number | string;
  target: number | string;
  status: AmpelaeStatus;
  detail?: string;
}): string {
  const phrase = STATUS_PHRASE[opts.status];
  const base = `${phrase}. ${opts.label} is at ${opts.score} against a target of ${opts.target}.`;
  return opts.detail ? `${base} ${opts.detail}` : base;
}

/** Tooltip for tiles with no status (Total Students, journey hero stats,
 * efficiency hero, system score circle). */
export function simpleTileTooltip(opts: {
  label: string;
  value: string | number;
  sub?: string;
}): string {
  if (opts.sub) {
    return `${opts.label}: ${opts.value} (${opts.sub}).`;
  }
  return `${opts.label}: ${opts.value}.`;
}

/** Tooltip for an E33 pillar / strategic domain summary card. */
export function pillarTooltip(opts: {
  name: string;
  total: number;
  redCount: number;
  amberCount: number;
  greenCount: number;
  status: AmpelaeStatus;
}): string {
  const phrase = STATUS_PHRASE[opts.status];
  const breakdown: string[] = [];
  if (opts.redCount) breakdown.push(`${opts.redCount} off track`);
  if (opts.amberCount) breakdown.push(`${opts.amberCount} at risk`);
  if (opts.greenCount) breakdown.push(`${opts.greenCount} on track`);
  const breakdownText = breakdown.length ? `: ${breakdown.join(", ")}` : "";
  const total = `${opts.total} KPI${opts.total !== 1 ? "s" : ""}`;
  return `${phrase}. ${opts.name} contains ${total}${breakdownText}.`;
}
