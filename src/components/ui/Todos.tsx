// import React, { useState } from "react";
// import {
//   useGetTodosQuery,
//   useGetCategoriesQuery,
//   useAddTodoMutation,
// } from "../../api/todoApi";
// import Todo from "./Todo";

// interface TodoType {
//   id: string;
//   text: string;
//   completed: boolean;
//   category?: string;
//   description?: string;
// }

// interface CategoryType {
//   name: string;
//   color: string;
// }

// const Todos: React.FC = () => {
//   const { data: todosRaw, error, isLoading } = useGetTodosQuery(undefined);
//   const { data: categories } = useGetCategoriesQuery(undefined);
//   const [addTodo] = useAddTodoMutation();

//   //  Convert category string into full object
//   const todos = todosRaw?.map((todo: TodoType) => ({
//     ...todo,
//     category: categories?.find(
//       (cat: CategoryType) => cat.name === todo.category
//     ) || {
//       name: "Uncategorized",
//       color: "gray",
//     },
//   }));

//   // State for adding a new todo
//   const [newTodo, setNewTodo] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const handleAddTodo = async () => {
//     if (!newTodo) return;

//     //  Find category object by name (to get color)
//     const matchedCategory = categories?.find(
//       (cat: CategoryType) => cat.name === selectedCategory
//     ) || {
//       name: "Uncategorized",
//       color: "gray",
//     };

//     await addTodo({
//       id: crypto.randomUUID(),
//       text: newTodo,
//       completed: false,
//       category: matchedCategory.name,
//       description: "",
//     });
//     refetch();

//     setNewTodo("");
//   };

//   if (isLoading) return <p>Loading todos...</p>;
//   if (error) return <p>Failed to load todos.</p>;

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/*  Add Todo Input & Button */}
//       <div className="flex items-center gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Add a new todo..."
//           value={newTodo}
//           onChange={(e) => setNewTodo(e.target.value)}
//           className="flex-grow p-2 border rounded-md"
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="p-2 border rounded-md"
//         >
//           <option value="">Select Category</option>
//           {categories?.map((cat: CategoryType) => (
//             <option key={cat.name} value={cat.name}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//         <button
//           onClick={handleAddTodo}
//           className="p-2 bg-black text-white rounded-md"
//         >
//           ➕ Add
//         </button>
//       </div>

//       {/* ✅ Todo List */}
//       {todos?.map((todo: TodoType) => (
//         <Todo key={todo.id} {...todo} categories={categories || []} />
//       ))}

//       {/* ✅ Pagination & Stats */}
//       <div className="flex justify-between mt-6 text-gray-600">
//         <p>Total: {todos?.length} todos</p>
//         <p>
//           Active: {todos?.filter((t: TodoType) => !t.completed).length} todos •
//           Completed: {todos?.filter((t: TodoType) => t.completed).length} todos
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Todos;
// import React, { useState } from "react";
// import {
//   useGetTodosQuery,
//   useGetCategoriesQuery,
//   useAddTodoMutation,
//   useDeleteTodoMutation, // ✅ Import delete mutation
// } from "../../api/todoApi";
// import Todo from "./Todo";

// interface TodoType {
//   id: string;
//   text: string;
//   completed: boolean;
//   category?: string;
//   description?: string;
// }

// const Todos: React.FC = () => {
//   const { data: todos, isLoading, error } = useGetTodosQuery(undefined);
//   const { data: categories } = useGetCategoriesQuery(undefined);
//   const [addTodo] = useAddTodoMutation();
//   const [deleteTodo] = useDeleteTodoMutation(); // ✅ Restore delete mutation

//   const [newTodo, setNewTodo] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   // ✅ Fix handleAddTodo
//   const handleAddTodo = async (event: React.FormEvent) => {
//     event.preventDefault(); //  Stops form from refreshing the page why not workingggggg

//     if (!newTodo) return;

//     await addTodo({
//       id: crypto.randomUUID(),
//       text: newTodo,
//       completed: false,
//       category: selectedCategory,
//       description: "",
//     });

//     setNewTodo("");
//   };

//   // ✅ Restore delete functionality
//   const handleDelete = async (id: string) => {
//     await deleteTodo(id);
//   };

//   if (isLoading) return <p>Loading todos...</p>;
//   if (error) return <p>Failed to load todos.</p>;

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* ✅ Add Todo Input & Button */}
//       <div className="flex items-center gap-2 mb-4">
//         <form onSubmit={handleAddTodo} className="flex items-center gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Add a new todo..."
//             value={newTodo}
//             onChange={(e) => setNewTodo(e.target.value)}
//             className="flex-grow p-2 border rounded-md"
//           />
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="p-2 border rounded-md"
//           >
//             <option value="">Select Category</option>
//             {categories?.map((cat: { name: string; color: string }) => (
//               <option key={cat.name} value={cat.name}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={handleAddTodo} // ✅ Pass function directly (React handles event automatically)
//             className="p-2 bg-black text-white rounded-md"
//           >
//             ➕ Add
//           </button>
//         </form>
//       </div>

//       {/* ✅ Todo List */}
//       {todos?.map((todo: TodoType) => (
//         <Todo
//           key={todo.id}
//           {...todo}
//           categories={categories || []}
//           onDelete={handleDelete}
//         />
//       ))}
//     </div>
//   );
// };

// export default Todos;
import React, { useState } from "react";
import {
  useGetTodosQuery,
  useGetCategoriesQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
} from "../../api/todoApi";
import Todo from "./Todo";

interface TodoType {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  description?: string;
}

const Todos: React.FC = () => {
  const { data: todos, isLoading, error } = useGetTodosQuery(undefined);
  const { data: categories } = useGetCategoriesQuery(undefined);
  const [addTodo] = useAddTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault(); //  Stops form from refreshing the page i hope

    if (!newTodo) return;

    await addTodo({
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false,
      category: selectedCategory,
      description: "",
    });

    setNewTodo("");
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  if (isLoading) return <p>Loading todos...</p>;
  if (error) return <p>Failed to load todos.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleAddTodo} className="flex items-center gap-2 mb-4">
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
          {categories?.map((cat: { name: string; color: string }) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="p-2 bg-black text-white rounded-md">
          ➕ Add
        </button>
      </form>

      {todos?.map((todo: TodoType) => (
        <Todo
          key={todo.id}
          {...todo}
          categories={categories || []}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default Todos;
