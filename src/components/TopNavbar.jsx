import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function TopNavbar({
  employees,
  notifications,
  currentUser,
  openEmployee,
  navigate,
}) {
  const [q, setQ] = useState("");
  const [showN, setShowN] = useState(false);
  const [showP, setShowP] = useState(false);

  const nref = useRef();
  const pref = useRef();

  useEffect(() => {
    const h = (e) => {
      if (nref.current && !nref.current.contains(e.target)) {
        setShowN(false);
      }

      if (pref.current && !pref.current.contains(e.target)) {
        setShowP(false);
      }
    };

    document.addEventListener("mousedown", h);

    return () => document.removeEventListener("mousedown", h);
  }, []);

  const results = q
    ? employees.filter((e) =>
        (e.name + e.role).toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="topbar">
      {/* Search */}
      <div className="search-box">
        <Search />

        <input
          placeholder="Search employees, requests, equipment..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {q && (
          <div className="search-results">
            {results.map((r) => (
              <button
                key={r.id}
                className="search-result-row"
                onClick={() => {
                  openEmployee(r);
                  setQ("");
                }}
              >
                <img src={r.avatar} />

                <div>
                  <strong>{r.name}</strong>
                  <small>{r.role}</small>
                </div>
              </button>
            ))}

            {!results.length && (
              <div className="search-empty">
                No matches for "{q}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="topbar-right">

        {/* Notifications */}
        <div ref={nref} className="relative">
          <button
            className="bell-btn"
            onClick={() => {
              setShowN(!showN);
              setShowP(false);
            }}
          >
            <Bell />

            {unread > 0 && (
              <span className="bell-badge">{unread}</span>
            )}
          </button>

          {showN && (
            <div className="dropdown-panel">
              <h4>Notifications</h4>

              {notifications.slice(0, 4).map((n) => (
                <div className="notif-row" key={n.id}>
                  <p>{n.text}</p>
                  <span>{n.time}</span>
                </div>
              ))}

              <button
                className="menu-item"
                onClick={() => navigate("/notifications")}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={pref} className="relative">
          <button
            className="greeting-btn"
            onClick={() => {
              setShowP(!showP);
              setShowN(false);
            }}
          >
            <span className="greeting">
              Good morning, {currentUser.firstName} 👋
            </span>

            <img src={currentUser.avatar} />

            <ChevronDown className="chev" />
          </button>

          {showP && (
            <div className="dropdown-panel">
              <button
                className="menu-item"
                onClick={() => navigate("/settings")}
              >
                <User />
                View profile
              </button>

              <button
                className="menu-item"
                onClick={() => navigate("/settings")}
              >
                <Settings />
                Settings
              </button>

              <button
                className="menu-item"
                onClick={() => setShowP(false)}
              >
                <LogOut />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}