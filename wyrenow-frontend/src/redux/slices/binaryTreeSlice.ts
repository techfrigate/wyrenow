 
// store/slices/binaryTreeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TreeNode } from '../../types';
import { 
  BinaryTreeApiResponse, 
  BackendTreeNode, 
  BackendStats, 
  BinaryTreeState, 
  BinaryTreeStats 
} from '../../types/index';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_API_URL;
// API call
export const fetchBinaryTree = createAsyncThunk<
  BinaryTreeApiResponse,
  number,
  { rejectValue: string }
>(
  'binaryTree/fetchBinaryTree',
  async (userId: number, { rejectWithValue }) => {
    try {
 
      const response = await axios.get(`${BASE_URL}/tree/binary-tree/${userId}`);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to fetch binary tree');
      }
      
      return response.data as BinaryTreeApiResponse;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'An unexpected error occurred');
    }
  }
);

// Transform backend data to frontend format
const transformTreeNode = (backendNode: BackendTreeNode | null): TreeNode | null => {
  if (!backendNode) return null;
  
  return {
    user: {
      id: backendNode.id.toString(),
      firstName: backendNode.firstName,
      lastName: backendNode.lastName,
      sponsorUsername: backendNode.sponsorUsername || '',
      email: backendNode.email,
      phone: backendNode.phone,
      isActive: true // You can determine this from your business logic
    },
    totalLeftPV: backendNode.pvData.leftPV,
    totalRightPV: backendNode.pvData.rightPV,
    totalLeftBV: backendNode.bvData.leftBV,
    totalRightBV: backendNode.bvData.rightBV,
    leftChild: transformTreeNode(backendNode.children?.left || null),
    rightChild: transformTreeNode(backendNode.children?.right || null)
  };
};

// Transform stats data
const transformStats = (backendStats: BackendStats): BinaryTreeStats => {
  return {
    leftLegPV: backendStats.leftLeg.pv,
    rightLegPV: backendStats.rightLeg.pv,
    leftLegBV: backendStats.leftLeg.bv,
    rightLegBV: backendStats.rightLeg.bv,
    leftLegMembers: Math.floor(backendStats.teamMembers.count / 2), // Rough estimate
    rightLegMembers: Math.ceil(backendStats.teamMembers.count / 2), // Rough estimate
    totalPairs: backendStats.totalPairs.count,
    weeklyPairs: backendStats.totalPairs.thisWeek,
    monthlyPairs: backendStats.totalPairs.count, // You might want to add this to backend
    unusedLeftPV: 0, // Calculate based on your business logic
    unusedRightPV: 0, // Calculate based on your business logic
    teamMembersThisWeek: backendStats.teamMembers.thisWeek
  };
};

const initialState: BinaryTreeState = {
  treeData: null,
  stats: null,
  loading: false,
  error: null,
  currentUserId: null
};

const binaryTreeSlice = createSlice({
  name: 'binaryTree',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBinaryTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBinaryTree.fulfilled, (state, action: PayloadAction<BinaryTreeApiResponse>) => {
        state.loading = false;
        state.treeData = transformTreeNode(action.payload.data);
        state.stats = transformStats(action.payload.stats);
        state.currentUserId = action.meta.arg;
      })
      .addCase(fetchBinaryTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Unknown error';
      });
  }
});

export const { clearError } = binaryTreeSlice.actions;
export default binaryTreeSlice.reducer;
