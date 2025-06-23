import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Package } from '../../types';
import { apiClient } from '../../utils/api';

interface PackageState {
  packages: Package[];
  loading: boolean;
  error: string | null;
  currentPackage: Package | null;
}

const initialState: PackageState = {
  packages: [],
  loading: false,
  error: null,
  currentPackage: null,
};

export const fetchPackages = createAsyncThunk(
  'packages/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      const packages = await apiClient.getPackages();
      return packages;
    } catch (error) {
      return rejectWithValue('Failed to fetch packages');
    }
  }
);

export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newPackage = await apiClient.createPackage(packageData);
      return newPackage;
    } catch (error) {
      return rejectWithValue('Failed to create package');
    }
  }
);

export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async ({ id, data }: { id: string; data: Partial<Package> }, { rejectWithValue }) => {
    try {
      const updatedPackage = await apiClient.updatePackage(id, data);
      return updatedPackage;
    } catch (error) {
      return rejectWithValue('Failed to update package');
    }
  }
);

export const deletePackage = createAsyncThunk(
  'packages/deletePackage',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.deletePackage(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete package');
    }
  }
);

const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPackage: (state, action) => {
      state.currentPackage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch packages
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create package
      .addCase(createPackage.fulfilled, (state, action) => {
        state.packages.push(action.payload);
      })
      // Update package
      .addCase(updatePackage.fulfilled, (state, action) => {
        const index = state.packages.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
      })
      // Delete package
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentPackage } = packageSlice.actions;
export default packageSlice.reducer;