import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "./redux/store";

import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import SchedularModule from "./pages/SchedularModule";
import WorkingPapers from "./pages/WorkingPapers";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

import "./App.css";
import OpeningModule from "./pages/OpeningModule";
import Insurance from "./pages/Insurance";
import AccountingModule from "./pages/AccountingModule";
import AdminModule from "./pages/AdminModule";
import AdminUsers from "./pages/AdminModule/Users";
import AdminClients from "./pages/AdminModule/Clients";

const PrivateRoutes = () => {
  let userData = localStorage.getItem("authToken");
  return userData ? (
    <>
      {" "}
      <NavBar />
      <div style={{ display: "flex" }}>
        <SideBar />
        <div style={{ marginTop: 60, width: "100%", height: "100%" }}>
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/sign-in" />
  );
};

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
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
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
