import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronRight, Home } from "lucide-react";
import { getNavigationForRole } from "../../constants/navigation";
import { getUserRole } from "../../pages/SignIn/authSlice";

/** Breadcrumbs — route-aware breadcrumb trail derived from navigation config. */
export default function Breadcrumbs() {
  const location = useLocation();
  const userRole = useSelector(getUserRole);
  const navItems = getNavigationForRole(userRole);

  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", path: "/home" }];

  navItems.forEach((item) => {
    if (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)) {
      crumbs.push({ label: item.label, path: item.path });
      item.children?.forEach((child) => {
        if (location.pathname === child.path) {
          crumbs.push({ label: child.label, path: child.path });
        }
      });
    }
  });

  if (crumbs.length === 1 && segments.length === 0) {
    crumbs.push({ label: "Dashboard", path: "/home" });
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm">
      <Home className="h-4 w-4 text-muted-foreground" />
      {crumbs.map((crumb, index) => (
        <span key={crumb.path} className="flex items-center gap-2">
          {index > 0 ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : null}
          <Link
            to={crumb.path}
            className={
              index === crumbs.length - 1
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-primary"
            }
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
