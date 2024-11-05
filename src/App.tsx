import { useState, useEffect } from "react";

import { TodoItem } from "./types";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check local storage for user preference
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme
      ? JSON.parse(savedTheme)
      : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newTheme)); // Save to local storage
      return newTheme;
    });
  };

  useEffect(() => {
    // Apply dark mode class to the body
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addTodo = (text: string) => {
    if (text.trim() === "") {
      alert("Don't forget something?");
      return;
    }
    const newTodo: TodoItem = {
      id: Date.now(),
      text,
      isCompleted: false,
    };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  return (
    <>
      <h2>My TODO List</h2>
      <button onClick={toggleTheme} className="theme-toggle">
        Toggle Theme
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
      />
      <button onClick={() => addTodo(input)}>Add</button>
      <ul>
        {todos.map((todo) => (
          <TodoList
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        ))}
      </ul>
    </>
  );
}

export default App;
