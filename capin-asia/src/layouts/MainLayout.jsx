import { Outlet } from "react-router-dom";
import { cn } from "../utils/cn";
import { useSettingsStore } from "../store/useSettingsStore";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";

/** MainLayout — primary authenticated application shell. */
export default function MainLayout({ showBreadcrumbs = true, showFooter = true }) {
  const sidebarCollapsed = useSettingsStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all",
          sidebarCollapsed ? "xl:pl-[80px]" : "xl:pl-[270px]"
        )}
      >
        <TopNav />
        <div className="container mx-auto flex-1 px-4 py-6 md:px-6">
          {showBreadcrumbs ? <Breadcrumbs /> : null}
          <main className="grow">
            <Outlet />
          </main>
          {showFooter ? <Footer /> : null}
        </div>
      </div>
    </div>
  );
}
