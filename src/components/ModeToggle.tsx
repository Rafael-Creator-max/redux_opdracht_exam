import React from "react";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

const ModeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ModeToggle;
