import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Simple async thunk to load restaurants from the local mock JSON
export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/mock/restaurants.json");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    list: [],
    selected: null,
    activeCuisine: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setCuisineFilter: (state, action) => {
      state.activeCuisine = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelected, setCuisineFilter } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
