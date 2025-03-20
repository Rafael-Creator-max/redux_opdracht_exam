import React from "react";
import { Badge } from "@/components/ui/badge";
import { useUpdateTodoMutation } from "../../api/todoApi";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

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

  //  Show notification when toggling todo
  const handleToggle = async () => {
    await updateTodo({
      id,
      text,
      category,
      description,
      completed: !completed,
    });

    toast(`${text} is now ${completed ? "incomplete" : "done"}`, {
      description: `You have updated this task.`,
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white shadow rounded-md mb-2">
      <div className="flex justify-between items-center gap-4 w-full">
        {/*  Checkbox for toggling completed */}
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle} 
          className="cursor-pointer"
        />
        {/*  Todo Text */}
        <span
          className={`flex-grow ${
            completed ? "line-through text-gray-600" : "text-black font-medium"
          }`}
        >
          {text || "Untitled Todo"}
        </span>
        {/* ShadCN Collapsible Trigger - Now in the Middle */}
        <Collapsible>
          <CollapsibleTrigger className="ml-2 p-1 text-blue-500 hover:text-blue-700">
            🔽 More Info
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 p-2 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-700">{description}</p>
          </CollapsibleContent>
        </Collapsible>
        <Badge style={{ backgroundColor: matchedCategory.color }}>
          {matchedCategory.name}
        </Badge>
        {/*  Delete Button (Now with a notification) */}
        <button
          onClick={() => {
            onDelete(id);
            toast(`${text} has been deleted`, {
              description: `You have removed this task.`,
              duration: 5000, // Optional duration
              action: {
                label: "Undo",
                onClick: () => console.log("Undo delete action"), // Optional undo action
              },
            });
          }}
          className="p-1 text-red-500 hover:text-red-700"
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default Todo;
