import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getNavigationForRole } from "../../constants/navigation";
import { getUserRole } from "../../pages/SignIn/authSlice";
import { cn } from "../../utils/cn";

/** MobileNav — drawer navigation for tablet/mobile breakpoints. */
export default function MobileNav() {
  const location = useLocation();
  const userRole = useSelector(getUserRole);
  const navItems = getNavigationForRole(userRole);

  return (
    <div className="h-full bg-sidebar p-4">
      <p className="mb-4 text-lg font-bold text-primary">CapinAsia</p>
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-lightprimary text-primary" : "hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
              {item.children?.length && isActive ? (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.path}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm",
                        location.pathname === child.path
                          ? "text-primary"
                          : "text-muted-foreground"
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
    </div>
  );
}
