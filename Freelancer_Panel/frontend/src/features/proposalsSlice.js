import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";

export const fetchMyProposals = createAsyncThunk("proposals/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/proposals/me");
    return data.proposals;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || "Failed to fetch proposals");
  }
});

export const submitProposal = createAsyncThunk("proposals/submit", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/proposals", payload);
    return data.proposal;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || "Failed to submit proposal");
  }
});

export const withdrawProposal = createAsyncThunk("proposals/withdraw", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/proposals/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || "Failed to withdraw");
  }
});

export const editProposal = createAsyncThunk("proposals/edit", async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await API.patch(`/proposals/${id}`, payload);
    return data.proposal;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || "Failed to update proposal");
  }
});

const proposalsSlice = createSlice({
  name: "proposals",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProposals.pending, (s) => { s.loading = true; })
      .addCase(fetchMyProposals.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchMyProposals.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(submitProposal.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(withdrawProposal.fulfilled, (s, a) => { s.items = s.items.map((p) => p._id === a.payload ? { ...p, status: "withdrawn" } : p); })
      .addCase(editProposal.fulfilled, (s, a) => { s.items = s.items.map((p) => p._id === a.payload._id ? a.payload : p); });
  }
});

export default proposalsSlice.reducer;
