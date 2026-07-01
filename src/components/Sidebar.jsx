import { NavLink } from 'react-router-dom';

const navSections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/', icon: '▦' },
      { name: 'Employees', path: '/employees', icon: '◉' }
    ]
  },
  {
    label: 'Lifecycle',
    items: [
      { name: 'Onboarding', path: '/onboarding', icon: '+', count: '4' },
      { name: 'Offboarding', path: '/offboarding', icon: '−', count: '1', tone: 'warn' }
    ]
  },
  {
    label: 'Resources',
    items: [
      { name: 'Equipment Inventory', path: '/equipment', icon: '▣' },
      { name: 'Department Access', path: '/department-access', icon: '▤' }
    ]
  },
  {
    label: 'Requests',
    items: [
      { name: 'Access Requests', path: '/access-requests', icon: '□', count: '3', tone: 'alert' },
      { name: 'Notifications', path: '/notifications', icon: '✉' }
    ]
  },
  {
    label: 'Admin',
    items: [
      { name: 'Reports', path: '/reports', icon: '▥' },
      { name: 'Settings', path: '/settings', icon: '⚙' }
    ]
  }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-mark">盾</div>
        <div className="sb-logo-text">
          AccessFlow
          <span>IT ONBOARDING PLATFORM</span>
        </div>
      </div>

      <nav className="sb-nav">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="sb-section-label">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `sb-item ${isActive ? 'active' : ''}`}
              >
                <span className="sb-icon">{item.icon}</span>
                {item.name}
                {item.count && <span className={`sb-badge ${item.tone || ''}`}>{item.count}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-user-avatar">ZA</div>
        <div className="sb-user-info">
          <div className="sb-user-name">Zainab Akhtar</div>
        </div>
        <span className="sb-arrow">›</span>
      </div>
    </aside>
  );
}

export default Sidebar;
