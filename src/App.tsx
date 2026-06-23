import { Routes, Route, NavLink } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import Dashboard from './pages/Dashboard'
import GitHub from './pages/GitHub'
import Tasks from './pages/Tasks'

function App() {
  const { isDark, toggleTheme } = useTheme()

  const navStyle = {
    width: 220,
    flexShrink: 0,
    background: isDark ? '#1a1a1a' : '#ffffff',
    borderRight: '0.5px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '1rem 0',
    height: '100vh',
  }

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 1.25rem',
    fontSize: 14,
    color: isDark ? '#aaa' : '#666',
    textDecoration: 'none',
    borderRadius: 0,
    transition: 'background 0.15s',
  }

  const activeLinkStyle = {
    ...linkStyle,
    background: isDark ? '#2a2a2a' : '#f5f5f5',
    color: isDark ? '#fff' : '#111',
    fontWeight: 500,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: isDark ? '#111' : '#f9f9f9' }}>

      {/* Sidebar */}
      <nav style={navStyle}>
        <div style={{ padding: '0 1.25rem 1rem', fontWeight: 500, fontSize: 17, borderBottom: '0.5px solid #e0e0e0', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          🗂 DevBoard
        </div>

        {[
          { to: '/', label: '🏠 Dashboard' },
          { to: '/github', label: '🐙 GitHub Search' },
          { to: '/tasks', label: '✅ Task Manager' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
          >
            {label}
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', padding: '1rem 1.25rem', borderTop: '0.5px solid #e0e0e0' }}>
          <button
            onClick={toggleTheme}
            style={{ fontSize: 13, background: 'none', border: '0.5px solid #ccc', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: isDark ? '#aaa' : '#666', width: '100%' }}
          >
            {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/github" element={<GitHub />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </main>

    </div>
  )
}

export default App