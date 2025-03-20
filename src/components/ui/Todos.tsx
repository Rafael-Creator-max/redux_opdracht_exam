import React from "react";
import { useGetTodosQuery, useGetCategoriesQuery } from "../../api/todoApi";
import Todo from "./Todo";

interface TodoType {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  description?: string;
}

const Todos: React.FC = () => {
  const { data: todos, error, isLoading } = useGetTodosQuery(undefined);
  const { data: categories } = useGetCategoriesQuery(undefined); // Fetch categories

  if (isLoading) return <p>Loading todos...</p>;
  if (error) return <p>Failed to load todos.</p>;

  return (
    <div>
      {todos?.map((todo: TodoType) => (
        <Todo
          key={todo.id}
          {...todo}
          description={todo.description || "No description available"} // ensures description is always a string
          categories={categories || []}
        />
      ))}
    </div>
  );
};

export default Todos;
