import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserRole } from "../SignIn/authSlice";
import { Alert, AlertDescription } from "../../components/ui";

const allowedRoles = new Set(["admin", "manager"]);

export default function AdminModule() {
  const userRole = useSelector(getUserRole);
  const isAllowed = allowedRoles.has(userRole?.toLowerCase());
  const location = useLocation();

  if (!isAllowed) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            You are not authorized to view Admin Module.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (location.pathname === "/admin-module") {
    return <Navigate to="/admin-module/users" replace />;
  }

  return <Outlet />;
}
