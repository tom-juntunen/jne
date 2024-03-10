import React from 'react';
import './TodoItem.css';

interface TodoItemProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  taskItemId?: number; // Parent task id for subtasks
  onAddSubtask: (taskItemId: number) => void;
  toggleComplete: (id: number) => void;
  deleteTodo: (id: number) => void;
}


const TodoItem: React.FC<TodoItemProps> = ({ 
  id, 
  title, 
  description, 
  completed, 
  completedAt,
  taskItemId,
  onAddSubtask,
  toggleComplete,
  deleteTodo
}) => {
  const itemClassName = `todo-item${completed ? ' completed' : ''}`;

  return (
    <div className={itemClassName}>
      <div className="todo-content">
        <h3 className="todo-title">{title}</h3>
        <p className="todo-description">{description}</p>
        <div className="todo-info">
          {completed && <p className="completed-at">Completed at: <span className="completed-time">{completedAt && new Date(completedAt).toLocaleString()}</span></p>}
          <input 
            type="checkbox" 
            className="todo-toggle" 
            checked={completed} 
            onChange={() => toggleComplete(id)} 
          />
        </div>
      </div>
      <button className="todo-delete" onClick={() => deleteTodo(id)}>Delete</button>
      <button className="todo-add-subtask" onClick={() => onAddSubtask(id)}>Add Subtask</button>
    </div>
  );
};

export default TodoItem;
