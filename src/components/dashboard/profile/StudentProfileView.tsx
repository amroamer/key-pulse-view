import { useState } from "react";
import { sampleStudents, type StudentProfile } from "@/data/studentProfileData";
import StudentSelector from "./StudentSelector";
import LifecycleTimeline from "./LifecycleTimeline";
import AcademicTrajectory from "./AcademicTrajectory";
import RiskRadar from "./RiskRadar";
import InterventionTimeline from "./InterventionTimeline";
import ScrollReveal from "../ScrollReveal";
import { User, Calendar, MapPin, GraduationCap } from "lucide-react";

const StudentProfileView = () => {
  const [student, setStudent] = useState<StudentProfile>(sampleStudents[0]);

  return (
    <div className="space-y-5">
      {/* Student selector + bio card */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <StudentSelector selected={student} onSelect={setStudent} />
        </div>
      </ScrollReveal>

      {/* Bio strip */}
      <ScrollReveal delay={40}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { icon: <User size={14} />, label: "Student ID", value: student.id },
            { icon: <Calendar size={14} />, label: "Date of Birth", value: new Date(student.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
            { icon: <User size={14} />, label: "Gender", value: student.gender },
            { icon: <MapPin size={14} />, label: "Nationality", value: student.nationality },
            { icon: <GraduationCap size={14} />, label: "Current Grade", value: student.currentGrade },
            { icon: <MapPin size={14} />, label: "Enrolled Since", value: new Date(student.enrollmentDate).getFullYear().toString() },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card px-3 py-2.5 space-y-0.5">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {item.icon}
                <span className="text-[9px] font-medium uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Lifecycle timeline — full width hero */}
      <ScrollReveal delay={80}>
        <LifecycleTimeline student={student} />
      </ScrollReveal>

      {/* Academic trajectory + Risk radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={120}>
          <AcademicTrajectory student={student} />
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <RiskRadar student={student} />
        </ScrollReveal>
      </div>

      {/* Interventions */}
      <ScrollReveal delay={200}>
        <InterventionTimeline student={student} />
      </ScrollReveal>
    </div>
  );
};

export default StudentProfileView;
