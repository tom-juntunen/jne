import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import sequelize from './database';
import { TodoItem } from './models/todo.model';

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
  if (todo) {
    const updatedTodo = await todo.update({ completed });
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
