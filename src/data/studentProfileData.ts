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

export const sampleStudents: StudentProfile[] = [
  {
    id: "STU-2024-0847",
    name: "Ahmed Al Maktoum",
    emiratesId: "784-****-*****-1",
    dateOfBirth: "2010-03-15",
    gender: "Male",
    nationality: "UAE",
    currentStage: "Secondary",
    currentSchool: "Dubai National Academy",
    currentGrade: "Grade 10",
    enrollmentDate: "2014-09-01",
    overallStatus: "amber",
    gpa: 3.2,
    attendance: 91,
  },
  {
    id: "STU-2024-1203",
    name: "Fatima Hassan",
    emiratesId: "784-****-*****-2",
    dateOfBirth: "2008-07-22",
    gender: "Female",
    nationality: "UAE",
    currentStage: "Higher Education",
    currentSchool: "University of Dubai",
    currentGrade: "Year 2",
    enrollmentDate: "2012-09-01",
    overallStatus: "green",
    gpa: 3.8,
    attendance: 96,
  },
  {
    id: "STU-2024-0391",
    name: "Omar Khalifa",
    emiratesId: "784-****-*****-3",
    dateOfBirth: "2012-11-08",
    gender: "Male",
    nationality: "UAE",
    currentStage: "Middle",
    currentSchool: "Al Wasl Secondary",
    currentGrade: "Grade 8",
    enrollmentDate: "2016-09-01",
    overallStatus: "red",
    gpa: 2.1,
    attendance: 74,
  },
  {
    id: "STU-2024-0562",
    name: "Maryam Al Rashid",
    emiratesId: "784-****-*****-4",
    dateOfBirth: "2015-01-19",
    gender: "Female",
    nationality: "UAE",
    currentStage: "Primary",
    currentSchool: "Jumeirah Model School",
    currentGrade: "Grade 5",
    enrollmentDate: "2019-09-01",
    overallStatus: "green",
    gpa: 3.6,
    attendance: 97,
  },
];

