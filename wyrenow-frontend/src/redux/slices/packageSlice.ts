import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Package {
  id: number;
  name: string;
  description: string;
  pv: number;
  price: number;
  bottles: number;
  package_type: string;
  status: 'active' | 'inactive';
  currency: string;
  currency_symbol: string;
  country_name: string;
  country_code: string;
  product_pv_rate: number;
  created_at: string;
}

interface PackageState {
  packages: Package[];
  loading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  packages: [],
  loading: false,
  error: null,
};
const BASE_URL = import.meta.env.VITE_APP_API_URL;
export const fetchPackages = createAsyncThunk<Package[],  number, { rejectValue: string }>(
  'package/fetchPackages',
  async (countryId, { rejectWithValue }) => {
    try {
      const response = await axios.get<Package[]>(`${BASE_URL}/package/packages/country/${countryId}`);
      console.log(response.data,"packages");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An unexpected error occurred');
    }
  }
);

export const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPackages.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPackages.fulfilled, (state, action) => {
      state.packages = action.payload.packages;
      state.loading = false;
    });
    builder.addCase(fetchPackages.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

 

export default packageSlice.reducer;
