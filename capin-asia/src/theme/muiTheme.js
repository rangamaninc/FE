import { createTheme } from "@mui/material/styles";

/** MUI theme for legacy module pages (grids, pickers, modals). */
export const muiTheme = createTheme({
  palette: {
    primary: { main: "#3B82F6" },
    secondary: { main: "#8B5CF6" },
  },
  shape: {
    borderRadius: 10,
  },
});
