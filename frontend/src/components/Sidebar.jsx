import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { to: '/', label: '🏠 Dashboard', end: true },
  { to: '/plants', label: '🌿 My Plants' },
  { to: '/plants/new', label: '➕ Add Plant' },
  { to: '/schedule', label: '💧 Care Schedule' },
  { to: '/history', label: '📋 Care History' },
  { to: '/guide', label: '📖 Plant Guide' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🌱</span>
        <div>
          <div className="sidebar-title">PlantCare</div>
          <div className="sidebar-subtitle">Virtual Plant Manager</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>🌍 OOP Course Project</p>
        <p>Java Spring Boot + React</p>
      </div>
    </aside>
  );
}
