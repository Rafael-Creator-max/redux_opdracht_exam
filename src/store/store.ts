import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../slices/todoslice";
import { todoApi } from "../api/todoApi";

export const store = configureStore({
  reducer: {
    todos: todoReducer, // Redux state management
    [todoApi.reducerPath]: todoApi.reducer, // RTK Query API slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware), // Enables API fetching
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
