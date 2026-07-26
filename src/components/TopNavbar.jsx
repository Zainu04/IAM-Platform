import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";

export default function TopNavbar({
  employees,
  notifications,
  currentUser,
  openEmployee,
  navigate,
  signOut,
}) {
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const results = query
    ? employees.filter((employee) =>
        `${employee.name} ${employee.role} ${employee.department}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : [];

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  function closeMenus() {
    setShowNotifications(false);
    setShowProfile(false);
  }

  return (
    <header className="topbar">
      <div className="search-box">
        <Search aria-hidden="true" />
        <input
          type="search"
          placeholder="Search employees, requests, equipment..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search JourneyOne"
        />

        {query && (
          <div className="search-results">
            {results.map((employee) => (
              <button
                type="button"
                key={employee.id}
                className="search-result-row"
                onClick={() => {
                  openEmployee(employee);
                  setQuery("");
                }}
              >
                <img src={employee.avatar} alt="" />
                <div>
                  <strong>{employee.name}</strong>
                  <small>{employee.role}</small>
                </div>
              </button>
            ))}

            {!results.length && (
              <div className="search-empty">No matches for “{query}”</div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-right">
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            className="bell-btn"
            aria-label="Open notifications"
            onClick={() => {
              setShowNotifications((current) => !current);
              setShowProfile(false);
            }}
          >
            <Bell />
            {unreadCount > 0 && (
              <span className="bell-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-panel notification-dropdown">
              <h4>Notifications</h4>
              {notifications.slice(0, 4).map((notification) => (
                <div className="notif-row" key={notification.id}>
                  <p>{notification.text}</p>
                  <span>{notification.time}</span>
                </div>
              ))}
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  closeMenus();
                  navigate("/notifications");
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            className="profile-trigger"
            aria-label="Open profile menu"
            aria-expanded={showProfile}
            onClick={() => {
              setShowProfile((current) => !current);
              setShowNotifications(false);
            }}
          >
            {currentUser.avatar ? <img src={currentUser.avatar} alt="" /> : <span className="profile-initials" aria-hidden="true">{currentUser.name?.split(" ").map((part) => part[0]).slice(0,2).join("")}</span>}
            <span className="profile-trigger-text">
              <strong>{currentUser.name}</strong>
              <small>{currentUser.title}</small>
            </span>
            <ChevronDown className="chev" />
          </button>

          {showProfile && (
            <div className="dropdown-panel profile-dropdown">
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  closeMenus();
                  navigate("/settings");
                }}
              >
                <User />
                View profile
              </button>
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  closeMenus();
                  navigate("/settings");
                }}
              >
                <Settings />
                Settings
              </button>
              <button
                type="button"
                className="menu-item sign-out-item"
                onClick={() => {
                  closeMenus();
                  signOut();
                }}
              >
                <LogOut />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
