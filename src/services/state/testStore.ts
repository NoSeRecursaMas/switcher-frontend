import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export function createTestStore() {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
  });
  return store;
}
