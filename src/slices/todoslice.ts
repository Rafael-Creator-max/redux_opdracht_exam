
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/store"; 

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [],
};


export const fetchTodos = createAsyncThunk<Todo[]>(
  "todos/fetchTodos",
  async () => {
    const response = await fetch("http://localhost:3001/todos");
    return await response.json();
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchTodos.fulfilled,
      (state, action: PayloadAction<Todo[]>) => {
        state.todos = action.payload;
      }
    );
  },
});


export const selectTodos = (state: RootState) => state.todos.todos;

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