export const getStudentMilestones = (studentId: string): StudentMilestone[] => {
  const milestones: Record<string, StudentMilestone[]> = {
    "STU-2024-0847": [
      { id: "m1", date: "2014-09", stage: "KG", type: "transition", title: "Enrolled in KG1", description: "First enrollment at Dubai National Academy", impact: "positive" },
      { id: "m2", date: "2015-06", stage: "KG", type: "achievement", title: "Readiness Assessment: Advanced", description: "Scored 92nd percentile in school readiness", impact: "positive" },
      { id: "m3", date: "2016-09", stage: "Primary", type: "transition", title: "Entered Primary School", description: "Smooth transition to Grade 1", impact: "positive" },
      { id: "m4", date: "2018-03", stage: "Primary", type: "academic", title: "Math Olympiad Finalist", description: "Top 10 in Dubai Inter-School Math Olympiad", impact: "positive" },
      { id: "m5", date: "2019-11", stage: "Primary", type: "behavioral", title: "Engagement Drop Detected", description: "Participation decreased by 30% over Q3", impact: "negative" },
      { id: "m6", date: "2020-01", stage: "Primary", type: "intervention", title: "Mentorship Program Assigned", description: "Paired with senior student mentor for motivation", impact: "positive" },
      { id: "m7", date: "2020-06", stage: "Primary", type: "achievement", title: "Completion: Primary Honors", description: "Graduated primary with distinction", impact: "positive" },
      { id: "m8", date: "2020-09", stage: "Middle", type: "transition", title: "Entered Middle School", description: "Transition to Grade 7 with accelerated math track", impact: "positive" },
      { id: "m9", date: "2021-12", stage: "Middle", type: "academic", title: "GPA Decline: 3.6 → 2.9", description: "Struggled with new curriculum demands in science", impact: "negative" },
      { id: "m10", date: "2022-02", stage: "Middle", type: "intervention", title: "Tutoring: Science & English", description: "Weekly tutoring sessions initiated", impact: "positive" },
      { id: "m11", date: "2022-06", stage: "Middle", type: "academic", title: "GPA Recovery: 2.9 → 3.4", description: "Strong improvement after intervention", impact: "positive" },
      { id: "m12", date: "2023-09", stage: "Secondary", type: "transition", title: "Entered Secondary School", description: "Started Grade 10 in STEM track", impact: "neutral" },
      { id: "m13", date: "2024-01", stage: "Secondary", type: "behavioral", title: "Attendance Warning", description: "Attendance dropped below 85% threshold", impact: "negative" },
      { id: "m14", date: "2024-03", stage: "Secondary", type: "intervention", title: "Family Engagement Meeting", description: "Coordinated with family on attendance improvement plan", impact: "positive" },
    ],
    "STU-2024-1203": [
      { id: "m1", date: "2012-09", stage: "KG", type: "transition", title: "Enrolled in KG1", description: "Started at Emirates International School", impact: "positive" },
      { id: "m2", date: "2014-09", stage: "Primary", type: "transition", title: "Entered Primary School", description: "Consistently top performer", impact: "positive" },
      { id: "m3", date: "2017-06", stage: "Primary", type: "achievement", title: "National Science Award", description: "Won Dubai Young Scientist Award", impact: "positive" },
      { id: "m4", date: "2020-09", stage: "Middle", type: "transition", title: "Entered Middle School", description: "Selected for gifted program", impact: "positive" },
      { id: "m5", date: "2022-09", stage: "Secondary", type: "transition", title: "Entered Secondary School", description: "IB Diploma track", impact: "positive" },
      { id: "m6", date: "2024-06", stage: "Secondary", type: "achievement", title: "IB Score: 42/45", description: "Near-perfect IB diploma score", impact: "positive" },
      { id: "m7", date: "2024-09", stage: "Higher Education", type: "transition", title: "University Enrollment", description: "Engineering program at University of Dubai", impact: "positive" },
    ],
    "STU-2024-0391": [
      { id: "m1", date: "2016-09", stage: "KG", type: "transition", title: "Enrolled in KG1", description: "Late enrollment (age 4.5)", impact: "neutral" },
      { id: "m2", date: "2017-03", stage: "KG", type: "behavioral", title: "Behavioral Concern Flagged", description: "Difficulty with social interaction", impact: "negative" },
      { id: "m3", date: "2017-06", stage: "KG", type: "intervention", title: "Counseling Initiated", description: "Weekly sessions with school counselor", impact: "positive" },
      { id: "m4", date: "2018-09", stage: "Primary", type: "transition", title: "Entered Primary School", description: "Conditional promotion with support plan", impact: "neutral" },
      { id: "m5", date: "2020-03", stage: "Primary", type: "academic", title: "Learning Gap Identified", description: "Below grade level in literacy and numeracy", impact: "negative" },
      { id: "m6", date: "2020-09", stage: "Primary", type: "intervention", title: "Individualized Learning Plan", description: "ILP created with remedial support", impact: "positive" },
      { id: "m7", date: "2022-09", stage: "Middle", type: "transition", title: "Entered Middle School", description: "Transition with continued support", impact: "neutral" },
      { id: "m8", date: "2023-11", stage: "Middle", type: "academic", title: "GPA: 2.1 — At Risk", description: "Multiple subject failures in Q2", impact: "negative" },
      { id: "m9", date: "2024-01", stage: "Middle", type: "intervention", title: "Multi-Tiered Support", description: "Intensive academic and behavioral support initiated", impact: "positive" },
    ],
  };
  return milestones[studentId] || milestones["STU-2024-0847"];
};

export const getAcademicRecords = (studentId: string): AcademicRecord[] => {
  const records: Record<string, AcademicRecord[]> = {
    "STU-2024-0847": [
      { year: "2014-15", stage: "KG", gpa: 3.8, attendance: 95, conduct: 90, extracurricular: 70 },
      { year: "2015-16", stage: "KG", gpa: 3.9, attendance: 96, conduct: 92, extracurricular: 75 },
      { year: "2016-17", stage: "Primary", gpa: 3.7, attendance: 94, conduct: 88, extracurricular: 80 },
      { year: "2017-18", stage: "Primary", gpa: 3.6, attendance: 93, conduct: 85, extracurricular: 85 },
      { year: "2018-19", stage: "Primary", gpa: 3.4, attendance: 90, conduct: 82, extracurricular: 75 },
      { year: "2019-20", stage: "Primary", gpa: 3.5, attendance: 92, conduct: 86, extracurricular: 78 },
      { year: "2020-21", stage: "Middle", gpa: 3.2, attendance: 89, conduct: 80, extracurricular: 65 },
      { year: "2021-22", stage: "Middle", gpa: 2.9, attendance: 86, conduct: 75, extracurricular: 60 },
      { year: "2022-23", stage: "Middle", gpa: 3.4, attendance: 91, conduct: 85, extracurricular: 70 },
      { year: "2023-24", stage: "Secondary", gpa: 3.2, attendance: 88, conduct: 82, extracurricular: 72 },
      { year: "2024-25", stage: "Secondary", gpa: 3.2, attendance: 91, conduct: 84, extracurricular: 68 },
    ],
    "STU-2024-0391": [
      { year: "2016-17", stage: "KG", gpa: 2.8, attendance: 82, conduct: 65, extracurricular: 40 },
      { year: "2017-18", stage: "KG", gpa: 3.0, attendance: 85, conduct: 70, extracurricular: 45 },
      { year: "2018-19", stage: "Primary", gpa: 2.6, attendance: 80, conduct: 68, extracurricular: 35 },
      { year: "2019-20", stage: "Primary", gpa: 2.4, attendance: 78, conduct: 65, extracurricular: 30 },
      { year: "2020-21", stage: "Primary", gpa: 2.7, attendance: 82, conduct: 72, extracurricular: 40 },
      { year: "2021-22", stage: "Primary", gpa: 2.5, attendance: 79, conduct: 70, extracurricular: 35 },
      { year: "2022-23", stage: "Middle", gpa: 2.3, attendance: 76, conduct: 68, extracurricular: 30 },
      { year: "2023-24", stage: "Middle", gpa: 2.1, attendance: 74, conduct: 62, extracurricular: 28 },
    ],
  };
  return records[studentId] || records["STU-2024-0847"];
};

