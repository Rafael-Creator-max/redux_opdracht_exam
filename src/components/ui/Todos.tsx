import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  fetchTodos,
  addTodo,
  deleteTodo,
  selectTodos,
} from "../../slices/todoslice";
import { RootState } from "../../store/store";
import { useGetCategoriesQuery } from "../../api/todoApi";
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

  // Fetch categories from API
  const { data: categories = [] } = useGetCategoriesQuery(undefined);

  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); //  Default to "all"

  //  Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5; // ✅ Display 5 todos per page

  //  Fetch todos only once on component mount
  useEffect(() => {
    dispatch(fetchTodos() as any);
  }, [dispatch]);

  const handleAddTodo = () => {
    if (!newTodo) return;

    const newTodoItem: TodoType = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false,
      category: selectedCategory === "all" ? undefined : selectedCategory,
    };

    dispatch(addTodo(newTodoItem));
    toast.success(`Todo Added: "${newTodo}"`, { duration: 5000 });

    // Sync with API in the background
    fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodoItem),
    });

    setNewTodo("");
    setSelectedCategory("all");
  };

  const handleDelete = (id: string, todoText: string) => {
    dispatch(deleteTodo(id));
    toast.error(`Todo Deleted: "${todoText}"`, { duration: 5000 });

    //  Sync with API in the background
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE",
    });
  };

  // Apply filtering first
  const filteredTodos =
    selectedCategory === "all" || selectedCategory === ""
      ? todos
      : todos.filter((todo) => todo.category === selectedCategory);

  // Apply pagination AFTER filtering
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const paginatedTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  // Stats calculations
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionPercentage =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* ShadCN Category Filter Dropdown */}
      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          <SelectTrigger className="w-[200px] border rounded-md p-2">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat: { name: string }) => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Todo Input Form */}
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
        <Select
          onValueChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          <SelectTrigger className="w-[200px] border rounded-md p-2">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat: { name: string }) => (
              <SelectItem key={cat.name} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={handleAddTodo}
          className="p-2 bg-black text-white rounded-md"
        >
          ➕ Add
        </button>
      </form>

      {/*  Display Paginated Todos */}
      {paginatedTodos.map((todo: TodoType) => (
        <Todo
          key={todo.id}
          {...todo}
          categories={categories}
          onDelete={() => handleDelete(todo.id, todo.text)}
        />
      ))}

      {/*  Pagination Controls */}
      <div className="flex justify-between items-center mt-6 text-gray-600 border-t border-gray-300 pt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`p-2 border rounded-md ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          ← Previous
        </button>
        <p>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`p-2 border rounded-md ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          Next →
        </button>
      </div>

      {/*  Stats Section */}
      <div className="flex items-center gap-x-6 mt-6 text-gray-600 border-t border-gray-300 pt-4">
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
        <p className="font-semibold">✅ {completionPercentage}% completed</p>
      </div>
    </div>
  );
};

export default Todos;
