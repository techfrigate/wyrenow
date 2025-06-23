import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import packageSlice from './slices/packageSlice';
import countrySlice from './slices/countrySlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    packages: packageSlice,
    countries: countrySlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;