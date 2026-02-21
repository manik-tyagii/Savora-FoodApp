import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, name, price, qty, restaurantId }
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        exists.qty += item.qty || 1;
      } else {
        state.items.push({ ...item, qty: item.qty || 1 });
      }
      state.total = state.items.reduce((s, it) => s + it.price * it.qty, 0);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      state.total = state.items.reduce((s, it) => s + it.price * it.qty, 0);
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = qty;
      state.total = state.items.reduce((s, it) => s + it.price * it.qty, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
