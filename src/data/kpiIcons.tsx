import {
  BookOpen, Users, GraduationCap, Monitor,
  Star, DollarSign, UserCheck, Heart,
  BookOpenCheck, Laptop, Smile, Target,
} from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen size={18} />,
  Users: <Users size={18} />,
  GraduationCap: <GraduationCap size={18} />,
  Monitor: <Monitor size={18} />,
  Star: <Star size={18} />,
  DollarSign: <DollarSign size={18} />,
  UserCheck: <UserCheck size={18} />,
  Heart: <Heart size={18} />,
  BookOpenCheck: <BookOpenCheck size={18} />,
  Laptop: <Laptop size={18} />,
  Smile: <Smile size={18} />,
  Target: <Target size={18} />,
};

export const getKpiIcon = (key: string): React.ReactNode =>
  ICONS[key] ?? <Target size={18} />;
