import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    accessToken: null,
    userEmail: "",
    userRole: "",
    clients: [],
    mappedUsers: [],
  },
  reducers: {
    userSignIn: (state, { payload }) => {
      state.isAuthenticated = true;
      state.accessToken = payload.accessToken;
      state.userEmail = payload.userEmail;
      state.userRole = payload.userRole;
      state.clients = payload.clients;
      state.mappedUsers = payload.mappedUsers;
    },
    userSignOut: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userEmail = "";
      state.userRole = "";
      state.clients = [];
      state.mappedUsers = [];
    },
  },
});

export const { userSignIn, userSignOut } = authSlice.actions;

export default authSlice.reducer;

export const getAccessToken = (state) => state.auth.accessToken;

export const getUserFirstName = (state) => state.auth.userFirstName;

export const getClients = (state) => state.auth.clients;

export const getMappedUsers = (state) => state.auth.mappedUsers;

export const getUserRole = (state) => state.auth.userRole;
