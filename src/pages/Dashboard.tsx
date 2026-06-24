import { useBookmarks } from '../context/BookmarkContext';
import { useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Task } from '../types';

function Dashboard() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [tasks] = useLocalStorage<Task[]>('devboard-tasks', []);

  const stats = useMemo(() => ({
    open: tasks.filter((t) => !t.done).length,
    done: tasks.filter((t) => t.done).length,
    total: tasks.length,
    percent: tasks.length
      ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
      : 0,
  }), [tasks]);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' }}>
        Dashboard
      </h1>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        {[
          { label: 'Open tasks', value: stats.open },
          { label: 'Completed', value: stats.done },
          { label: 'Bookmarks', value: bookmarks.length },
          { label: 'Progress', value: `${stats.percent}%` },
        ].map((m) => (
          <div key={m.label} style={{ background: 'var(--color-bg-secondary, #f5f5f5)', borderRadius: 8, padding: '1rem' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 500 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div style={{ marginBottom: '1.5rem', background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>Weekly progress</div>
          <div style={{ height: 6, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${stats.percent}%`, background: '#3B6D11', borderRadius: 999, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>{stats.done} of {stats.total} tasks done</div>
        </div>
      )}

      {/* Bookmarks */}
      <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: '1rem 1.25rem' }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Saved profiles</div>
        {bookmarks.length === 0 ? (
          <div style={{ color: '#888', fontSize: 13, textAlign: 'center', padding: '1.5rem 0' }}>
            No bookmarks yet - search a GitHub user and save them.
          </div>
        ) : (
          bookmarks.map((b) => (
            <div key={b.login} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid #f0f0f0' }}>
              <img src={b.avatar_url} alt={b.login} style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{b.name || b.login}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{b.bio || `@${b.login}`}</div>
              </div>
              <button
                onClick={() => removeBookmark(b.login)}
                style={{ fontSize: 12, color: '#A32D2D', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;