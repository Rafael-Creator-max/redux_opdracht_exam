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

  //  Fetch categories from API
  const { data: categories = [] } = useGetCategoriesQuery(undefined);

  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); //  Category filter state
  // //  Pagination states
  // const [currentPage, setCurrentPage] = useState(1);
  // const todosPerPage = 5;

  //  Fetch todos only once when the component loads
  useEffect(() => {
    dispatch(fetchTodos() as any);
  }, [dispatch]);

  const handleAddTodo = () => {
    if (!newTodo) return;

    const newTodoItem: TodoType = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false,
      category: selectedCategory === "all" ? undefined : selectedCategory, //  If "all", don't store category
    };

    dispatch(addTodo(newTodoItem));
    toast.success(`Todo Added: "${newTodo}"`, { duration: 5000 });

    //  Sync with API in the background
    fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodoItem),
    });

    setNewTodo(""); //  Reset input after adding
    setSelectedCategory("all"); //  Reset category selection
  };

  const handleDelete = (id: string, todoText: string) => {
    dispatch(deleteTodo(id));
    toast.error(`Todo Deleted: "${todoText}"`, { duration: 5000 });

    //  Sync with API in the background
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE",
    });
  };
  // filter logic
  const filteredTodos =
    selectedCategory === "all" || selectedCategory === ""
      ? todos
      : todos.filter((todo) => todo.category === selectedCategory);

  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Category Filter Dropdown (Replaced with ShadCN Select) */}
      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          <SelectTrigger className="w-[200px] border rounded-md p-2">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
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

      {/*  Display Filtered Todos */}
      {filteredTodos.map((todo: TodoType) => (
        <Todo
          key={todo.id}
          {...todo}
          categories={categories}
          onDelete={() => handleDelete(todo.id, todo.text)}
        />
      ))}

      {/*  Stats Section */}
      <div className="flex items-center gap-x-6 mt-6 text-gray-600 border-t border-gray-300 pt-4">
        <p>
          Total: <strong className="text-white">{todos.length}</strong> todos
        </p>
        <p>
          Active:{" "}
          <strong className="text-blue-500">
            {todos.filter((t) => !t.completed).length}
          </strong>{" "}
          todos
        </p>
        <p>
          Completed:{" "}
          <strong className="text-green-500">
            {todos.filter((t) => t.completed).length}
          </strong>{" "}
          todos
        </p>
        <p className="font-semibold">
          ✅{" "}
          {todos.length > 0
            ? Math.round(
                (todos.filter((t) => t.completed).length / todos.length) * 100
              )
            : 0}
          % completed
        </p>
      </div>
    </div>
  );
};

export default Todos;
