import raw from "./studentProfileData.json";

export interface StudentMilestone {
  id: string;
  date: string;
  stage: string;
  type: "academic" | "behavioral" | "intervention" | "achievement" | "transition";
  title: string;
  description: string;
  impact: "positive" | "neutral" | "negative";
}

export interface AcademicRecord {
  year: string;
  stage: string;
  gpa: number;
  attendance: number;
  conduct: number;
  extracurricular: number;
}

export interface RiskDimension {
  dimension: string;
  score: number;
  trend: "improving" | "stable" | "declining";
}

export interface Intervention {
  id: string;
  date: string;
  type: string;
  description: string;
  status: "active" | "completed" | "planned";
  outcome?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  emiratesId: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  nationality: string;
  currentStage: string;
  currentSchool: string;
  currentGrade: string;
  enrollmentDate: string;
  overallStatus: "green" | "amber" | "red";
  gpa: number;
  attendance: number;
  photo?: string;
}

const milestonesByStudent = raw.milestones as Record<string, StudentMilestone[]>;
const academicByStudent = raw.academicRecords as Record<string, AcademicRecord[]>;
const riskByStudent = raw.riskDimensions as Record<string, RiskDimension[]>;
const interventionsByStudent = raw.interventions as Record<string, Intervention[]>;

const FALLBACK_ID = "STU-2024-0847";

export const sampleStudents = raw.sampleStudents as StudentProfile[];

export const getStudentMilestones = (studentId: string): StudentMilestone[] =>
  milestonesByStudent[studentId] ?? milestonesByStudent[FALLBACK_ID];

export const getAcademicRecords = (studentId: string): AcademicRecord[] =>
  academicByStudent[studentId] ?? academicByStudent[FALLBACK_ID];

export const getRiskDimensions = (studentId: string): RiskDimension[] =>
  riskByStudent[studentId] ?? riskByStudent[FALLBACK_ID];

export const getInterventions = (studentId: string): Intervention[] =>
  interventionsByStudent[studentId] ?? interventionsByStudent[FALLBACK_ID];

export const lifecycleStages = raw.lifecycleStages;

export const stageMap = raw.stageMap as Record<string, number>;
