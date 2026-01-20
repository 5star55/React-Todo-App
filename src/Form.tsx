import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Form({ editTodo, setEditTodo }) {
  const [task, setTask] = useState("");
  const queryClient = useQueryClient();


  useEffect(() => {
    if (editTodo) {
      setTask(editTodo.title);
    }
  }, [editTodo]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const oldTodos = queryClient.getQueryData(["todos"]) || [];

    if (!task.trim()) return;

    if (editTodo) {
      const updatedTodos = oldTodos.map((t) =>
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
      <label htmlFor="">New Task</label>
      <input
        type="text"
        value={task}
        className="bg-slate-200 border-2 rounded-lg p-2 flex-1 w-[180px] h-lg sm:w-auto"
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
