import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../utils/api";

export const fetchRates = createAsyncThunk("currency/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/currency");
    return data.rates;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || "Failed to fetch rates");
  }
});

const currencySlice = createSlice({
  name: "currency",
  initialState: { rates: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRates.fulfilled, (s, a) => { s.rates = a.payload; });
  }
});

export default currencySlice.reducer;
