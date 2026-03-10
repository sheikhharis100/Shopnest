import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.js';
import authReducer from './slices/authSlice.js';
import orderReducer from './slices/orderSlice.js';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
  },
});

export default store;