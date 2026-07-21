function TopNavbar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>

      <div className="topbar-search">
        <span>⌕</span>
        <input type="text" placeholder="Search employees, requests, equipment…" />
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn" title="Settings">⚙</button>
        <button className="topbar-icon-btn" title="Notifications">
          
          <span className="notif-dot">5</span>
        </button>
        <div className="topbar-divider" />
        <div className="topbar-user">
          <div className="topbar-avatar">ZA</div>
          <div className="topbar-user-text">
            <div className="topbar-user-name">Zainab Akhtar</div>
            
          </div>
          <span className="chevron-down">⌄</span>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
