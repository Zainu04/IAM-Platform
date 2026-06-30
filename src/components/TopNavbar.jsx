import { Bell, Search, Settings, UserCircle } from 'lucide-react';

function TopNavbar({ title }) {
  return (
    <header className="top-navbar">
      <div>
        <h1>{title}</h1>
        <p>Automated IT Onboarding & Offboarding Management System</p>
      </div>

      <div className="top-actions">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search..." />
        </div>
        <button className="icon-button" aria-label="Settings"><Settings size={18} /></button>
        <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
        <div className="user-chip">
          <UserCircle size={22} />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
