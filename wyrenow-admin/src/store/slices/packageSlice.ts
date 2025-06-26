import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Package } from '../../types';

interface PackageState {
  packages: Package[];
  loading: boolean;
  error: string | null;
  currentPackage: Package | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const initialState: PackageState = {
  packages: [],
  loading: false,
  error: null,
  currentPackage: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000/api';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Fetch all packages with optional filters
export const fetchPackages = createAsyncThunk(
  'packages/fetchPackages',
  async (filters: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    minPv?: number;
    maxPv?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `/getpackages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiCall(endpoint);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch packages');
    }
  }
);

// Fetch active packages only
export const fetchActivePackages = createAsyncThunk(
  'packages/fetchActivePackages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('/packages/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch active packages');
    }
  }
);

// Fetch package by ID
export const fetchPackageById = createAsyncThunk(
  'packages/fetchPackageById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiCall(`/packages/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch package');
    }
  }
);

// Create new package
export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (packageData: {
    name: string;
    description?: string;
    pv: number;
    priceNGN: number;
    priceGHS: number;
    bottles: number;
    type: string;
    status: string;
    features: string[];
  }, { rejectWithValue }) => {
    try {
      // Transform frontend data to backend format
      const backendData = {
        name: packageData.name,
        description: packageData.description,
        pv: packageData.pv,
        price_ngn: packageData.priceNGN,
        price_ghs: packageData.priceGHS,
        bottles: packageData.bottles,
        package_type: packageData.type,
        status: packageData.status,
        features: packageData.features,
      };

      const response = await apiCall('/packages', {
        method: 'POST',
        body: JSON.stringify(backendData),
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create package');
    }
  }
);

// Update package
export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async ({ id, data }: { 
    id: string; 
    data: {
      name?: string;
      description?: string;
      pv?: number;
      priceNGN?: number;
      priceGHS?: number;
      bottles?: number;
      type?: string;
      status?: string;
      features?: string[];
    }
  }, { rejectWithValue }) => {
    try {
      // Transform frontend data to backend format
      const backendData: any = {};
      
      if (data.name !== undefined) backendData.name = data.name;
      if (data.description !== undefined) backendData.description = data.description;
      if (data.pv !== undefined) backendData.pv = data.pv;
      if (data.priceNGN !== undefined) backendData.price_ngn = data.priceNGN;
      if (data.priceGHS !== undefined) backendData.price_ghs = data.priceGHS;
      if (data.bottles !== undefined) backendData.bottles = data.bottles;
      if (data.type !== undefined) backendData.package_type = data.type;
      if (data.status !== undefined) backendData.status = data.status;
      if (data.features !== undefined) backendData.features = data.features;

      const response = await apiCall(`/packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(backendData),
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update package');
    }
  }
);

// Delete package
export const deletePackage = createAsyncThunk(
  'packages/deletePackage',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiCall(`/packages/${id}`, {
        method: 'DELETE',
      });
      
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete package');
    }
  }
);

// Toggle package status
export const togglePackageStatus = createAsyncThunk(
  'packages/togglePackageStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiCall(`/packages/${id}/status`, {
        method: 'PATCH',
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle package status');
    }
  }
);

// Bulk update package status
export const bulkUpdatePackageStatus = createAsyncThunk(
  'packages/bulkUpdatePackageStatus',
  async ({ ids, status }: { ids: string[]; status: 'active' | 'inactive' }, { rejectWithValue }) => {
    try {
      const response = await apiCall('/packages/bulk-status', {
        method: 'POST',
        body: JSON.stringify({ ids, status }),
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to bulk update package status');
    }
  }
);

// Calculate package prices
export const calculatePackagePrices = createAsyncThunk(
  'packages/calculatePackagePrices',
  async ({ pv, pvRates }: { pv: number; pvRates: { NGN: number; GHS: number } }, { rejectWithValue }) => {
    try {
      const response = await apiCall('/packages/calculate-prices', {
        method: 'POST',
        body: JSON.stringify({ pv, pvRates }),
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to calculate prices');
    }
  }
);

// Transform backend package data to frontend format
const transformPackageData = (backendPackage: any): Package => {
  return {
    id: backendPackage.id,
    name: backendPackage.name,
    description: backendPackage.description || '',
    pv: backendPackage.pv,
    priceNGN: backendPackage.price_ngn,
    priceGHS: backendPackage.price_ghs,
    bottles: backendPackage.bottles,
    type: backendPackage.package_type,
    status: backendPackage.status,
    features: backendPackage.features || [],
    createdAt: backendPackage.created_at,
    updatedAt: backendPackage.updated_at,
  };
};

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
    clearCurrentPackage: (state) => {
      state.currentPackage = null;
    },
    resetPackages: (state) => {
      state.packages = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
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
        const { packages, totalCount, currentPage, totalPages } = action.payload;
        state.packages = packages ? packages.map(transformPackageData) : [];
        state.totalCount = totalCount || 0;
        state.currentPage = currentPage || 1;
        state.totalPages = totalPages || 1;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch active packages
      .addCase(fetchActivePackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = Array.isArray(action.payload) 
          ? action.payload.map(transformPackageData) 
          : [];
      })
      .addCase(fetchActivePackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch package by ID
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPackage = transformPackageData(action.payload);
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create package
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false;
        const newPackage = transformPackageData(action.payload);
        state.packages.push(newPackage);
        state.totalCount += 1;
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update package
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPackage = transformPackageData(action.payload);
        const index = state.packages.findIndex(p => p.id === updatedPackage.id);
        if (index !== -1) {
          state.packages[index] = updatedPackage;
        }
        if (state.currentPackage && state.currentPackage.id === updatedPackage.id) {
          state.currentPackage = updatedPackage;
        }
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete package
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter(p => p.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        if (state.currentPackage && state.currentPackage.id === action.payload) {
          state.currentPackage = null;
        }
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle package status
      .addCase(togglePackageStatus.fulfilled, (state, action) => {
        const updatedPackage = transformPackageData(action.payload);
        const index = state.packages.findIndex(p => p.id === updatedPackage.id);
        if (index !== -1) {
          state.packages[index] = updatedPackage;
        }
        if (state.currentPackage && state.currentPackage.id === updatedPackage.id) {
          state.currentPackage = updatedPackage;
        }
      })
      .addCase(togglePackageStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Bulk update package status
      .addCase(bulkUpdatePackageStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdatePackageStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPackages = action.payload.map(transformPackageData);
        updatedPackages.forEach(updatedPackage => {
          const index = state.packages.findIndex(p => p.id === updatedPackage.id);
          if (index !== -1) {
            state.packages[index] = updatedPackage;
          }
        });
      })
      .addCase(bulkUpdatePackageStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Calculate package prices
      .addCase(calculatePackagePrices.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setCurrentPackage, 
  clearCurrentPackage, 
  resetPackages 
} = packageSlice.actions;

export default packageSlice.reducer;