import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: Cookies.get('token') ||  null,
  loading: false,
  error: null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' ? true: false || false,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null,
};

const BASE_URL = import.meta.env.VITE_APP_API_URL;


export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(
        `${BASE_URL}/registration/login`,
        credentials
      );
      Cookies.set('token', response.data.token, { expires: 7 });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error : any) {
      return rejectWithValue( error.response?.data?.message || 'An unexpected error occurred');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
        state.isAuthenticated = false
    });
  },
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
