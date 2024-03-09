// src/components/TodoItem.tsx
import React from 'react';
import './TodoItem.css';

interface TodoItemProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  id, 
  title, 
  description, 
  completed, 
  toggleComplete,
  deleteTodo
}) => {
  const itemClassName = `todo-item${completed ? ' completed' : ''}`;

  return (
    <div className={itemClassName}>
      <div className="todo-content">
        <h3 className="todo-title">{title}</h3>
        <p className="todo-description">{description}</p>
        <input 
          type="checkbox" 
          className="todo-toggle" 
          checked={completed} 
          onChange={() => toggleComplete(id)} 
        />
      </div>
      <button className="todo-delete" onClick={() => deleteTodo(id)}>Delete</button>
    </div>
  );
};

export default TodoItem;
