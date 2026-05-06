import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { online: [] },
  reducers: {
    setOnline: (s, a) => { s.online = a.payload; }
  }
});

export const { setOnline } = chatSlice.actions;
export default chatSlice.reducer;
