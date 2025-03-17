import React from "react";
import ModeToggle from "./ModeToggle";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-blue-500 text-white py-4 text-center text-xl font-bold flex justify-between px-6">
        <h1>Todo App</h1>
        <ModeToggle />
      </header>

      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
