import React from "react";
import { Badge } from "@/components/ui/badge";
import { useUpdateTodoMutation } from "../../api/todoApi";

export interface TodoProps {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  categories: { name: string; color: string }[];
  description?: string;
  onDelete: (id: string) => void;
}

const Todo: React.FC<TodoProps> = ({
  id,
  text,
  completed,
  category,
  categories,
  description,
  onDelete,
}) => {
  const [updateTodo] = useUpdateTodoMutation();

  // Ensure category is always a valid object
  const matchedCategory = categories.find((cat) => cat.name === category) || {
    name: "Uncategorized",
    color: "gray",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white shadow rounded-md mb-2">
      {/*  Checkbox for toggling completed */}
      <input
        type="checkbox"
        checked={completed}
        onChange={() =>
          updateTodo({
            id,
            text,
            category,
            description,
            completed: !completed, //  Only toggle "completed"
          })
        }
        className="cursor-pointer"
      />

      {/* Todo Text */}
      <span
        className={`flex-grow ${
          completed ? "line-through text-gray-600" : "text-black font-medium"
        }`}
      >
        {text || "Untitled Todo"} {/* Prevent empty text */}
      </span>

      {/* Category Badge (Now always has a valid value) */}
      <Badge style={{ backgroundColor: matchedCategory.color }}>
        {matchedCategory.name}
      </Badge>

      {/*  Delete Button (No e.preventDefault) */}
      <button
        onClick={() => onDelete(id)}
        className="p-1 text-red-500 hover:text-red-700"
      >
        ❌
      </button>
    </div>
  );
};

export default Todo;
