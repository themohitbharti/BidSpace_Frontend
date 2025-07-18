import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import productSlice from "./productSlice";
import searchSlice from "./searchSlice";
import wishlistReducer from "./wishlistSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    search: searchSlice,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
