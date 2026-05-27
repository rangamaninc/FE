import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    selectedClient: {},
    clientGLCodes: [],
    clientGLCodesMap: {},
  },
  reducers: {
    setSelectedClient: (state, { payload }) => {
      state.selectedClient = payload;
    },
    setClientGLCodes: (state, { payload }) => {
      state.clientGLCodes = payload;
    },
    setClientGLCodesMap: (state, { payload }) => {
      state.clientGLCodesMap = payload;
    },
  },
});

export const { setSelectedClient, setClientGLCodes, setClientGLCodesMap } =
  globalSlice.actions;

export default globalSlice.reducer;

export const getSelectedClient = (state) => state.global.selectedClient;

export const getSelectedClientGLCodes = (state) => state.global.clientGLCodes;
export const getSelectedClientGLCodesMap = (state) =>
  state.global.clientGLCodesMap;
