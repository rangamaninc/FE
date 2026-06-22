import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as UiThemeProvider } from "./ThemeProvider";
import { muiTheme } from "../theme/muiTheme";
import { persistor, store } from "../redux/store";

/** AppProviders — Redux, MUI theme (module pages), and UI theme (TailAdmin shell). */
export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MuiThemeProvider theme={muiTheme}>
          <UiThemeProvider defaultTheme="system">{children}</UiThemeProvider>
        </MuiThemeProvider>
      </PersistGate>
    </Provider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node,
};
