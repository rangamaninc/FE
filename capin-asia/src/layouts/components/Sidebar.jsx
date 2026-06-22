import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { getNavigationForRole } from "../../constants/navigation";
import { getUserRole } from "../../pages/SignIn/authSlice";
import { cn } from "../../utils/cn";
import { useSettingsStore } from "../../store/useSettingsStore";

/** Sidebar — route-aware, role-filtered desktop navigation. */
export default function Sidebar() {
  const location = useLocation();
  const userRole = useSelector(getUserRole);
  const sidebarCollapsed = useSettingsStore((state) => state.sidebarCollapsed);
  const navItems = getNavigationForRole(userRole);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen border-r border-border bg-sidebar text-sidebar-foreground transition-all xl:block",
        sidebarCollapsed ? "w-[80px]" : "w-[270px]"
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to="/home" className="text-lg font-bold text-primary">
          {sidebarCollapsed ? "CA" : "CapinAsia"}
        </Link>
      </div>
      <SimpleBar className="h-[calc(100vh-4rem)] px-4 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <div key={item.id}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-lightprimary text-primary"
                      : "text-sidebar-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed ? <span>{item.label}</span> : null}
                </Link>
                {!sidebarCollapsed && item.children?.length && isActive ? (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.path}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition-colors",
                          location.pathname === child.path
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </SimpleBar>
    </aside>
  );
}
