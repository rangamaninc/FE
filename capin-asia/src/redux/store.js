import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

import globalSlice from "./globalSlice";
import authSlice from "../pages/SignIn/authSlice";
import tasksSlice from "../pages/SchedularModule/tasksSlice";
import cashBookSlice from "../pages/WorkingPapers/CashBook/cashBookSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  global: globalSlice,
  schedularModule: tasksSlice,
  cashbook: cashBookSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

export const persistor = persistStore(store);
