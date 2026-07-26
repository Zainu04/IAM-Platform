import { useOutletContext } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Clock3, Laptop, ListChecks, Mail,
  ShieldCheck, TriangleAlert, FileText, CalendarDays, Archive,
  FileStack, MessageSquare, PartyPopper,
} from "lucide-react";
import { getTaskRoute } from "../utils/taskRouting.js";
import { roleLabel } from "../utils/roles.js";

const ACTION_ICON = {
  EQUIPMENT_ASSIGNED: Laptop,
  EQUIPMENT_COLLECTED: Laptop,
  ACCESS_PROVISIONED: ShieldCheck,
  ACCESS_REVOKED: ShieldCheck,
  DOCUMENTS_APPROVED: FileText,
  WELCOME_SENT: Mail,
  ORIENTATION_SCHEDULED: CalendarDays,
  TEAMS_NOTIFIED: Mail,
  FILES_TRANSFERRED: FileStack,
  EXIT_INTERVIEW_COMPLETED: MessageSquare,
  EMPLOYEE_ARCHIVED: Archive,
};

const ACTION_CTA = {
  EQUIPMENT_ASSIGNED: "Go assign equipment",
  EQUIPMENT_COLLECTED: "Go collect equipment",
  ACCESS_PROVISIONED: "Go provision access",
  ACCESS_REVOKED: "Go revoke access",
  DOCUMENTS_APPROVED: "Go review documents",
  ORIENTATION_SCHEDULED: "Go schedule it",
};

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="role-metric-card">
      <div className="metric-icon"><Icon /></div>
      <strong>{value}</strong><span>{label}</span>
    </div>
  );
}

function TaskCard({ task, employees, onGo }) {
  const Icon = ACTION_ICON[task.actionType] || ListChecks;
  const overdue = !task.done && task.dueDate && new Date(task.dueDate) < new Date();
  return (
    <div className={`task-fun-card ${task.done ? "task-fun-card-done" : ""}`}>
      <div className={`task-fun-icon priority-${(task.priority || "Medium").toLowerCase()}`}><Icon /></div>
      <div className="task-fun-body">
        <strong>{task.label}</strong>
        <span>{task.subLabel} · Due {task.dueDate || "not set"}</span>
      </div>
      <div className="task-fun-side">
        {task.done ? (
          <span className="pill green"><CheckCircle2 size={13} /> Complete</span>
        ) : (
          <>
            <span className={`pill ${overdue ? "red" : task.priority === "High" ? "rose" : "gold"}`}>
              {overdue ? "Overdue" : task.priority || "Open"}
            </span>
            <button className="btn-primary task-fun-cta" onClick={() => onGo(task)}>
              {ACTION_CTA[task.actionType] || "Go complete it"} <ArrowRight size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Tasks() {
  const c = useOutletContext();
  const myRole = c.currentUser.role;
  const tasks = c.tasks.filter((t) => !myRole || t.assignedRole === myRole);
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  const overdue = open.filter((t) => t.dueDate && new Date(t.dueDate) < new Date());

  function goTo(task) {
    c.navigate(getTaskRoute(task, c.employees));
  }

  return (
    <div className="page-content role-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">My workspace</p>
          <h1>{(myRole && roleLabel(myRole)) || "My"} Tasks</h1>
          <p>Everything on your plate — tap a card and we'll take you straight to where it gets done.</p>
        </div>
      </div>

      <div className="role-metric-grid compact">
        <Metric icon={ListChecks} value={tasks.length} label="Total tasks" />
        <Metric icon={Clock3} value={open.length} label="Open" />
        <Metric icon={TriangleAlert} value={overdue.length} label="Overdue" />
        <Metric icon={CheckCircle2} value={done.length} label="Completed" />
      </div>

      <div className="data-card">
        <div className="data-card-header"><h2>Needs your attention</h2></div>
        {open.length ? (
          <div className="task-fun-grid">
            {open.map((task) => <TaskCard key={task.id} task={task} employees={c.employees} onGo={goTo} />)}
          </div>
        ) : (
          <div className="empty-state"><PartyPopper /> All caught up — nothing open right now.</div>
        )}
      </div>

      {done.length > 0 && (
        <div className="data-card section-gap">
          <div className="data-card-header"><h2>Recently completed</h2></div>
          <div className="task-fun-grid">
            {done.slice(0, 6).map((task) => <TaskCard key={task.id} task={task} employees={c.employees} onGo={goTo} />)}
          </div>
        </div>
      )}
    </div>
  );
}
