
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  tagTypes: ["Todos", "Categories"], // Ensure efficient cache invalidation

  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
      providesTags: ["Todos"], //  Ensures efficient updates
      keepUnusedDataFor: 60, //  Cache todos for 60 seconds to prevent instant re-fetching
    }),

    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
      keepUnusedDataFor: 60, //  Cache categories for 60 seconds
    }),

    addTodo: builder.mutation({
      query: (newTodo) => ({
        url: "/todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: ["Todos"], // Only refresh todos, not full app!
    }),

    updateTodo: builder.mutation({
      query: ({ id, ...updatedTodo }) => ({
        url: `/todos/${id}`,
        method: "PATCH", //  PATCH updates only provided fields
        body: updatedTodo,
      }),
      invalidatesTags: ["Todos"], //  Refresh only affected todo!
    }),

    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"], //Refresh only affected todo!
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetCategoriesQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;

export default todoApi;
