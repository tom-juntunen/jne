// src/components/SubTaskItem.tsx
import React, { useState } from 'react';
import './SubTaskItem.css';

interface SubTaskItemProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  taskItemId: number; // Parent task id
  toggleSubtaskComplete: (taskItemId: number, id: number) => void;
  deleteSubTask: (taskItemId: number, id: number) => void;
  onCancelAddSubtask: () => void;
  onAddSubtaskSubmit?: (title: string, description: string, taskItemId: number) => void; // New prop for submitting the subtask
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({
  id,
  title,
  description,
  completed,
  completedAt,
  taskItemId,
  toggleSubtaskComplete,
  deleteSubTask,
  onCancelAddSubtask,
  onAddSubtaskSubmit // Destructure the new prop
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const itemClassName = `subtask-item${completed ? ' completed' : ''}`;

  // Handler for when the add subtask form is submitted
  const handleSubmit = () => {
    if (onAddSubtaskSubmit && taskItemId != null) {
      onAddSubtaskSubmit(newTitle, newDescription, taskItemId);
      setNewTitle(''); // Reset the title
      setNewDescription(''); // Reset the description
    }
  };

  return (
    <div className={itemClassName}>
      {/* Conditional rendering for adding a new subtask */}
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
          <button onClick={handleSubmit}>Add Subtask</button>
          <button onClick={onCancelAddSubtask}>Cancel</button>
        </div>
      ) : (
        // Existing subtask display
        <div className="subtask-content">
          <h3 className="subtask-title">{title}</h3>
          <p className="subtask-description">{description}</p>
          <div className="subtask-info">
            {completed && (
              <p className="completed-at">
                Completed at: <span className="completed-time">{completedAt && new Date(completedAt).toLocaleString()}</span>
              </p>
            )}
            <input
              type="checkbox"
              className="subtask-toggle"
              checked={completed}
              onChange={() => toggleSubtaskComplete(taskItemId, id)}
            />
            <button className="subtask-delete" onClick={() => deleteSubTask(taskItemId, id)}>
              Delete Subtask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubTaskItem;
