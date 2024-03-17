import React, { useState } from 'react';
import './SubTaskItem.css';
import { formatUpdatedAt } from '../util/dates'

interface SubTaskItemProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  taskItemId: number;
  toggleSubtaskComplete: (taskItemId: number, id: number) => void;
  deleteSubTask: (taskItemId: number, id: number) => void;
  onCancelAddSubtask: () => void;
  onAddSubtaskSubmit?: (title: string, description: string, taskItemId: number) => void;
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({
  id,
  title,
  description,
  completed,
  completedAt,
  createdAt,
  updatedAt,
  taskItemId,
  toggleSubtaskComplete,
  deleteSubTask,
  onCancelAddSubtask,
  onAddSubtaskSubmit
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const itemClassName = `subtask-item${completed ? ' completed' : ''}`;

  const handleSubmit = () => {
    if (onAddSubtaskSubmit && taskItemId != null) {
      onAddSubtaskSubmit(newTitle, newDescription, taskItemId);
      setNewTitle('');
      setNewDescription('');
    }
  };

  return (
    <div className={itemClassName}>
      <div className="subtask-wrapper">
        {id === -1 ? (
          <div className="subtask-add-form">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Subtask title"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Subtask description"
            />
            <button style={{ maxWidth: '150px' }} onClick={handleSubmit}>Add Subtask</button>
            <button onClick={onCancelAddSubtask}>Cancel</button>
          </div>
        ) : (
          <div className="subtask-content">
            {!completed && (
                <a className="subtask-delete" onClick={() => deleteSubTask(taskItemId, id)}>
                  <span className="subtask-delete-x">X</span>
                </a>
              )}
            <div className="subtask-text">
              <div className="subtask-title">
                <h4>{title}</h4>
                <span className="subtask-updated-at">Updated {updatedAt ? formatUpdatedAt(updatedAt) : 'N/A'} ago</span>
              </div>
              <p className="subtask-description">{description}</p>
              <div className="subtask-info">
                {completed && (
                  <div className="subtask-completed-at">
                    <p>Completed at: <span className="subtask-completed-time">{completedAt && new Date(completedAt).toLocaleString()}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!completed && id !== -1 && (
          <button className="mark-complete" onClick={() => toggleSubtaskComplete(taskItemId, id)}>
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default SubTaskItem;
