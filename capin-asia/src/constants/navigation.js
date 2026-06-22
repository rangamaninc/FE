import {
  Calendar,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Receipt,
  Shield,
  Wallet,
} from "lucide-react";

/** Role-based navigation config for the application shell. */
export const NAV_ITEMS = [
  {
    id: "home",
    label: "Dashboard",
    path: "/home",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "operator", "user"],
  },
  {
    id: "schedular",
    label: "Schedular Module",
    path: "/schedular-module",
    icon: Calendar,
    roles: ["admin", "manager", "operator", "user"],
  },
  {
    id: "working-papers",
    label: "Working Papers",
    path: "/working-papers",
    icon: Receipt,
    roles: ["admin", "manager", "operator", "user"],
  },
  {
    id: "opening",
    label: "Opening Module",
    path: "/opening-module",
    icon: FolderOpen,
    roles: ["admin", "manager", "operator", "user"],
  },
  {
    id: "insurance",
    label: "Insurance",
    path: "/insurance",
    icon: Shield,
    roles: ["admin", "manager", "operator", "user"],
  },
  {
    id: "accounting",
    label: "Accounting Module",
    path: "/accounting-module",
    icon: Wallet,
    roles: ["admin", "manager", "operator", "user"],
  },
  {
    id: "admin",
    label: "Admin Module",
    path: "/admin-module",
    icon: FileText,
    roles: ["admin", "manager"],
    children: [
      { id: "admin-users", label: "Users", path: "/admin-module/users" },
      { id: "admin-clients", label: "Clients", path: "/admin-module/clients" },
    ],
  },
];

export function getNavigationForRole(role = "") {
  const normalizedRole = role.toLowerCase();
  return NAV_ITEMS.filter((item) => item.roles.includes(normalizedRole));
}
