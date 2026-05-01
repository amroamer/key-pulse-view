import { sampleStudents, type StudentProfile } from "@/data/studentProfileData";
import { Search, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface StudentSelectorProps {
  selected: StudentProfile;
  onSelect: (student: StudentProfile) => void;
}

const statusLabel = { green: "On Track", amber: "At Risk", red: "Off Track" };

const StudentSelector = ({ selected, onSelect }: StudentSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = sampleStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-3 hover:border-primary/40 transition-all w-full sm:w-auto"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={18} className="text-primary" />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-foreground">{selected.name}</p>
          <p className="text-[10px] text-muted-foreground">
            {selected.id} · {selected.currentStage} · {selected.currentSchool}
          </p>
        </div>
        <div
          className={`status-pill ml-2 ${
            selected.overallStatus === "green"
              ? "status-pill-green"
              : selected.overallStatus === "amber"
              ? "status-pill-amber"
              : "status-pill-red"
          }`}
        >
          {statusLabel[selected.overallStatus]}
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-96 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Search size={14} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((student) => (
              <button
                key={student.id}
                onClick={() => {
                  onSelect(student);
                  setOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left ${
                  student.id === selected.id ? "bg-primary/5" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{student.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {student.id} · {student.currentGrade} · {student.currentSchool}
                  </p>
                </div>
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    student.overallStatus === "green"
                      ? "bg-[hsl(var(--status-green-accent))]"
                      : student.overallStatus === "amber"
                      ? "bg-[hsl(var(--status-amber-accent))]"
                      : "bg-[hsl(var(--status-red-accent))]"
                  }`}
                />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No students found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSelector;
