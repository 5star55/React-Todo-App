import Task from "./Task";
import Form from "./Form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [editTodo, setEditTodo] = useState(null); // shared edit state

  return (
    <div className="mt-0 text-2xl bg-slate-200 shadow-lg rounded-lg min-h-screen p-5">
      <QueryClientProvider client={queryClient}>
        <Form editTodo={editTodo} setEditTodo={setEditTodo} />
        <Task setEditTodo={setEditTodo} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
