import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartSpec } from "@/lib/chatClient";

const PALETTE = [
  "hsl(var(--primary))",
  "hsl(var(--status-amber-accent))",
  "hsl(var(--status-green-accent))",
  "hsl(var(--status-red-accent))",
];

const tickStyle = { fontSize: 10, fill: "hsl(var(--muted-foreground))" };
const tooltipStyle = {
  fontSize: 11,
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
};

const ACRONYMS: Record<string, string> = {
  Kpi: "KPI",
  Kpis: "KPIs",
  Lms: "LMS",
  Pd: "PD",
  Id: "ID",
  Khda: "KHDA",
  Uae: "UAE",
};

const humanize = (s: string) =>
  s
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w+/g, (w) => {
      const cap = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      return ACRONYMS[cap] ?? w.charAt(0).toUpperCase() + w.slice(1);
    });

const truncate = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1)}…` : s;

const ChatChart = ({ spec }: { spec: ChartSpec }) => {
  const { type, title, data, x, y } = spec;
  const displayTitle = title ? humanize(title) : "";
  const seriesLabel = (key: string) => humanize(key);

  // Bar charts get a horizontal layout when there are too many items for
  // angled x-axis labels to read cleanly.
  const horizontal = type === "bar" && data.length > 5;
  const rowHeight = 22;
  const baseHeight = type === "pie" ? 200 : 180;
  const height = horizontal
    ? Math.max(baseHeight, data.length * rowHeight + 30)
    : baseHeight;

  return (
    <div className="rounded-md border border-border/70 bg-background/70 p-2.5 mb-2 w-[360px] max-w-full">
      {displayTitle && (
        <div className="text-[11px] font-semibold text-foreground/85 mb-1.5 px-0.5">
          {displayTitle}
        </div>
      )}
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" && horizontal ? (
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis type="number" tick={tickStyle} />
              <YAxis
                type="category"
                dataKey={x}
                tick={tickStyle}
                width={120}
                tickFormatter={(v: string) => truncate(String(v), 18)}
                interval={0}
              />
              <Tooltip contentStyle={tooltipStyle} />
              {y.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} formatter={seriesLabel} />}
              {y.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={PALETTE[i % PALETTE.length]}
                  radius={[0, 3, 3, 0]}
                  name={seriesLabel(key)}
                />
              ))}
            </BarChart>
          ) : type === "bar" ? (
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey={x}
                tick={tickStyle}
                interval={0}
                tickFormatter={(v: string) => truncate(String(v), 12)}
              />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              {y.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} formatter={seriesLabel} />}
              {y.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={PALETTE[i % PALETTE.length]}
                  radius={[3, 3, 0, 0]}
                  name={seriesLabel(key)}
                />
              ))}
            </BarChart>
          ) : type === "line" ? (
            <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey={x}
                tick={tickStyle}
                tickFormatter={(v: string) => truncate(String(v), 10)}
              />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              {y.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} formatter={seriesLabel} />}
              {y.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={PALETTE[i % PALETTE.length]}
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                  name={seriesLabel(key)}
                />
              ))}
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey={y[0]}
                nameKey={x}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                innerRadius="45%"
                stroke="hsl(var(--background))"
                strokeWidth={1}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChatChart;
