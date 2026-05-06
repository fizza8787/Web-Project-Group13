import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/authSlice";
import jobs from "../features/jobsSlice";
import proposals from "../features/proposalsSlice";
import dashboard from "../features/dashboardSlice";
import currency from "../features/currencySlice";
import chat from "../features/chatSlice";

export const store = configureStore({
  reducer: { auth, jobs, proposals, dashboard, currency, chat }
});
