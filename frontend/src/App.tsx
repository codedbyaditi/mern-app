import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Task {
  _id?: string;
  title: string;
  completed: boolean;
  createdAt?: string;
}

interface Health {
  status: string;
  message: string;
  timestamp: string;
  environment: string;
  db?: any;
}

const API_BASE = '';// use relative paths; Vite proxy or same-origin will handle API

export default function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetchHealth();
    fetchTasks();
  }, []);

  async function fetchHealth() {
    try {
      const res = await axios.get(`${API_BASE}/api/health`);
      setHealth(res.data);
    } catch (err) {
      console.error('health error', err);
      setHealth(null);
    }
  }

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await axios.get<Task[]>(`${API_BASE}/api/tasks`);
      setTasks(res.data || []);
      setError(null);
    } catch (err) {
      console.error('fetch tasks error', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function addTask(e?: React.FormEvent) {
    e?.preventDefault();
    if (!newTitle.trim()) return setError('Please enter a title');

    try {
      setError(null);
      const res = await axios.post<Task>(`${API_BASE}/api/tasks`, { title: newTitle });
      setTasks(prev => [res.data, ...prev]);
      setNewTitle('');
    } catch (err) {
      console.error('create task error', err);
      setError('Failed to create task');
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tasks — Modern TS App</h1>
        {health ? (
          <div className="health-status">
            <strong>{health.message}</strong> — DB: {health.db?.state || 'unknown'}
          </div>
        ) : (
          <div className="health-status">No health info</div>
        )}
      </header>

      <main className="App-main">
        <div className="container">
          <section className="user-form">
            <h2>Add Task</h2>
            <form onSubmit={addTask}>
              <div className="form-group">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Task title"
                />
              </div>
              <button className="submit-btn" type="submit">Add Task</button>
            </form>
          </section>

          <section className="users-list">
            <h2>Tasks</h2>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : (
              <div className="users-grid">
                {tasks.map(t => (
                  <div key={t._id || t.title + t.createdAt} className="user-card">
                    <h3>{t.title}</h3>
                    <p>{t.completed ? '✅ Completed' : '⏳ Pending'}</p>
                    {t.createdAt && <small>Created: {new Date(t.createdAt).toLocaleString()}</small>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="App-footer">
        <p>Built with ❤️ using TypeScript, React, Express</p>
      </footer>
    </div>
  );
}