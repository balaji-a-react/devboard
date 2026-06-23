import { useState, useRef, useCallback } from 'react';
import useGitHubSearch from '../hooks/useGitHubSearch';
import { useBookmarks } from '../context/BookmarkContext';

function GitHub() {
  const [query, setQuery] = useState('');
  const { user, repos, loading, error, search } = useGitHubSearch();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = useCallback((val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (val.trim()) search(val.trim());
    }, 600);
  }, [search]);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: '1.5rem' }}>GitHub Search</h1>

      {/* Search */}
      <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search a GitHub username..."
            style={{ flex: 1, padding: '8px 12px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 14 }}
          />
          <button
            onClick={() => search(query)}
            style={{ padding: '8px 16px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
          >
            Search
          </button>
        </div>

        {loading && <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Fetching...</div>}
        {error && <div style={{ fontSize: 13, color: '#A32D2D', marginTop: 8 }}>{error}</div>}

        {/* Profile */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '1rem', paddingTop: '1rem', borderTop: '0.5px solid #f0f0f0' }}>
            <img src={user.avatar_url} alt={user.login} style={{ width: 52, height: 52, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{user.name || user.login}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{user.bio || `@${user.login}`}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                {[
                  { label: 'followers', value: user.followers },
                  { label: 'following', value: user.following },
                  { label: 'repos', value: user.public_repos },
                ].map((s) => (
                  <span key={s.label} style={{ fontSize: 12, color: '#888' }}>
                    <strong style={{ color: '#111' }}>{s.value}</strong> {s.label}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => isBookmarked(user.login) ? removeBookmark(user.login) : addBookmark(user)}
              style={{ padding: '7px 14px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
            >
              {isBookmarked(user.login) ? '★ Saved' : '☆ Save'}
            </button>
          </div>
        )}
      </div>

      {/* Repos */}
      {repos.length > 0 && (
        <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: '1rem' }}>Repositories</div>
          {repos.map((repo) => (
            <div key={repo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #f0f0f0' }}>
              <div>
                <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 500, color: '#185FA5', textDecoration: 'none' }}>
                  {repo.name}
                </a>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{repo.description?.slice(0, 70) || 'No description'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: '#888' }}>★ {repo.stargazers_count}</span>
                {repo.language && (
                  <span style={{ fontSize: 11, background: '#f0f0f0', padding: '2px 8px', borderRadius: 999 }}>{repo.language}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GitHub;