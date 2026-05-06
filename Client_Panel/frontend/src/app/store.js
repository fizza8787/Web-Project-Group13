import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import jobReducer      from './slices/jobSlice';
import proposalReducer from './slices/proposalSlice';
import currencyReducer from './slices/currencySlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    jobs:     jobReducer,
    proposals: proposalReducer,
    currency: currencyReducer,
  },
});