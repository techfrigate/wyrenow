// src/features/registration/registrationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust the import path as necessary
import axios from 'axios';

// Define types
interface SponsorData {
  user_id: number;
  username: string;
  full_name: string;
  left_leg_status: 'available' | 'filled';
  right_leg_status: 'available' | 'filled';
}

interface UserWithPosition {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  available_position: 'left' | 'right' | null; // null if no position available
}

interface TreeNode {
  id: number;
  username: string;
  full_name: string;
  position?: 'left' | 'right';
  children: TreeNode[];
}

interface PlacementData {
  newUserId: number;
  newUsername: string;
  sponsorId: number;
  placementLeg: 'left' | 'right';
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface UserData {
  email: string;
  country: string;
  registration_data: string; 
}

interface RegistrationState {
    newUserData:any;
  sponsor: SponsorData | null;
  availablePositions: UserWithPosition | null;
  treeStructure: TreeNode | null;
  loading: {
    findAvailable: boolean;
    placeUser: boolean;
    getTreeStructure: boolean;
    newUser:boolean
  };
  regitrastionLoading: boolean;
  error: {
    findAvailable: string | null;
    placeUser: string | null;
    getTreeStructure: string | null;
    newUser:string | null
  };
  success: boolean;
  message: string;
  placementSuccess?: boolean;
  selectedPlacement?: {
    sponsorId: number;
    sponsorUsername: string;
    placementLeg: 'left' | 'right';
  } | null;
}

// API base URL
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
 
 
interface FindAvailablePositionsArgs {
  userId: number | undefined;
  leg: 'left' | 'right';
}

export const findAvailablePositions = createAsyncThunk<
  ApiResponse<UserWithPosition[]>,
  FindAvailablePositionsArgs,
  { rejectValue: string }
>('registration/findAvailable', async ({ userId, leg }, { rejectWithValue }) => {
  try {
    const response = await axios.get<ApiResponse<UserWithPosition[]>>(`${API_URL}/registration/available/${userId}/${leg}`);

    return response.data;
  } catch (error:any) {
    return rejectWithValue(error.response?.data?.message || 'An unexpected error occurred');
  }
});

export const placeUserInBinaryTree = createAsyncThunk<
  ApiResponse<null>,
  PlacementData,
  { rejectValue: string }
>('registration/placeUser', async (placementData, { rejectWithValue }) => {
  try {
    const response = await axios.post<ApiResponse<null>>(`${API_URL}/registration/place`, placementData);
    return response.data;
  } catch (error) {
    
    return rejectWithValue(error?.response?.data?.message || 'An unexpected error occurred');
  }
});

export const getBinaryTreeStructure = createAsyncThunk<
  ApiResponse<TreeNode>,
  { userId: number; depth?: number },
  { rejectValue: string }
>('registration/getTreeStructure', async ({ userId, depth = 3 }, { rejectWithValue }) => {
  try {
    const response = await axios.get<ApiResponse<TreeNode>>(`${API_URL}/tree/${userId}`, {
      params: { depth }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get binary tree structure');
    }
    return rejectWithValue('An unexpected error occurred');
  }
});


export const getNewUserData = createAsyncThunk<
  ApiResponse<UserData>,
  string,   
  { rejectValue: string }
>('registration/getNewUserData', async (userName, { rejectWithValue }) => {
    try {
        const response = await axios.post<ApiResponse<UserData>>(
            `${API_URL}/username`, {
                username: userName
            }
        );
     
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get new user data');
        }
        return rejectWithValue('An unexpected error occurred');
    }
})



// Initial state
const initialState: RegistrationState = {
  newUserData:[],
  availablePositions: {},
  treeStructure: null,
  loading: {
    findAvailable: false,
    placeUser: false,
    getTreeStructure: false,
    newUser:false
  },
  error: {
    findAvailable: null,
    placeUser: null,
    getTreeStructure: null,
    newUser:null
  },
   
  success: false,
  message: '',

};

// Create the slice
const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Reset state
    resetBinaryPlacement: (state) => {
      state.error.getTreeStructure = null;  
      state.success = false;
      state.message = '';
      state.placementSuccess = false;
    },
 
    // Clear available positions
    clearAvailablePositions: (state) => {
      state.availablePositions = {};
    },
    
    // Clear tree structure
    clearTreeStructure: (state) => {
      state.treeStructure = null;
    }
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(findAvailablePositions.pending, (state) => {
        state.loading.findAvailable = true;
        state.error.findAvailable = null;
      })
      .addCase(findAvailablePositions.fulfilled, (state, action) => {
        state.loading.findAvailable = false;
        state.success = action.payload.success;
        
        if (action.payload.success && action.payload.data) {
          state.availablePositions = action.payload.data;
        } else {
          state.availablePositions = {};
          state.message = action.payload.message || '';
        }
      })
      .addCase(findAvailablePositions.rejected, (state, action) => {
        state.loading.findAvailable = false;
        state.error.findAvailable = action.payload || 'Failed to find available positions';
        state.availablePositions = [];
      })
      
      // Place user in binary tree
      .addCase(placeUserInBinaryTree.pending, (state) => {
        state.loading.placeUser = true;
        state.error.placeUser= null;
        state.placementSuccess = false;
      })
      .addCase(placeUserInBinaryTree.fulfilled, (state, action) => {
        state.loading.placeUser = false;
        state.success = action.payload.success;
        state.message = action.payload.message || '';
        state.placementSuccess = action.payload.success;
      })
      .addCase(placeUserInBinaryTree.rejected, (state, action) => {
        state.loading.placeUser = false;
        state.error.placeUser = action.payload || 'Failed to place user in binary tree';
        state.placementSuccess = false;
      })
      
      // Get binary tree structure
      .addCase(getBinaryTreeStructure.pending, (state) => {
        state.loading.getTreeStructure= true;
        state.error.getTreeStructure = null;
      })
      .addCase(getBinaryTreeStructure.fulfilled, (state, action) => {
        state.loading.getTreeStructure = false;
        state.success = action.payload.success;
        
        if (action.payload.success && action.payload.data) {
          state.treeStructure = action.payload.data;
        } else {
          state.treeStructure = null;
          state.message = action.payload.message || '';
        }
      })
      .addCase(getBinaryTreeStructure.rejected, (state, action) => {
        state.loading.getTreeStructure = false;
        state.error.getTreeStructure = action.payload || 'Failed to get binary tree structure';
        state.treeStructure = null;
      })
      .addCase(getNewUserData.pending, (state) => {
        state.loading.newUser = true;
        state.error.newUser = null;
      })
      .addCase(getNewUserData.fulfilled, (state, action) => {        
        state.loading.newUser = false;
        state.success = action.payload.success;
        
        if (action.payload.success && action.payload.data) {
  
          state.newUserData = JSON.parse(action.payload.data.registration_data);
        } else {
          state.newUserData = null;
          state.message = action.payload.message || '';
        }
      })
      .addCase(getNewUserData.rejected, (state, action) => {
        state.loading.newUser = false;
        state.error.newUser = action.payload || 'Failed to get new user data';
        state.newUserData = null;
      })
  }
});

// Export actions
export const { 
  resetBinaryPlacement, 
  clearAvailablePositions,
  clearTreeStructure 
} = registrationSlice.actions;

// Export selectors
export const selectRegistration = (state: RootState) => state.registration;
 
 
// Export reducer
export default registrationSlice.reducer;