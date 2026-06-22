import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../utils/cn";

const settingsTabs = [
  { label: "Profile", path: "/settings/profile" },
  { label: "Preferences", path: "/settings/preferences" },
  { label: "Security", path: "/settings/security" },
];

/** SettingsLayout — nested settings shell with secondary navigation. */
export default function SettingsLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, preferences, and security options.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {settingsTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-lightprimary text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
