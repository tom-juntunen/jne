import React from 'react';
import './TodoItem.css';
import { formatUpdatedAt } from '../util/dates';
import { BsCheckCircle } from 'react-icons/bs';

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
        {!completed && (
            <a className="todo-delete" onClick={() => deleteTodo(id)}>
              <span className="todo-delete-x">X</span>
            </a>
          )}
        <div className="todo-text">
          <div className="todo-title">
            <h4>{title}</h4>
            <span className="todo-updated-at">{updatedAt ? formatUpdatedAt(updatedAt) : 'N/A'}</span>
          </div>
          <p className="todo-description">{description}</p>
          {completed && <p className="completed-at">Completed at: <span className="completed-time">{completedAt && new Date(completedAt).toLocaleString()}</span></p>}
        </div>
        {!completed && (
          <a className="mark-complete" onClick={() => toggleComplete(id)}>
            <BsCheckCircle />
          </a>
        )}
      </div>
      {!completed && (
        <div className="todo-divider-vertical"></div>
      )}
      <hr className="todo-divider-horizontal" />
      <div className="todo-action">
        <a className="todo-add-subtask" onClick={() => onAddSubtask(id)}>Add Subtask</a>
      </div>
    </div>
  );
};

export default TodoItem;
