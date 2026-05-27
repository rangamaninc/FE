import { createSlice } from "@reduxjs/toolkit";

export const cashBookSlice = createSlice({
  name: "cashbook",
  initialState: {
    monthlyBalanceData: [],
  },
  reducers: {
    setMonthlyBalance: (state, { payload }) => {
      state.list.monthlyBalanceData = payload;
    },
  },
});

export const { setMonthlyBalance } = cashBookSlice.actions;

export default cashBookSlice.reducer;
