import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, Users, UserRound } from "lucide-react";

export default function Orientation() {
  const c = useOutletContext();
  const upcoming = useMemo(() => c.employees.filter((employee) => employee.type === "onboarding" && employee.progress < 100), [c.employees]);

  return (
    <div className="page-content role-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">HR workspace</p>
          <h1>Orientation Planning</h1>
          <p>Coordinate first-day sessions without exposing technical administration tools.</p>
        </div>
        <button className="btn-primary" onClick={() => c.scheduleOrientation()}>
          <CalendarDays /> Schedule orientation
        </button>
      </div>

      <div className="role-metric-grid compact">
        <Metric icon={CalendarDays} value={upcoming.length} label="Upcoming starts" />
        <Metric icon={Clock3} value={upcoming.filter((employee) => employee.steps?.some((step) => step.id === "schedule-orientation" && !step.done)).length} label="Need scheduling" />
        <Metric icon={Users} value={upcoming.filter((employee) => employee.steps?.some((step) => step.id === "schedule-orientation" && step.done)).length} label="Scheduled" />
      </div>

      <div className="data-card">
        <div className="data-card-header"><h2>First-day schedule</h2><span className="pill gold">HR owned</span></div>
        {upcoming.map((employee) => {
          const step = employee.steps?.find((item) => item.id === "schedule-orientation");
          const done = Boolean(step?.done);
          const details = step?.details || {};
          return (
            <div className="orientation-row" key={employee.id}>
              <div className="date-badge">
                <strong>{new Date(employee.startDate).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</strong>
                <span>{new Date(employee.startDate).getDate()}</span>
              </div>
              <div className="orientation-person">
                <strong>{employee.name}</strong>
                <span>{employee.role} · {employee.department}</span>
                {done && (
                  <div className="orientation-details">
                    <small><Clock3 /> {details.date} at {details.time}</small>
                    <small><MapPin /> {details.location}</small>
                    <small><UserRound /> Hosted by {details.host}</small>
                  </div>
                )}
              </div>
              <span className={`pill ${done ? "green" : "gold"}`}>{done ? "Scheduled" : "Needs scheduling"}</span>
              <button className={done ? "btn-secondary" : "btn-primary"} onClick={() => c.scheduleOrientation(employee.id)}>
                {done ? "Edit details" : "Schedule"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, value, label }) {
  return <div className="role-metric-card"><div className="metric-icon"><Icon /></div><strong>{value}</strong><span>{label}</span></div>;
}
