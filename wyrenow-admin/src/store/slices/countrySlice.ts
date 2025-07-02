import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Country } from '../../types';
import { apiClient } from '../../utils/api';

interface CountryState {
  countries: Country[];
  loading: boolean;
  error: string | null;
  currentCountry: Country | null;
}

const initialState: CountryState = {
  countries: [],
  loading: false,
  error: null,
  currentCountry: null,
};

// Use proper API call for fetching countries
export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching countries...');
      const countries = await apiClient.getCountries();
      console.log('Redux: Successfully fetched countries:', countries.length);
      return countries;
    } catch (error) {
      console.error('Redux: Error fetching countries:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch countries';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch single country
export const fetchCountry = createAsyncThunk(
  'countries/fetchCountry',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Redux: Fetching country with ID:', id);
      const country = await apiClient.getCountry(id);
      if (!country) {
        return rejectWithValue('Country not found');
      }
      console.log('Redux: Successfully fetched country:', country.name);
      return country;
    } catch (error) {
      console.error('Redux: Error fetching country:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch country';
      return rejectWithValue(errorMessage);
    }
  }
);

// Keep createCountry exactly the same
export const createCountry = createAsyncThunk(
  'countries/createCountry',
  async (countryData: any, { rejectWithValue }) => {
    try {
      const newCountry = await apiClient.createCountry(countryData);
      return newCountry;
    } catch (error) {
      console.error('Redux: Error creating country:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create country';
      return rejectWithValue(errorMessage);
    }
  }
);

// Use proper API call for updating country
export const updateCountry = createAsyncThunk(
  'countries/updateCountry',
  async ({ id, data }: { id: string; data: Partial<Country> }, { rejectWithValue }) => {
    try {
      console.log('Redux: Updating country:', id, data);
      const updatedCountry = await apiClient.updateCountry(id, data);
      console.log('Redux: Successfully updated country:', updatedCountry.name);
      return updatedCountry;
    } catch (error) {
      console.error('Redux: Error updating country:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update country';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCountry = createAsyncThunk(
  'countries/deleteCountry',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Redux: Deleting country:', id);
      await apiClient.deleteCountry(id);
      console.log('Redux: Successfully deleted country');
      return id;
    } catch (error) {
      console.error('Redux: Error deleting country:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete country';
      return rejectWithValue(errorMessage);
    }
  }
);

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCountry: (state, action) => {
      state.currentCountry = action.payload;
    },
    clearCurrentCountry: (state) => {
      state.currentCountry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single country
      .addCase(fetchCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCountry = action.payload;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentCountry = null;
      })
      // Create country
      .addCase(createCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.countries.push(action.payload);
      })
      .addCase(createCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update country
      .addCase(updateCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.countries.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.countries[index] = action.payload;
        }
        // Update current country if it's the one being updated
        if (state.currentCountry && state.currentCountry.id === action.payload.id) {
          state.currentCountry = action.payload;
        }
      })
      .addCase(updateCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete country
      .addCase(deleteCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = state.countries.filter(c => c.id !== action.payload);
        // Clear current country if it's the one being deleted
        if (state.currentCountry && state.currentCountry.id === action.payload) {
          state.currentCountry = null;
        }
      })
      .addCase(deleteCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentCountry, clearCurrentCountry } = countrySlice.actions;
export default countrySlice.reducer;