import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export const fetchStats = createAsyncThunk("admin/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get("/admin/stats");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
  }
});

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get("/admin/users", { params });
    return data.users;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

export const createUser = createAsyncThunk("admin/createUser", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post("/admin/users", payload);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create user");
  }
});

export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put(`/admin/users/${id}`, payload);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update user");
  }
});

export const toggleUserStatus = createAsyncThunk("admin/toggleUserStatus", async (id, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put(`/admin/users/${id}/toggle`);
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to toggle user");
  }
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/admin/users/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete user");
  }
});

export const fetchJobs = createAsyncThunk("admin/fetchJobs", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get("/admin/jobs", { params });
    return data.jobs;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch jobs");
  }
});

export const updateJobStatus = createAsyncThunk(
  "admin/updateJobStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/jobs/${id}/status`, { status });
      return data.job;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update job status");
    }
  }
);

export const deleteJob = createAsyncThunk("admin/deleteJob", async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/admin/jobs/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete job");
  }
});

export const fetchReports = createAsyncThunk("admin/fetchReports", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get("/admin/reports");
    return data.reports;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch reports");
  }
});

export const resolveReport = createAsyncThunk("admin/resolveReport", async (id, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put(`/admin/reports/${id}/resolve`);
    return data.report;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to resolve report");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: { users: 0, jobs: 0, proposals: 0, pendingReports: 0 },
    users: [],
    jobs: [],
    reports: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users = [action.payload, ...state.users];
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) => (user._id === action.payload._id ? action.payload : user));
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.users = state.users.map((user) => (user._id === action.payload._id ? action.payload : user));
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.jobs = state.jobs.map((job) => (job._id === action.payload._id ? action.payload : job));
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload;
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        state.reports = state.reports.map((report) => (report._id === action.payload._id ? action.payload : report));
      })
      .addMatcher(
        (action) => action.type.startsWith("admin/") && action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("admin/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("admin/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  }
});

export default adminSlice.reducer;
