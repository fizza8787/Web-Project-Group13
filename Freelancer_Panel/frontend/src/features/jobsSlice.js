import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";

export const fetchJobs = createAsyncThunk("jobs/fetch", async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/jobs", { params });
    return data.jobs;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || "Failed to fetch jobs");
  }
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (s) => { s.loading = true; })
      .addCase(fetchJobs.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchJobs.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});

export default jobsSlice.reducer;
