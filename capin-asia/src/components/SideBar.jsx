import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// TODO: will add these in phase 2
// import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
// import AssessmentIcon from "@mui/icons-material/Assessment";
import BatterySaverIcon from "@mui/icons-material/BatterySaver";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserRole } from "../pages/SignIn/authSlice";

const drawerWidth = 240;

const pagesList = [
  {
    name: "Schedular Module",
    icon: <ScheduleIcon />,
    path: "/schedular-module",
  },
  {
    name: "Working Papers",
    icon: <ReceiptIcon />,
    path: "/working-papers",
  },
  {
    name: "Opening Module",
    icon: <FolderOpenIcon />,
    path: "/opening-module",
  },
  {
    name: "Insurance",
    icon: <BatterySaverIcon />,
    path: "/insurance",
  },
  {
    name: "Accounting Module",
    icon: <AccountBalanceIcon />,
    path: "/accounting-module",
  },
  // {
  //   name: "Timesheet",
  //   icon: <AccessTimeFilledIcon />,
  // },
  // {
  //   name: "Reports",
  //   icon: <AssessmentIcon />,
  // },
];

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector(getUserRole);
  const canAccessAdminModule = new Set(["admin", "manager"]).has(
    userRole?.toLowerCase()
  );

  const handleNavigation = (path) => {
    navigate(path);
  };

  const filteredPages = canAccessAdminModule
    ? [
        ...pagesList,
        {
          name: "Admin Module",
          icon: <AdminPanelSettingsIcon />,
          path: "/admin-module",
        },
      ]
    : pagesList;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {filteredPages.map((page) => {
              const isActiveTab = location.pathname.includes(page.path);
              return (
                <ListItem
                  key={page.name}
                  disablePadding
                  onClick={() => handleNavigation(page.path)}
                >
                  <ListItemButton
                    style={{ background: isActiveTab ? "#e9ecef" : "white" }}
                  >
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText primary={page.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
