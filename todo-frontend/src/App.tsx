// src/App.tsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TodoItem from './components/TodoItem';
import SubTaskItem from './components/SubTaskItem'; // Import SubTaskItem component
import './App.css';

const socket = io('http://localhost:3000');

interface SubTaskItemData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  taskItemId: number; 
}

interface TodoItemData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  subTasks?: SubTaskItemData[]; 
}

interface DeletedSubTaskItemData {
  taskId: number;
  subTaskId: number;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoItemData[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [addingSubtaskId, setAddingSubtaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodosAndSubtasks = async () => {
      try {
        // Fetch todos
        const todosResponse = await fetch('http://localhost:3000/todos');
        const todosData: TodoItemData[] = await todosResponse.json();

        // Fetch subtasks for each todo
        const todosWithSubtasksPromises = todosData.map(async (todo) => {
          const subtasksResponse = await fetch(`http://localhost:3000/todos/${todo.id}/subtasks`);
          const subtasksData: SubTaskItemData[] = await subtasksResponse.json();
          return { ...todo, subTasks: subtasksData };
        });

        // Resolve all promises and set todos with subtasks
        const todosWithSubtasks = await Promise.all(todosWithSubtasksPromises);
        setTodos(todosWithSubtasks);
      } catch (error) {
        console.error('Failed to fetch todos and subtasks', error);
      }
    };

    fetchTodosAndSubtasks();

    // Set up socket listeners
    const handleNewTodo = (newTodo: TodoItemData) => {
      setTodos(prevTodos => [...prevTodos, { ...newTodo, subTasks: [] }]);
    };

    const handleUpdatedTodo = (updatedTodo: TodoItemData) => {
      setTodos(prevTodos =>
        prevTodos.map(todo => 
          todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
        )
      );
    };

    const handleDeleteTodo = (todoId: number) => {
      console.log(`Handling delete for todo with id: ${todoId}`);
      setTodos(prevTodos =>
        prevTodos.filter(todo => todo.id !== todoId)
      );
    };

    const handleNewSubtask = (newSubtask: SubTaskItemData) => {
      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === newSubtask.taskItemId) {
          const isSubtaskExists = todo.subTasks?.some(subtask => subtask.id === newSubtask.id);
          if (!isSubtaskExists) {
            const updatedSubTasks = [...(todo.subTasks || []), newSubtask];
            return { ...todo, subTasks: updatedSubTasks };
          }
        }
        return todo;
      }));
    };

    const handleUpdatedSubtask = (updatedSubtask: SubTaskItemData) => {
      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (todo.id === updatedSubtask.taskItemId) {
            // Update the subtask within the parent todo's subTasks array
            const updatedSubTasks = todo.subTasks?.map(subtask => 
              subtask.id === updatedSubtask.id ? updatedSubtask : subtask
            );
            return { ...todo, subTasks: updatedSubTasks };
          }
          return todo;
        })
      );
    };
    
    const handleDeleteSubtask = (data: DeletedSubTaskItemData) => {
      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === data.taskId) {
          // Filter out the deleted subtask from the parent todo's subTasks array
          const updatedSubTasks = todo.subTasks?.filter(subtask => subtask.id !== data.subTaskId);
          return { ...todo, subTasks: updatedSubTasks };
        }
        return todo;
      }));
    };

    // Subscribe to socket events
    socket.on('new_todo', handleNewTodo);
    socket.on('update_todo', handleUpdatedTodo);
    socket.on('delete_todo', handleDeleteTodo);
    socket.on('new_subtask', handleNewSubtask);
    socket.on('update_subtask', handleUpdatedSubtask);
    socket.on('delete_subtask', handleDeleteSubtask);

    // Clean up the effect
    return () => {
      socket.off('new_todo', handleNewTodo);
      socket.off('update_todo', handleUpdatedTodo);
      socket.off('delete_todo', handleDeleteTodo);
      socket.off('new_subtask', handleNewSubtask);
      socket.off('update_subtask', handleUpdatedSubtask);
      socket.off('delete_subtask', handleDeleteSubtask);
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
      // Don't update state here; let the socket event handle it
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

  const toggleSubtaskComplete = (taskId: number, subTaskId: number) => {
    // Find the parent task
    const parentTask = todos.find((t: TodoItemData) => t.id === taskId);
    if (!parentTask || !parentTask.subTasks) return;
  
    // Find the subtask within the parent task
    const subtask = parentTask.subTasks.find((st: SubTaskItemData) => st.id === subTaskId);
    if (!subtask) return;
  
    fetch(`http://localhost:3000/todos/${taskId}/subtasks/${subTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !subtask.completed }),
    })
    .then(response => response.json())
    .then(updatedSubtask => {
      setTodos((prevTodos) => prevTodos.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subTasks: t.subTasks?.map(st => {
              if (st.id === subTaskId) {
                return { ...st, completed: updatedSubtask.completed, completedAt: updatedSubtask.completedAt };
              }
              return st;
            }),
          };
        }
        return t;
      }));
    })
    .catch((error) => {
      console.error('Failed to update subtask', error);
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

  const deleteSubTask = (taskId: number, subTaskId: number) => {
    console.log(`Attempting to delete subtask with task id: ${taskId} and subtask id: ${subTaskId}`);
    fetch(`http://localhost:3000/todos/${taskId}/subtasks/${subTaskId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // If the deletion was successful, update the state to remove the subtask
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === taskId) {
            // Filter out the subtask that's being deleted
            const updatedSubtasks = todo.subTasks?.filter(subtask => subtask.id !== subTaskId) ?? [];
            return { ...todo, subTasks: updatedSubtasks };
          }
          return todo;
        }));
        // Emit event to update UI after successful deletion
        socket.emit('delete_subtask', { taskId, subTaskId });
      } else {
        console.error('Failed to delete subtask');
      }
    })
    .catch((error) => {
      console.error('Failed to delete subtask', error);
    });
  };
  
  // Function to toggle showing completed todos
  const toggleShowCompleted = () => {
    setShowCompleted(prevState => !prevState);
  };

  const handleAddSubtaskClick = (taskItemId: number) => {
    setAddingSubtaskId(taskItemId);
  };

  const handleAddSubtaskSubmit = (title: string, description: string, taskItemId: number) => {
    fetch(`http://localhost:3000/todos/${taskItemId}/subtasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }), // Send title and description in the request body
    })
    .then(response => response.json())
    .then(newSubtask => {
      // Emit the new subtask to the server using socket.io
      socket.emit('new_subtask', newSubtask);
    })
    .catch(error => {
      console.error('Failed to add new subtask', error);
    });
  
    setAddingSubtaskId(null); // Hide the subtask addition form once the subtask is submitted
  };

  const handleCancelAddSubtask = () => {
    setAddingSubtaskId(null); // Hide the subtask addition form without adding a subtask
  };

  return (
    <div className="container">
      <div className="summary">
        <p>Total Todos: {todos.length}</p>
        <p>Total Completed: {todos.filter((todo) => todo.completed).length}</p>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={addTodo}>Add Todo</button>
      <button onClick={toggleShowCompleted}>
        {showCompleted ? 'Hide Completed' : 'Show Completed'}
      </button>
  
      {todos.map((todo, index) => {
        // Determine if we should show this item based on completion state and showCompleted toggle
        if (showCompleted || !todo.completed) {
          const isAddingSubtask = addingSubtaskId === todo.id;
  
          return (
            <React.Fragment key={todo.id}>
              {/* Render TodoItem */}
              <TodoItem
                  id={todo.id}
                  title={todo.title}
                  description={todo.description}
                  completed={todo.completed}
                  completedAt={todo.completedAt}
                  onAddSubtask={handleAddSubtaskClick}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                />
  
              {/* Conditionally render the SubTaskItem for adding a new subtask */}
              {isAddingSubtask && (
                <SubTaskItem
                  key={`adding-${todo.id}`}
                  id={-1} // Temporary ID for the new subtask
                  title=""
                  description=""
                  completed={false}
                  taskItemId={todo.id}
                  toggleSubtaskComplete={() => {}} // No-op for new subtask
                  deleteSubTask={() => {}} // No-op for new subtask
                  onAddSubtaskSubmit={handleAddSubtaskSubmit}
                  onCancelAddSubtask={handleCancelAddSubtask}
                />
              )}
  
              {/* Render SubTaskItem if it's a subtask and either uncompleted or we're showing completed items */}
              {todo.subTasks && todo.subTasks.map((subtask) => (
                <SubTaskItem
                  key={`${todo.id}-${subtask.id}`}
                  id={subtask.id}
                  title={subtask.title}
                  description={subtask.description}
                  completed={subtask.completed}
                  completedAt={subtask.completedAt}
                  taskItemId={todo.id}
                  toggleSubtaskComplete={toggleSubtaskComplete}
                  deleteSubTask={deleteSubTask}
                  onCancelAddSubtask={() => {}}
                />
              ))}
            </React.Fragment>
          );
        }
  
        // If we're hiding completed and the item is completed, return null to skip rendering
        return null;
      })}
    </div>
  );
};

export default App;
