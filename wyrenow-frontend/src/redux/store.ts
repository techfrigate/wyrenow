import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice"; 
import countryReducer from "./slices/countrySlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    countries:countryReducer
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

