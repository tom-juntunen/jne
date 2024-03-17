import React from 'react';
import './TodoItem.css';
import { formatUpdatedAt } from '../util/dates'

interface TodoItemProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  taskItemId?: number;
  createdAt: Date;
  updatedAt: Date;
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
  createdAt,
  updatedAt,
  onAddSubtask,
  toggleComplete,
  deleteTodo
}) => {
  const itemClassName = `todo-item${completed ? ' completed' : ''}`;

  return (
    <div className={itemClassName}>
      <div className="todo-content">
        <div className="todo-text">
          <div className="todo-title">
            <h3>{title}</h3>
            <span className="todo-updated-at">Updated {updatedAt ? formatUpdatedAt(updatedAt) : 'N/A'} ago</span>
          </div>
          <p className="todo-description">{description}</p>
          {completed && <p className="completed-at">Completed at: <span className="completed-time">{completedAt && new Date(completedAt).toLocaleString()}</span></p>}
        </div>
      </div>
      <div className="todo-action">
        <button className="todo-add-subtask" onClick={() => onAddSubtask(id)}>Add Subtask</button>
        <button className="todo-delete" onClick={() => deleteTodo(id)}>Delete</button>
        {!completed && (
          <button className="mark-complete" onClick={() => toggleComplete(id)}>
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
