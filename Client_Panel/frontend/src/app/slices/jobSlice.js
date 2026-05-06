import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

export const fetchJobs    = createAsyncThunk('jobs/fetchAll',  async (params) => (await api.get('/jobs', { params })).data);
export const fetchMyJobs  = createAsyncThunk('jobs/fetchMine', async () => (await api.get('/jobs/my')).data);
export const createJob    = createAsyncThunk('jobs/create',    async (data) => (await api.post('/jobs', data)).data);
export const updateJob    = createAsyncThunk('jobs/update',    async ({ id, data }) => (await api.put(`/jobs/${id}`, data)).data);
export const deleteJob    = createAsyncThunk('jobs/delete',    async (id) => { await api.delete(`/jobs/${id}`); return id; });

const jobSlice = createSlice({
  name: 'jobs',
  initialState: { jobs: [], myJobs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled,   (s, a) => { s.jobs   = a.payload.jobs; s.loading = false; })
      .addCase(fetchMyJobs.fulfilled, (s, a) => { s.myJobs = a.payload.jobs; s.loading = false; })
      .addCase(createJob.fulfilled,   (s, a) => { s.myJobs.unshift(a.payload.job); })
      .addCase(updateJob.fulfilled,   (s, a) => {
        s.myJobs = s.myJobs.map(j => j._id === a.payload.job._id ? a.payload.job : j);
      })
      .addCase(deleteJob.fulfilled,   (s, a) => {
        s.myJobs = s.myJobs.filter(j => j._id !== a.payload);
      })
      .addMatcher(a => a.type.endsWith('/pending'),  (s) => { s.loading = true; })
      .addMatcher(a => a.type.endsWith('/rejected'), (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default jobSlice.reducer;