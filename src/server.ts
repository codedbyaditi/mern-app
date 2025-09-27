import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, getDBState } from './db';
import UserModel from './models/user';
import TaskModel from './models/task';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3001"],
    },
  },
}));

// Configure CORS to allow the frontend dev server(s) and the configured CLIENT_URL.
// In development Vite may pick another port (3000 or 3001). Use a dynamic origin check.
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // If no origin (e.g., server-to-server or curl), allow it
    if (!origin) return callback(null, true);

    const allowedOrigins = new Set<string>();
    if (process.env.CLIENT_URL) allowedOrigins.add(process.env.CLIENT_URL);
    // Common frontend dev ports used by Vite
    allowedOrigins.add('http://localhost:3000');
    allowedOrigins.add('http://localhost:3001');

    if (allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    db: getDBState()
  });
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
  if (getDBState().state === 'connected') {
      const users = await UserModel.find().select('-__v').lean();
      return res.json(users);
    }

    // Fallback sample data if DB not connected
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];
    return res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Tasks endpoints (persisted if DB connected, otherwise fallback to mock)
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    if (getDBState().state === 'connected') {
      const tasks = await TaskModel.find().sort({ createdAt: -1 }).lean();
      return res.json(tasks);
    }

    return res.json([
      { title: 'Define TypeScript interfaces (Mock)', completed: true },
      { title: 'Create React components (Mock)', completed: false }
    ]);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' });

  try {
    if (getDBState().state === 'connected') {
      const created = await TaskModel.create({ title, completed: false });
      return res.status(201).json(created);
    }

    return res.status(201).json({ title, completed: false });
  } catch (err) {
    console.error('Error creating task:', err);
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }

  try {
  if (getDBState().state === 'connected') {
      const existing = await UserModel.findOne({ email }).lean();
      if (existing) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const created = await UserModel.create({ name, email });
      return res.status(201).json({
        id: created._id,
        name: created.name,
        email: created.email,
        createdAt: created.createdAt
      });
    }

    // Fallback (non-persistent)
    const newUser = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    };
    return res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

// Serve static files from the React app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API route not found' });
});

// Start server after attempting DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API available at: http://localhost:${PORT}/api`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`⚛️  Frontend dev server: http://localhost:3000`);
    }
  });
}).catch(err => {
  console.error('Failed to start server due to DB error', err);
  // Still start the server even if DB connection failed
  app.listen(PORT, () => {
    console.log(`🚀 Server running (DB not connected) on port ${PORT}`);
  });
});

export default app;