import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, signOutUser } from "../utils/firebase"; // bring signOut helper

// SIGNUP
const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ return only serializable data
      return {
        uid: userCredentials.user.uid,
        email: userCredentials.user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// LOGIN
const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ return only serializable data
      return {
        uid: userCredentials.user.uid,
        email: userCredentials.user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    // set user from auth listener
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder.addCase(signOutCurrentUser.fulfilled, (state) => {
      state.user = null;
      state.error = null;
    });
    builder.addCase(signOutCurrentUser.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

// sign out thunk
const signOutCurrentUser = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOutUser();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const { logout, setUser } = authSlice.actions;
export { loginUser, signupUser, signOutCurrentUser };
export default authSlice.reducer;
