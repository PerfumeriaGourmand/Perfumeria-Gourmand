"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";

export interface AdminTodo {
  id: string;
  text: string;
  done: boolean;
  created_at: string;
}

async function call(method: string, body: unknown) {
  const res = await fetch("/api/admin/todos", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("request failed");
  return res.json();
}

export default function AdminChecklist({ initialTodos }: { initialTodos: AdminTodo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);
  const sorted = [...pending, ...done];

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || adding) return;
    setAdding(true);
    setError(null);
    try {
      const created: AdminTodo = await call("POST", { text: value });
      setTodos((prev) => [created, ...prev]);
      setText("");
    } catch {
      setError("No se pudo agregar la tarea");
    } finally {
      setAdding(false);
    }
  }

  async function toggle(todo: AdminTodo) {
    setError(null);
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)));
    try {
      await call("PATCH", { id: todo.id, done: !todo.done });
    } catch {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: todo.done } : t)));
      setError("No se pudo actualizar la tarea");
    }
  }

  async function remove(todo: AdminTodo) {
    setError(null);
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    try {
      await call("DELETE", { id: todo.id });
    } catch {
      setTodos((prev) => [todo, ...prev]);
      setError("No se pudo borrar la tarea");
    }
  }

  async function clearDone() {
    const snapshot = todos;
    setError(null);
    setTodos((prev) => prev.filter((t) => !t.done));
    try {
      await call("DELETE", { completed: true });
    } catch {
      setTodos(snapshot);
      setError("No se pudieron limpiar las tareas");
    }
  }

  return (
    <div className="border border-gold/10 bg-obsidian-surface">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gold/10">
        <h2 className="font-sans text-xs tracking-widest uppercase text-cream-muted">
          Pendientes
          <span className="ml-2 text-cream-dim normal-case tracking-normal">
            {pending.length}
          </span>
        </h2>
        {done.length > 0 && (
          <button
            type="button"
            onClick={clearDone}
            className="font-sans text-[10px] tracking-widest uppercase text-gold/60 hover:text-gold transition-colors"
          >
            Limpiar hechas
          </button>
        )}
      </div>

      <form onSubmit={add} className="flex items-center gap-2 px-5 py-3 border-b border-gold/5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          placeholder="Nueva tarea…"
          className="flex-1 min-w-0 bg-transparent font-sans text-sm text-cream placeholder:text-cream-dim outline-none"
        />
        <button
          type="submit"
          disabled={adding || !text.trim()}
          aria-label="Agregar tarea"
          className="text-cream-dim hover:text-gold disabled:opacity-30 disabled:hover:text-cream-dim transition-colors"
        >
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </form>

      {error && (
        <p className="px-5 py-2 font-sans text-xs text-red-400">{error}</p>
      )}

      <ul className="max-h-64 overflow-y-auto">
        {sorted.map((todo) => (
          <li
            key={todo.id}
            className="group flex items-start gap-3 px-5 py-2 hover:bg-obsidian/40 transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(todo)}
              aria-label={todo.done ? "Marcar como pendiente" : "Marcar como hecha"}
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                todo.done
                  ? "border-gold/60 bg-gold/20 text-gold"
                  : "border-gold/30 hover:border-gold"
              }`}
            >
              {todo.done && <Check size={11} strokeWidth={2.5} />}
            </button>
            <span
              className={`flex-1 min-w-0 break-words font-sans text-sm ${
                todo.done ? "text-cream-dim line-through" : "text-cream-muted"
              }`}
            >
              {todo.text}
            </span>
            <button
              type="button"
              onClick={() => remove(todo)}
              aria-label="Borrar tarea"
              className="mt-0.5 text-cream-dim opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-red-400 transition-all"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="px-5 py-6 text-center font-sans text-sm text-cream-dim italic">
            Todo al día
          </li>
        )}
      </ul>
    </div>
  );
}
