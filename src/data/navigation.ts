import {
  BookOpen,
  Bookmark,
  Home,
  LineChart,
  Settings,
  Timer,
  Type,
  UserCircle,
} from "lucide-react";
import type { NavItem } from "@/types";

/**
 * Primary navigation, shared between desktop and mobile nav.
 * Kept as data (not JSX) so future parts can extend it without
 * touching the Navbar component itself.
 */
export const primaryNav: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "Learn", path: "/learn", icon: BookOpen },
  { label: "Practice", path: "/practice", icon: Type },
  { label: "Tests", path: "/test", icon: Timer },
  { label: "Progress", path: "/progress", icon: LineChart },
];

/**
 * Secondary navigation (account-level, not part of the learning
 * flow). Shown as small icon links on desktop and as a separate
 * list in the mobile menu.
 */
export const secondaryNav: NavItem[] = [
  { label: "Saved", path: "/saved", icon: Bookmark },
  { label: "Profile", path: "/profile", icon: UserCircle },
  { label: "Settings", path: "/settings", icon: Settings },
];
