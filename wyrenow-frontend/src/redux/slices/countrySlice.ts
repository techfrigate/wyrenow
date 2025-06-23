 
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
    };
    error: {
        countries: string | null;
        regions: string | null;
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
             const response = await axios.get(`${BaseUrl}/countries`);
        console.log(response,"response of country");
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
            const response = await fetch(`/api/countries/${countryId}/regions`);
            const result: ApiResponse<Region[]> = await response.json();
            
            if (!response.ok) {
                return rejectWithValue(result.message || 'Failed to fetch regions');
            }
            
            return { countryId, regions: result.data };
        } catch (error) {
            return rejectWithValue('Network error occurred');
        }
    }
);

const initialState: CountriesState = {
    countries: [],
    regions: {},
    selectedCountry: null,
    selectedRegion: null,
    loading: {
        countries: false,
        regions: false
    },
    error: {
        countries: null,
        regions: null
    }
};

const countriesSlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {
        setSelectedCountry: (state, action: PayloadAction<Country | null>) => {
            state.selectedCountry = action.payload;
            state.selectedRegion = null; // Reset region when country changes
        },
        
        setSelectedRegion: (state, action: PayloadAction<Region | null>) => {
            state.selectedRegion = action.payload;
        },
        
        clearSelectedCountry: (state) => {
            state.selectedCountry = null;
            state.selectedRegion = null;
        },
        
        clearErrors: (state) => {
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
                state.regions[countryId] = regions;
                state.error.regions = null;
            })
            .addCase(fetchRegionsByCountry.rejected, (state, action) => {
                state.loading.regions = false;
                state.error.regions = action.payload || 'Unknown error';
            });
    }
});

// Export actions
export const {
    setSelectedCountry,
    setSelectedRegion,
    clearSelectedCountry,
    clearErrors,
    resetCountriesState
} = countriesSlice.actions;

// Selectors
export const selectCountriesState = (state: { countries: CountriesState }) => state.countries;
export const selectRegions = (state: { countries: CountriesState }) => state.countries.regions;
export const selectSelectedCountry = (state: { countries: CountriesState }) => state.countries.selectedCountry;
export const selectSelectedRegion = (state: { countries: CountriesState }) => state.countries.selectedRegion;
export const selectCountriesLoading = (state: { countries: CountriesState }) => state.countries.loading.countries;
export const selectRegionsLoading = (state: { countries: CountriesState }) => state.countries.loading.regions;
export const selectCountriesError = (state: { countries: CountriesState }) => state.countries.error.countries;
export const selectRegionsError = (state: { countries: CountriesState }) => state.countries.error.regions;

// Derived selectors
export const selectRegionsBySelectedCountry = (state: { countries: CountriesState }) => {
    const selectedCountry = selectSelectedCountry(state);
    const regions = selectRegions(state);
    return selectedCountry ? regions[selectedCountry.id] || [] : [];
};

export const selectCountryById = (state: { countries: CountriesState }, countryId: number) => {
    const {countries} = selectCountriesState(state);
    return countries.find(country => country.id === countryId);
};

export const selectRegionById = (state: { countries: CountriesState }, countryId: number, regionId: number) => {
    const regions = selectRegions(state);
    const countryRegions = regions[countryId] || [];
    return countryRegions.find(region => region.id === regionId);
};

export default countriesSlice.reducer;