import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import SchedularModule from "../pages/SchedularModule";
import WorkingPapers from "../pages/WorkingPapers";
import OpeningModule from "../pages/OpeningModule";
import Insurance from "../pages/Insurance";
import AccountingModule from "../pages/AccountingModule";
import AdminModule from "../pages/AdminModule";
import AdminUsers from "../pages/AdminModule/Users";
import AdminClients from "../pages/AdminModule/Clients";

import { MainLayout, AuthLayout } from "../layouts";
import { TooltipProvider, ToastProvider } from "../components/ui";

const PrivateRoutes = () => {
  const userData = localStorage.getItem("authToken");
  return userData ? <Outlet /> : <Navigate to="/" replace />;
};

/** Root route: sign-in when logged out, dashboard when logged in. */
function RootRoute() {
  const userData = localStorage.getItem("authToken");
  if (userData) {
    return <Navigate to="/home" replace />;
  }

  return (
    <AuthLayout title="Sign in" subtitle="Access your CapinAsia workspace">
      <SignIn />
    </AuthLayout>
  );
}

/** AppRoutes — TailAdmin shell with original route behavior. */
export default function AppRoutes() {
  return (
    <TooltipProvider>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/sign-in" element={<Navigate to="/" replace />} />

        <Route element={<PrivateRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/schedular-module" element={<SchedularModule />} />
            <Route path="/working-papers" element={<WorkingPapers />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/opening-module" element={<OpeningModule />} />
            <Route path="/accounting-module" element={<AccountingModule />} />
            <Route path="/admin-module" element={<AdminModule />}>
              <Route path="users" element={<AdminUsers />} />
              <Route path="clients" element={<AdminClients />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      </ToastProvider>
    </TooltipProvider>
  );
}
