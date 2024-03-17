import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import sequelize from './database';
import { TodoItem } from './models/todo.model';
import { SubTaskItem } from './models/subtask.model';

const app = express();
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// Create HTTP server and bind it with the Express app
const httpServer = createServer(app);

// Initialize Socket.IO and bind it with the HTTP server
const io = new Server(httpServer, {
  // Add configuration options here...
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  // Listen for updates from clients and broadcast to all connected
  socket.on('update_todo', (todo: TodoItem) => {
    io.emit('update_todo', todo);
  });

  // Listen for delete events from clients and broadcast to all connected
  socket.on('delete_todo', (id: number) => {
    io.emit('delete_todo', id);
  });

  // Listen for updates to subtasks from clients and broadcast to all connected
  socket.on('update_subtask', (subtask: SubTaskItem) => {
    io.emit('update_subtask', subtask);
  });

  // Listen for delete events for subtasks from clients and broadcast to all connected
  socket.on('delete_subtask', (id: number) => {
    io.emit('delete_subtask', id);
  });
});

app.get('/todos', async (req, res) => {
  const todos = await TodoItem.findAll();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  const todo = await TodoItem.create({ title, description });
  res.json(todo);
  io.emit('new_todo', todo); // Emit the new todo to all clients
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const todo = await TodoItem.findByPk(id);
  let updatedTodo;

  if (todo) {
    if (completed && !todo.completedAt) {
      // Set completedAt if todo is being marked as completed for the first time
      updatedTodo = await todo.update({ completed, completedAt: new Date() });
    } else {
      updatedTodo = await todo.update({ completed });
    }
    res.json(updatedTodo);
    io.emit('update_todo', updatedTodo); // Emit the update to all clients
  } else {
    res.status(404).send('Todo not found');
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const numDeleted = await TodoItem.destroy({
    where: { id }
  });

  if (numDeleted) {
    res.status(200).send({ message: `Deleted todo with id ${id}` });
    io.emit('delete_todo', id); // Emit the delete to all connected clients
  } else {
    res.status(404).send('Todo not found');
  }
});

// CRUD operations for subtasks
app.get('/todos/:taskId/subtasks', async (req, res) => {
  const { taskId } = req.params;
  const subtasks = await SubTaskItem.findAll({ where: { taskItemId: taskId } });
  res.json(subtasks);
});

app.post('/todos/:taskId/subtasks', async (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;
  const taskItemId: number = parseInt(taskId);
  const subtask = await SubTaskItem.create({ title, description, taskItemId });
  res.json(subtask);
  io.emit('new_subtask', subtask); // Emit the new subtask to all clients
});

app.put('/todos/:taskId/subtasks/:subTaskId', async (req, res) => {
  const { taskId, subTaskId } = req.params;
  const updates = req.body; // This now contains all fields that might be updated

  try {
    const subtask = await SubTaskItem.findOne({ where: { id: subTaskId, taskItemId: taskId } });

    if (!subtask) {
      return res.status(404).send('Subtask not found');
    }

    // If the 'completed' field is being updated and it's being set to true,
    // and if the subtask wasn't already marked as completed, update the completedAt field as well.
    if (updates.completed && !subtask.completedAt) {
      updates.completedAt = new Date();
    }

    const updatedSubtask = await subtask.update(updates);
    res.json(updatedSubtask);
    io.emit('update_subtask', updatedSubtask); // Notify all clients about the update
  } catch (error) {
    console.error('Error updating the subtask:', error);
    res.status(500).send('Error updating the subtask');
  }
});

app.delete('/todos/:taskId/subtasks/:subTaskId', async (req, res) => {
  const { taskId, subTaskId } = req.params;
  const numDeleted = await SubTaskItem.destroy({ where: { id: subTaskId, taskItemId: taskId } });
  if (numDeleted) {
    res.status(200).send({ message: `Deleted subtask with id ${subTaskId}` });
    io.emit('delete_subtask', { taskId, subTaskId }); // Emit the delete to all connected clients
  } else {
    res.status(404).send('Subtask not found');
  }
});


// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error: Error) => {
  console.error('Error syncing database:', error.message);
});
