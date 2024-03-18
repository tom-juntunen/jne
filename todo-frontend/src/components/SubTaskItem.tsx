import React, { useState } from 'react';
import './SubTaskItem.css';
import { formatUpdatedAt } from '../util/dates';
import { BsCheckCircle } from 'react-icons/bs';

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
  onUpdateSubtask: (title: string, description: string, taskItemId: number, subtaskId: number) => void;
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
  onAddSubtaskSubmit,
  onUpdateSubtask
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const itemClassName = `subtask-item${completed ? ' completed' : ''}`;

  const handleSubmit = () => {
    if (onAddSubtaskSubmit && taskItemId != null) {
      onAddSubtaskSubmit(newTitle, newDescription, taskItemId);
      setNewTitle('');
      setNewDescription('');
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateSubtask(editedTitle, editedDescription, taskItemId, id);
    setIsEditing(false);
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
            <hr className="subtask-divider-horizontal" />
            <a className="subtask-edit-save" style={{ maxWidth: '150px' }} onClick={handleSubmit}>Save</a>
            <a className="subtask-edit-cancel" onClick={onCancelAddSubtask}>Cancel</a>
          </div>
        ) : isEditing ? (
          // Edit mode with input fields for title and description
          <div className="subtask-edit-form">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <hr className="subtask-divider-horizontal" />
            <a className="subtask-edit-save" onClick={handleSave}>Save</a>
            <a className="subtask-edit-cancel" onClick={() => setIsEditing(false)}>Cancel</a>
          </div>
        ) : (
          // Display mode with text and an edit button
          <div className="subtask-content">
            {!completed && (
              <a className="subtask-delete" onClick={() => deleteSubTask(taskItemId, id)}>
                <span className="subtask-delete-x">X</span>
              </a>
            )}
            <div className="subtask-text">
              <div className="subtask-title">
                <h4>{title}</h4>
                <span className="subtask-updated-at">{updatedAt ? formatUpdatedAt(updatedAt) : 'N/A'}</span>
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
              {!completed && (
                  <a className="subtask-mark-complete" onClick={() => toggleSubtaskComplete(taskItemId, id)}>
                    <BsCheckCircle />
                  </a>
                )}
              <hr className="subtask-divider-horizontal" />
              <div className="subtask-action">
                <a className="subtask-edit" onClick={() => handleEdit()}>Edit</a>
              </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SubTaskItem;
