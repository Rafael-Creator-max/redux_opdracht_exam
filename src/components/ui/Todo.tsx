import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../../api/todoApi";

export interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  category?: string; //  Now category is optional (string)
  categories: { name: string; color: string }[]; //  List of all categories
  description: string;
}

const Todo: React.FC<TodoProps> = ({
  id,
  text,
  completed,
  category,
  categories,
  description,
}) => {
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  // Find the correct category object from the categories list
  const matchedCategory = categories.find((cat) => cat.name === category) || {
    name: "Uncategorized",
    color: "gray",
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3
          className={`text-lg font-semibold ${
            completed ? "line-through text-gray-400" : ""
          }`}
        >
          {text || "Untitled Todo"} {/* ✅ Default value if text is missing */}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description || "No description available"} 
        </p>
        <Badge
          className="mt-2"
          style={{ backgroundColor: matchedCategory.color }}
        >
          {matchedCategory.name}
        </Badge>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => updateTodo({ id, completed: !completed })}
          className="cursor-pointer"
        />
        <button
          onClick={() => deleteTodo(id)}
          className="text-red-500 hover:text-red-700"
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default Todo;
