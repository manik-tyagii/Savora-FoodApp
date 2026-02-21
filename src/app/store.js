import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import cartReducer from "../features/cartSlice";
import restaurantsReducer from "../features/restaurantsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        restaurants: restaurantsReducer,
    },
});

export default store;