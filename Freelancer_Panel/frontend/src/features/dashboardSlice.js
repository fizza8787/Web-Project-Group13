import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";

export const fetchDashboard = createAsyncThunk("dashboard/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/dashboard/freelancer");
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || "Failed to fetch dashboard");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { stats: null, recent: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (s) => { s.loading = true; })
      .addCase(fetchDashboard.fulfilled, (s, a) => {
        s.loading = false;
        s.stats = a.payload.stats;
        s.recent = a.payload.recent;
      })
      .addCase(fetchDashboard.rejected, (s) => { s.loading = false; });
  }
});

export default dashboardSlice.reducer;
