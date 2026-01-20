import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";


interface TaskProps {
  setEditTodo: (todo: any) => void;
}

export default function Task({ setEditTodo }: TaskProps) {
  const queryClient = useQueryClient();

  const fetchTodos = async () => {
    const local = localStorage.getItem("todos");
    if (local) return JSON.parse(local);

    const res = await fetch(
      "https://jsonplaceholder.typicode.com/posts?userId=2"
    );
    if (!res.ok) throw new Error("Error fetching todos");
    const data = await res.json();

    const todos = data.map((post: any) => ({
      id: post.id,
      title: post.title,
      completed: false,
    }));

    localStorage.setItem("todos", JSON.stringify(todos));
    return todos;
  };

  const { data: todos, isLoading } = useQuery<any[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: Infinity,
  });

  const deleteTask = (id: any) => {
    const oldTodos = queryClient.getQueryData<any[]>(["todos"]) || [];
    const newTodos = oldTodos.filter((todo: any) => todo.id !== id);
    queryClient.setQueryData(["todos"], newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  if (isLoading) return <div>Loading todos...</div>;

  return (
    <ul className="space-y-2">
      {todos?.map((todo: any) => (
        <li
          key={todo.id}
          className="flex justify-between items-center bg-slate-100 p-3 rounded-lg hover:bg-slate-200"
        >
          <span>{todo.title}</span>
          <div className="flex gap-2">
            <button
              className="bg-yellow-400 p-2 rounded hover:bg-yellow-600 text-white"
              onClick={() => setEditTodo(todo)}
            >
              <FaEdit />
            </button>
            <button
              className="bg-red-500 p-2 rounded hover:bg-red-700 text-white"
              onClick={() => deleteTask(todo.id)}
            >
              <FaTrash />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
