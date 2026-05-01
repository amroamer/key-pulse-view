import { getAcademicRecords, type StudentProfile } from "@/data/studentProfileData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart } from "recharts";

interface AcademicTrajectoryProps {
  student: StudentProfile;
}

const AcademicTrajectory = ({ student }: AcademicTrajectoryProps) => {
  const records = getAcademicRecords(student.id);

  const chartData = records.map((r) => ({
    year: r.year,
    GPA: r.gpa,
    Attendance: r.attendance,
    Conduct: r.conduct,
    Activities: r.extracurricular,
  }));

  // Calculate trend
  const latestGpa = records[records.length - 1]?.gpa ?? 0;
  const previousGpa = records[records.length - 2]?.gpa ?? latestGpa;
  const gpaTrend = latestGpa - previousGpa;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Academic Trajectory</h3>
          <p className="text-[10px] text-muted-foreground">
            {records.length} years of data Â· {records[0]?.year} to {records[records.length - 1]?.year}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xl font-extrabold text-foreground">{latestGpa.toFixed(1)}</p>
            <p className={`text-[10px] font-bold ${gpaTrend >= 0 ? "text-[hsl(var(--trend-up))]" : "text-[hsl(var(--trend-down))]"}`}>
              {gpaTrend >= 0 ? "â–²" : "â–¼"} {Math.abs(gpaTrend).toFixed(1)} GPA
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="attendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 4]} yAxisId="gpa" />
          <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} domain={[0, 100]} yAxisId="pct" orientation="right" hide />
          <Tooltip
            contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(0, 0%, 100%)" }}
          />
          <ReferenceLine yAxisId="gpa" y={3.0} stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Area type="monotone" dataKey="GPA" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#gpaGradient)" yAxisId="gpa" dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="Attendance" stroke="hsl(var(--info))" strokeWidth={1.5} strokeDasharray="4 2" yAxisId="pct" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 text-[10px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-3 h-0.5 rounded bg-primary inline-block" /> GPA (left axis)
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-3 h-0.5 rounded bg-secondary inline-block opacity-60" style={{ borderTop: "1px dashed" }} /> Attendance % (right axis)
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-3 h-px rounded border-t-2 border-dashed border-primary/40 inline-block" /> Target GPA (3.0)
        </span>
      </div>
    </div>
  );
};

export default AcademicTrajectory;
