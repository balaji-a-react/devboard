import { useReducer, useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Task, TaskAction } from '../types';

function reducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'TOGGLE':
      return state.map((t) => t.id === action.payload ? { ...t, done: !t.done } : t);
    case 'DELETE':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

function Tasks() {
  const [saved, setSaved] = useLocalStorage<Task[]>('devboard-tasks', []);
  const [tasks, dispatch] = useReducer(reducer, saved);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Task['priority']>("medium");
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const filtered = useMemo(() => {
    if (filter === 'pending') return tasks.filter((t) => !t.done);
    if (filter === 'done') return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  function addTask() {
    if (!text.trim()) return;
    const newTask: Task = { id: Date.now(), text: text.trim(), priority, done: false };
    const updated = [...tasks, newTask];
    dispatch({ type: 'ADD', payload: newTask });
    setSaved(updated);
    setText('');
  }

  function toggleTask(id: number) {
    dispatch({ type: 'TOGGLE', payload: id });
    setSaved(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id: number) {
    dispatch({ type: 'DELETE', payload: id });
    setSaved(tasks.filter((t) => t.id !== id));
  }

  const badgeColors: Record<Task['priority'], { bg: string; color: string }> = {
    high: { bg: '#FCEBEB', color: '#A32D2D' },
    medium: { bg: '#FAEEDA', color: '#854F0B' },
    low: { bg: '#EAF3DE', color: '#3B6D11' },
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' }}>Task Manager</h1>

      <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: '1rem 1.25rem' }}>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a task..."
            style={{ flex: 1, padding: '8px 12px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 14 }}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            style={{ padding: '8px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 13 }}
          >
            <option value="high">High</option>
            <option value="med">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={addTask}
            style={{ padding: '8px 16px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
          >
            + Add
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          {(['all', 'pending', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 12px', border: '0.5px solid #ccc', borderRadius: 8,
                fontSize: 13, cursor: 'pointer',
                fontWeight: filter === f ? 500 : 400,
                background: filter === f ? '#f0f0f0' : 'none',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: '1.5rem 0' }}>
            No tasks here. Add one above!
          </div>
        ) : (
          filtered.map((task) => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid #f0f0f0' }}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span style={{ flex: 1, fontSize: 14, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#aaa' : 'inherit' }}>
                {task.text}
              </span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 500, background: badgeColors[task.priority].bg, color: badgeColors[task.priority].color }}>
                {task.priority === 'medium' ? 'Medium' : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ fontSize: 12, color: '#A32D2D', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;