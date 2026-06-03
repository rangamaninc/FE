import { useSelector } from "react-redux";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { getUserRole } from "../SignIn/authSlice";

const allowedRoles = new Set(["admin", "manager"]);

export default function AdminModule() {
  const userRole = useSelector(getUserRole);
  const isAdmin = userRole?.toLowerCase() === "admin";
  const isAllowed = allowedRoles.has(userRole?.toLowerCase());

  if (!isAllowed) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">You are not authorized to view Admin Module.</Typography>
      </Box>
    );
  }

  const location = useLocation();
  if (location.pathname === "/admin-module") {
    return <Navigate to="/admin-module/users" replace />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Admin Module
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {isAdmin
          ? "Admin can view and manage data."
          : "Manager has view-only access in this module."}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          component={NavLink}
          to="/admin-module/users"
          variant={location.pathname.includes("/admin-module/users") ? "contained" : "outlined"}
        >
          Users
        </Button>
        <Button
          component={NavLink}
          to="/admin-module/clients"
          variant={location.pathname.includes("/admin-module/clients") ? "contained" : "outlined"}
        >
          Clients
        </Button>
      </Stack>

      <Outlet />
    </Box>
  );
}