export const getRiskDimensions = (studentId: string): RiskDimension[] => {
  const risks: Record<string, RiskDimension[]> = {
    "STU-2024-0847": [
      { dimension: "Academic Performance", score: 68, trend: "stable" },
      { dimension: "Attendance", score: 78, trend: "improving" },
      { dimension: "Behavioral", score: 72, trend: "stable" },
      { dimension: "Social-Emotional", score: 65, trend: "improving" },
      { dimension: "Family Engagement", score: 60, trend: "improving" },
      { dimension: "University Readiness", score: 55, trend: "stable" },
    ],
    "STU-2024-1203": [
      { dimension: "Academic Performance", score: 95, trend: "stable" },
      { dimension: "Attendance", score: 96, trend: "stable" },
      { dimension: "Behavioral", score: 92, trend: "stable" },
      { dimension: "Social-Emotional", score: 88, trend: "improving" },
      { dimension: "Family Engagement", score: 90, trend: "stable" },
      { dimension: "University Readiness", score: 94, trend: "improving" },
    ],
    "STU-2024-0391": [
      { dimension: "Academic Performance", score: 35, trend: "declining" },
      { dimension: "Attendance", score: 42, trend: "declining" },
      { dimension: "Behavioral", score: 48, trend: "stable" },
      { dimension: "Social-Emotional", score: 40, trend: "declining" },
      { dimension: "Family Engagement", score: 55, trend: "improving" },
      { dimension: "University Readiness", score: 20, trend: "declining" },
    ],
  };
  return risks[studentId] || risks["STU-2024-0847"];
};

export const getInterventions = (studentId: string): Intervention[] => {
  const interventions: Record<string, Intervention[]> = {
    "STU-2024-0847": [
      { id: "i1", date: "2020-01", type: "Mentorship", description: "Senior student mentor program", status: "completed", outcome: "Engagement improved 25%" },
      { id: "i2", date: "2022-02", type: "Academic Tutoring", description: "Weekly science & English tutoring", status: "completed", outcome: "GPA recovered from 2.9 to 3.4" },
      { id: "i3", date: "2024-03", type: "Family Engagement", description: "Attendance improvement plan with family", status: "active" },
      { id: "i4", date: "2025-09", type: "Career Counseling", description: "University readiness assessment & planning", status: "planned" },
    ],
    "STU-2024-0391": [
      { id: "i1", date: "2017-06", type: "Counseling", description: "Social skills development counseling", status: "completed", outcome: "Moderate improvement in social interaction" },
      { id: "i2", date: "2020-09", type: "Individualized Learning Plan", description: "ILP with remedial literacy & numeracy support", status: "completed", outcome: "Partial improvement, gaps remain" },
      { id: "i3", date: "2024-01", type: "Multi-Tiered Support", description: "Intensive academic and behavioral support", status: "active" },
    ],
  };
  return interventions[studentId] || interventions["STU-2024-0847"];
};

// Stage definitions for the lifecycle visualization
export const lifecycleStages = [
  { id: "kg", label: "Kindergarten", shortLabel: "KG", years: "4-5 yrs", icon: "baby" },
  { id: "primary", label: "Primary School", shortLabel: "Primary", years: "6-11 yrs", icon: "book" },
  { id: "middle", label: "Middle School", shortLabel: "Middle", years: "12-14 yrs", icon: "brain" },
  { id: "secondary", label: "Secondary School", shortLabel: "Secondary", years: "15-17 yrs", icon: "graduation" },
  { id: "higher", label: "Higher Education", shortLabel: "Higher Ed", years: "18-22 yrs", icon: "university" },
] as const;

export const stageMap: Record<string, number> = {
  "KG": 0,
  "Primary": 1,
  "Middle": 2,
  "Secondary": 3,
  "Higher Education": 4,
};
