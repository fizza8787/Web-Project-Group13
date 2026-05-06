import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

export const fetchProposals      = createAsyncThunk('proposals/fetch',  async (jobId) => (await api.get(`/proposals/${jobId}`)).data);
export const updateProposalStatus = createAsyncThunk('proposals/status', async ({ id, status }) => (await api.put(`/proposals/${id}/status`, { status })).data);

const proposalSlice = createSlice({
  name: 'proposals',
  initialState: { proposals: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposals.fulfilled,       (s, a) => { s.proposals = a.payload.proposals; s.loading = false; })
      .addCase(updateProposalStatus.fulfilled, (s, a) => {
        s.proposals = s.proposals.map(p => p._id === a.payload.proposal._id ? a.payload.proposal : p);
      })
      .addMatcher(a => a.type.endsWith('/pending'), (s) => { s.loading = true; });
  },
});

export default proposalSlice.reducer;