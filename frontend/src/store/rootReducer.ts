// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loanReducer from './slices/loanSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  loan: loanReducer,
  // Easy to add more:
  // notification: notificationReducer,
  // settings: settingsReducer,
});

export default rootReducer;