"use client";
import React from "react";
import { tudoStore } from "@/state/tudoStore";
import { useState, useEffect } from "react";
import jsPDF from "jspdf"; // Import jsPDF

function TudoPage() {
  const [inputValue, setInputValue] = useState(""); 
  const { todos, addTodo, editTodo, deleteTodo, setTodos } = tudoStore();


  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")); // Get todos from localStorage
    if (storedTodos && storedTodos.length > 0) {
      setTodos(storedTodos); // load todos into Zustand store
    }
  }, [setTodos]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(), // unique ID
        todo: inputValue,
        isdone: false,
        dateAdded: new Date().toLocaleDateString(), // current date
        timeAdded: new Date().toLocaleTimeString(), // current time
      };
      addTodo(newTodo);
      setInputValue(""); // clear input field after adding
    }
  };

  // Function to generate a PDF for all todos
  const generateAllTodosPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Todos Report", 10, 10); // Title
    todos.forEach((todo, index) => {
      doc.text(
        `${index + 1}. ${todo.todo} (Added on: ${todo.dateAdded} at ${todo.timeAdded})`,
        10,
        20 + index * 10
      );
    });
    doc.save("todos-report.pdf"); // Save the PDF with a specific file name
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-[600px] p-4 rounded-md shadow-lg bg-black">
        <h1 className="font-bold text-3xl">Todos</h1>
        <p>Add your daily task</p>

        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <input
              type="text"
              placeholder="Add task"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-10 p-2 rounded-lg bg-gray-950 outline-none text-white hover:border border-white"
            />
          </div>

          <button
            type="submit"
            className="mt-3 w-full bg-white text-green-600 py-2 rounded-lg font-bold hover:bg-gray-200"
          >
            Add Task
          </button>
        </form>

        {/* Display todos */}
        <div className="mt-5">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                editTodo={editTodo}
                deleteTodo={deleteTodo}
              />
            ))
          ) : (
            <p className="text-white mt-4">No tasks added yet</p>
          )}
        </div>

        {/* Button to generate PDF for all todos */}
        <button
          onClick={generateAllTodosPDF}
          className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
        >
          Download All Todos as PDF
        </button>
      </div>
    </div>
  );
}

// Todo item component with edit, delete, and download PDF options for individual todos
const TodoItem = ({ todo, editTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.todo);

  const handleEdit = () => {
    if (isEditing && editValue.trim()) {
      editTodo(todo.id, editValue); // call edit function
    }
    setIsEditing(!isEditing);
  };

  // Function to generate a PDF for a single todo
  const generateTodoPDF = (todo) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Todo Details", 10, 10); // Title
    doc.text(`Task: ${todo.todo}`, 10, 20); // Task description
    doc.text(`Added on: ${todo.dateAdded}`, 10, 30); // Date added
    doc.text(`Time: ${todo.timeAdded}`, 10, 40); // Time added
    doc.save(`todo-${todo.id}.pdf`); // Save the PDF with a unique name
  };

  return (
    <div className="bg-white text-green-900 p-2 my-2 rounded-lg lg:flex flex-col justify-between items-center">
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full h-8 p-1 rounded-lg outline-none"
        />
      ) : (
        <span>{todo.todo}</span>
      )}

      <div className="ml-2 flex space-y-2  space-x-2">
        {/* Display date and time */}
        <span className="text-sm text-gray-500">
          Added on: {todo.dateAdded} at {todo.timeAdded}
        </span>

        <button
          onClick={handleEdit}
          className="bg-green-500 text-white px-2 py-1 rounded-md"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-white text-black px-2 py-1 rounded-md"
        >
          Delete
        </button>

        {/* Button to download PDF for a single todo */}
        <button
          onClick={() => generateTodoPDF(todo)}
          className="bg-blue-500 text-white px-2 py-1 rounded-md"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default TudoPage;
