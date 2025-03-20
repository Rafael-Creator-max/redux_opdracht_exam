import { Toaster } from "@/components/ui/sonner"; 
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import TodoList from "./components/ui/Todos";

const App = () => {
  return (
    <>
      <ThemeProvider>
        <Layout>
          <Toaster position="top-right" richColors />{" "}
          <div className="flex flex-col items-center justify-center min-h-svh">
            <TodoList />
          </div>
        </Layout>
      </ThemeProvider>
    </>
  );
};

export default App;
