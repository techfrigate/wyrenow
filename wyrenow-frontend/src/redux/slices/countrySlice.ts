 
 import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface Country {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    regions?: Region[];
}
 
export interface Region {
    id: number;
    name: string;
    code: string | null;
    type: string;
    country_id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CountriesState {
    countries: Country[];
    regions: Record<number, Region[]>;
    selectedCountry: Country | null;
    selectedRegion: Region | null;
    loading: {
        countries: boolean;
        regions: boolean;
        country: boolean;
    };
    error: {
        countries: string | null;
        regions: string | null;
        country: string | null;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const BaseUrl =  import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

// Async thunk for fetching all countries with regions
export const fetchCountries = createAsyncThunk<
    Country[],
    void,
    { rejectValue: string }
>(
    'countries/fetchCountries',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BaseUrl}/countries/active-counties`);
          
            if (!response) {
                return rejectWithValue('Failed to fetch countries');
            }

            return response.data.data;
        } catch (error) {
            return rejectWithValue('Network error occurred');
        }
    }
);

// Async thunk for fetching regions by country ID
export const fetchRegionsByCountry = createAsyncThunk<
    { countryId: number; regions: Region[] },
    number,
    { rejectValue: string }
>(
    'countries/fetchRegionsByCountry',
    async (countryId, { rejectWithValue }) => {
     
        try {
            const response = await axios.get(`${BaseUrl}/countries/${countryId}/regions?status=active`);
            return {countryId, regions: response.data.data};
        } catch (error) {
          
            return rejectWithValue('Network error occurred');
        }
    }
);

// Async thunk for fetching country by ID
export const fetchCountryById = createAsyncThunk<
    Country | null,
    number,
    { rejectValue: string }
>(
    'countries/fetchCountryById',
    async (countryId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BaseUrl}/countries/${countryId}`);
            return response.data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch country');
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

const initialState: CountriesState = {
    countries: [],
    regions: [],
    selectedCountry: null,
    selectedRegion: null,
    loading: {
        countries: false,
        regions: false,
        country: false
    },
    error: {
        countries: null,
        regions: null,
        country: null
    }
};

const countriesSlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {
        
        clearCountryErrors: (state) => {
            state.error.countries = null;
            state.error.regions = null;
        },
        
        resetCountriesState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Fetch Countries
            .addCase(fetchCountries.pending, (state) => {
                state.loading.countries = true;
                state.error.countries = null;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loading.countries = false;
                state.countries = action.payload;
                state.error.countries = null;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loading.countries = false;
                state.error.countries = action.payload || 'Unknown error';
            })
            
            // Fetch Regions by Country
            .addCase(fetchRegionsByCountry.pending, (state) => {
                state.loading.regions = true;
                state.error.regions = null;
            })
            .addCase(fetchRegionsByCountry.fulfilled, (state, action) => {
                state.loading.regions = false;
                const { countryId, regions } = action.payload;
                 state.selectedCountry= state.countries.find(country => country.id === countryId) || null;
                 state.regions = regions;
                 state.error.regions = null;
            })
            .addCase(fetchRegionsByCountry.rejected, (state, action) => {
                state.loading.regions = false;
                state.error.regions = action.payload || 'Unknown error';
            })
            
            // Fetch Country by ID
            .addCase(fetchCountryById.pending, (state) => {
                state.loading.country = true;
                state.error.country = null;
            })
            .addCase(fetchCountryById.fulfilled, (state, action) => {
                state.loading.country = false;
                state.selectedCountry = action.payload;
                state.error.country = null;
            })
            .addCase(fetchCountryById.rejected, (state, action) => {
                state.loading.country = false;
                state.error.country = action.payload || 'Unknown error';
            });
    }
});

// Export actions
export const {
    clearCountryErrors,
    resetCountriesState
} = countriesSlice.actions;

// Selectors
export const selectCountriesState = (state: { countries: CountriesState }) => state.countries;

export default countriesSlice.reducer;