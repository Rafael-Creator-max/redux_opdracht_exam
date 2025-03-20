import { Button } from "@/components/ui/button";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import TodoList from "./components/ui/Todos"; 

const App = () => {
  return (
    <>
      <ThemeProvider>
        <Layout>
          <div className="flex flex-col items-center justify-center min-h-svh">
            <Button>Click me</Button>
            <TodoList /> 
          </div>
        </Layout>
      </ThemeProvider>
    </>
  );
};

export default App;
