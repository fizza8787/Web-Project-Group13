import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

export const fetchRate = createAsyncThunk('currency/fetch', async () => (await api.get('/currency')).data);

const currencySlice = createSlice({
  name: 'currency',
  initialState: { rates: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRate.fulfilled, (s, a) => { s.rates = a.payload.rates; s.loading = false; })
      .addCase(fetchRate.pending,   (s)    => { s.loading = true; });
  },
});

export default currencySlice.reducer;