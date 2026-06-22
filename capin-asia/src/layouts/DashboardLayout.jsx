import { Outlet } from "react-router-dom";

/** DashboardLayout — content wrapper for dashboard pages inside MainLayout. */
export default function DashboardLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
}
