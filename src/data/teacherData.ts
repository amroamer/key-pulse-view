import raw from "./teacherData.json";

export interface TeacherQualityBand {
  band: string;
  count: number;
  percent: number;
  color: string;
  status: "green" | "amber" | "red";
}

export interface RetentionCohort {
  year: string;
  hired: number;
  year1: number;
  year2: number;
  year3: number;
  year5: number;
}

export interface PDProgram {
  name: string;
  enrolled: number;
  completed: number;
  satisfaction: number;
  impactScore: number;
  status: "green" | "amber" | "red";
}

export interface TeacherMetric {
  label: string;
  value: string;
  target: string;
  trend: "up" | "down" | "flat";
  status: "green" | "amber" | "red";
  detail: string;
}

export const qualityBands = raw.qualityBands as TeacherQualityBand[];
export const retentionCohorts = raw.retentionCohorts as RetentionCohort[];
export const pdPrograms = raw.pdPrograms as PDProgram[];
export const teacherHeroMetrics = raw.teacherHeroMetrics as TeacherMetric[];
export const teacherBySubject = raw.teacherBySubject as { subject: string; count: number; quality: number; vacancy: number }[];
