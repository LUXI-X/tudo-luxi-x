// /store/tudoStore.js
import { create } from "zustand";

export const tudoStore = create((set) => ({
  todos: [],
  setTodos: (todos) => set(() => ({ todos })), // for loading todos from localStorage

  addTodo: (todo) =>
    set((state) => ({
      todos: [todo, ...state.todos],
    })),

  editTodo: (id, newTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, todo: newTodo } : todo
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));
