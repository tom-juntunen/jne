// src/App.tsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TodoItem from './components/TodoItem';
import './App.css';

const socket = io('http://localhost:3000');

interface TodoItemData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoItemData[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then(response => response.json())
      .then(setTodos);
  
    const handleNewTodo = (newTodo: TodoItemData) => {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    };
    
    const handleUpdatedTodo = (updatedTodo: TodoItemData) => {
      setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
    };
    
    const handleDeleteTodo = (todoId: number) => {
      console.log(`Handling delete for todo with id: ${todoId}`);
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== todoId)
      );
    };
    
    socket.on('new_todo', handleNewTodo);
    socket.on('update_todo', handleUpdatedTodo);
    socket.on('delete_todo', handleDeleteTodo);
  
    return () => {
      socket.off('new_todo', handleNewTodo);
      socket.off('update_todo', handleUpdatedTodo);
      socket.off('delete_todo', handleDeleteTodo);
    };
  }, []);

  const addTodo = () => {
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    })
    .then(response => response.json())
    .then(newTodo => {
      setTitle('');
      setDescription('');
      socket.emit('update_todo', newTodo);
    });
  };

  const toggleComplete = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !todo.completed }),
    })
    .then(response => response.json())
    .then(updatedTodo => {
      setTodos((prevTodos) => prevTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    })
    .catch((error) => {
      console.error('Failed to update todo', error);
    });
  };

  const deleteTodo = (id: number) => {
    console.log(`Attempting to delete todo with id: ${id}`);
    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // Update todos state after successful deletion
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        // Emit event to update UI after successful deletion
        socket.emit('delete_todo', id);
      } else {
        console.error('Failed to delete todo');
      }
    })
    .catch((error) => {
      console.error('Failed to delete todo', error);
    });
  };
  

  return (
    <div className="container">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={addTodo}>Add Todo</button>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          description={todo.description}
          completed={todo.completed}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
        />
      ))}
    </div>
  );
};

export default App;
