import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  status: "green" | "amber" | "red";
}

const statusColors = {
  green: "hsl(122, 39%, 49%)",
  amber: "hsl(36, 100%, 50%)",
  red: "hsl(0, 65%, 51%)",
};

const Sparkline = ({ data, width = 180, height = 48, status }: SparklineProps) => {
  const path = useMemo(() => {
    if (data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 4;
    const w = width - padding * 2;
    const h = height - padding * 2;
    const step = w / (data.length - 1);

    const points = data.map((v, i) => ({
      x: padding + i * step,
      y: padding + h - ((v - min) / range) * h,
    }));

    // Smooth curve using catmull-rom
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!path) return "";
    const padding = 4;
    const lastX = padding + ((width - padding * 2) / (data.length - 1)) * (data.length - 1);
    return `${path} L ${lastX},${height - padding} L ${padding},${height - padding} Z`;
  }, [path, data, width, height]);

  const color = statusColors[status];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${status}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${status})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* Last data point dot */}
      {data.length > 0 && (() => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const padding = 4;
        const w = width - padding * 2;
        const h = height - padding * 2;
        const step = w / (data.length - 1);
        const last = data[data.length - 1];
        const cx = padding + (data.length - 1) * step;
        const cy = padding + h - ((last - min) / range) * h;
        return <circle cx={cx} cy={cy} r={3} fill={color} stroke="white" strokeWidth={2} />;
      })()}
    </svg>
  );
};

export default Sparkline;
