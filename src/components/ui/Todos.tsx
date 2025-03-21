import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  fetchTodos,
  addTodo,
  deleteTodo,
  selectTodos,
} from "../../slices/todoslice";
import { RootState } from "../../store/store"; // Import RootState for correct types
import { useGetCategoriesQuery } from "../../api/todoApi"; //  Restore API Fetch
import Todo from "./Todo";

interface TodoType {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  description?: string;
}

const Todos: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => selectTodos(state));

  //  Fetch categories from API
  const { data: categories = [] } = useGetCategoriesQuery(undefined);

  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  //  Fetch todos only once on load
  useEffect(() => {
    dispatch(fetchTodos() as any);
  }, [dispatch]);

  const handleAddTodo = () => {
    if (!newTodo) return;

    const newTodoItem: TodoType = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false,
      category: selectedCategory,
    };

    dispatch(addTodo(newTodoItem));
    toast.success(`Todo Added: "${newTodo}"`, { duration: 5000 });

    //  Sync with API in the background
    fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodoItem),
    });

    setNewTodo("");
  };

  const handleDelete = (id: string, todoText: string) => {
    dispatch(deleteTodo(id));
    toast.error(`Todo Deleted: "${todoText}"`, { duration: 5000 });

    //  Sync with API in the background
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE",
    });
  };
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionPercentage =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-2 mb-4"
      >
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow p-2 border rounded-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Select Category</option>
          {categories?.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTodo}
          className="p-2 bg-black text-white rounded-md"
        >
          ➕ Add
        </button>
      </form>

      {todos?.map((todo: TodoType) => (
        <Todo
          key={todo.id}
          {...todo}
          categories={categories} //  Now categories are properly passed
          onDelete={() => handleDelete(todo.id, todo.text)}
        />
      ))}
     
      <div className="flex items-center gap-x-6">
        <p>
          Total: <strong className="text-white">{totalTodos}</strong> todos
        </p>
        <p>
          Active: <strong className="text-blue-500">{activeTodos}</strong> todos
        </p>
        <p>
          Completed:{" "}
          <strong className="text-green-500">{completedTodos}</strong> todos
        </p>
        <p className="font-semibold text-white">
          ✅ {completionPercentage}% completed
        </p>
      </div>
    </div>
  );
};

export default Todos;
