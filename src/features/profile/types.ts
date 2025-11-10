import { LucideIcon } from "lucide-react";

// Props for ProfileCard component
export interface ProfileCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  isComingSoon?: boolean;
}
