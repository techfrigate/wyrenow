import { configureStore } from "@reduxjs/toolkit";
  
import countryReducer from "./slices/countrySlice";
import registrationReducer from "./slices/ragistrationSlice";
import binaryTreeReducer from './slices/binaryTreeSlice';
import authReducer from './slices/authSlice';
export const store = configureStore({
  reducer: {
    countries:countryReducer,
    registration:registrationReducer,
    binaryTree: binaryTreeReducer,
    auth:authReducer
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

