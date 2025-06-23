import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Admin } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
  token: localStorage.getItem('admin_token'),
  loading: false,
  error: null,
};

// Check if user is already authenticated on app start
if (initialState.token) {
  const adminData = localStorage.getItem('admin_user');
  if (adminData) {
    initialState.isAuthenticated = true;
    initialState.admin = JSON.parse(adminData);
  }
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@wyrenow.com' && password === 'admin123') {
        const admin: Admin = {
          id: '1',
          email: 'admin@wyrenow.com',
          name: 'System Administrator',
          role: 'super_admin',
          createdAt: new Date(),
          lastLoginAt: new Date()
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(admin));
        
        return { admin, token };
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      return rejectWithValue('Invalid email or password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;