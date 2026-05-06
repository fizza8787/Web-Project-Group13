import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

const token = localStorage.getItem("adminToken");
const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

export const loginAdmin = createAsyncThunk("auth/loginAdmin", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post("/auth/admin/login", payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    user: adminUser || null,
    isLoading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("adminToken", action.payload.token);
        localStorage.setItem("adminUser", JSON.stringify(action.payload.user));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
