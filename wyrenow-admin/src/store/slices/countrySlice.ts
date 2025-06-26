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

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const countries = await apiClient.getCountries();
      return countries;
    } catch (error) {
      return rejectWithValue('Failed to fetch countries');
    }
  }
);

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


export const updateCountry = createAsyncThunk(
  'countries/updateCountry',
  async ({ id, data }: { id: string; data: Partial<Country> }, { rejectWithValue }) => {
    try {
      const updatedCountry = await apiClient.updateCountry(id, data);
      return updatedCountry;
    } catch (error) {
      return rejectWithValue('Failed to update country');
    }
  }
);

export const deleteCountry = createAsyncThunk(
  'countries/deleteCountry',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.deleteCountry(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete country');
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
      // Create country
      .addCase(createCountry.fulfilled, (state, action) => {
        state.countries.push(action.payload);
      })
      // Update country
      .addCase(updateCountry.fulfilled, (state, action) => {
        const index = state.countries.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.countries[index] = action.payload;
        }
      })
      // Delete country
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.countries = state.countries.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentCountry } = countrySlice.actions;
export default countrySlice.reducer;