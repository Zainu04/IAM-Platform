import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserX,
  Laptop,
  ShieldCheck,
  KeyRound,
  Bell,
  BarChart3,
  Settings
} from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/onboarding', label: 'Onboarding', icon: UserPlus },
  { to: '/offboarding', label: 'Offboarding', icon: UserX },
  { to: '/equipment', label: 'Equipment Inventory', icon: Laptop },
  { to: '/department-access', label: 'Department Access', icon: ShieldCheck },
  { to: '/access-requests', label: 'Access Requests', icon: KeyRound },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">IT</div>
        <div>
          <strong>IT Management</strong>
          <span>System</span>
        </div>
      </div>

      <nav className="nav-list">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
