import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface FormProps {
  editTodo: any;
  setEditTodo: (todo: any) => void;
}

export default function Form({ editTodo, setEditTodo }: FormProps) {
  const [task, setTask] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editTodo) {
      setTask(editTodo.title || "");
    }
  }, [editTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const oldTodos = queryClient.getQueryData<any[]>(["todos"]) || [];

    if (!task.trim()) return;

    if (editTodo) {
      const updatedTodos = oldTodos.map((t: any) =>
        t.id === editTodo.id ? { ...t, title: task } : t
      );
      queryClient.setQueryData(["todos"], updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setEditTodo(null);
    } else {
      const newTodo = { id: Date.now(), title: task, completed: false };
      const updatedTodos = [...oldTodos, newTodo];
      queryClient.setQueryData(["todos"], updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    setTask("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 mb-5 items-center"
    >
      <label>New Task</label>
      <input
        type="text"
        value={task}
        className="bg-slate-200 border-2 rounded-lg p-2 flex-1 w-[180px] sm:w-auto"
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        className="bg-green-400 text-white rounded-lg px-4 py-2 hover:bg-green-700"
        type="submit"
      >
        {editTodo ? "Update" : "+"}
      </button>
    </form>
  );
}
