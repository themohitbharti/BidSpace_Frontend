import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import productSlice from "./productSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
