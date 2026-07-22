import { useOutletContext } from "react-router-dom";
import {
  UserPlus, LogOut, ShieldCheck, BarChart2, ArrowRight, Laptop,
  FileText, Briefcase, Clock3, Users, CalendarDays, ClipboardCheck,
  MonitorCheck, KeyRound, TriangleAlert, ScrollText, Activity,
  CircleCheckBig, GraduationCap, UserCheck, Flag, Play, ListChecks
} from "lucide-react";
import { getTaskRoute } from "../utils/taskRouting.js";

const roleCopy = {
  IT_MANAGER: {
    eyebrow: "",
    title: "Good morning",
    subtitle: "Here's what needs your attention today."
  },
  HR_MANAGER: {
    eyebrow: "People operations workspace",
    title: "Welcome back",
    subtitle: "Coordinate employee arrivals, departures, documents, and orientation from one place."
  },
  AUDITOR: {
    eyebrow: "Compliance workspace",
    title: "Compliance overview",
    subtitle: "Review system activity, audit evidence, and workflow quality in a read-only workspace."
  }
};

function MetricCard({ icon: Icon, value, label, note }) {
  return (
    <div className="card role-metric-card">
      <div className="role-metric-icon"><Icon /></div>
      <div><strong>{value}</strong><span>{label}</span>{note && <small>{note}</small>}</div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, onClick }) {
  return (
    <button className="qa-card" onClick={onClick}>
      <div className="qa-icon rose"><Icon /></div>
      <div><p className="qa-title">{title}</p><p className="qa-desc">{description}</p></div>
      <span className="qa-arrow maroon"><ArrowRight /></span>
    </button>
  );
}

function Section({ title, action, children }) {
  return (
    <section className="card role-section">
      <div className="card-head">
        <h3 className="section-title no-margin">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function TaskList({ tasks, empty = "No tasks need your attention.", onOpen }) {
  if (!tasks.length) return <div className="empty-state">{empty}</div>;
  return tasks.slice(0, 5).map((task) => {
    const Row = onOpen ? "button" : "div";
    return (
      <Row className={`role-list-row ${onOpen ? "role-list-button" : ""}`} key={task.id} onClick={onOpen ? () => onOpen(task) : undefined}>
        <div className="role-list-icon"><ClipboardCheck /></div>
        <div className="role-list-body"><strong>{task.label}</strong><span>{task.assignedRole || task.subLabel}</span></div>
        <span className={`priority-badge ${task.priority || "Medium"}`}>{task.status === "COMPLETED" || task.done ? "Complete" : task.priority || "Open"}</span>
        {onOpen && <span className="qa-arrow maroon task-row-arrow"><ArrowRight /></span>}
      </Row>
    );
  });
}

function JourneyList({ employees, onOpen, type }) {
  const list = employees.filter((e) => e.type === type && e.progress < 100).slice(0, 4);
  if (!list.length) return <div className="empty-state">No active {type} journeys.</div>;
  return list.map((employee) => (
    <button className="role-list-row role-list-button" key={employee.id} onClick={() => onOpen(employee)}>
      <div className="person-avatar-fallback">{employee.name.split(" ").map((p) => p[0]).join("").slice(0,2)}</div>
      <div className="role-list-body"><strong>{employee.name}</strong><span>{employee.role} · {employee.department}</span></div>
      <div className="mini-progress"><span>{employee.progress}%</span><div><i style={{width:`${employee.progress}%`}} /></div></div>
    </button>
  ));
}

function ITDashboard({ c }) {
  const openItTasks = c.tasks.filter((task) => /IT Manager/i.test(task.assignedRole || "") && !task.done && task.status !== "COMPLETED");
  const pendingAccess = c.accessRequests.filter((request) => request.status === "Pending");
  const availableEquipment = c.equipment.filter((item) => item.status === "Available");
  const accountTasks = openItTasks.filter((task) => ["ACCESS_PROVISIONED", "ACCESS_REVOKED"].includes(task.actionType));
  const accountEmployees = new Set(accountTasks.map((task) => task.employeeId).filter(Boolean));

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const tasksDueToday = openItTasks.filter((task) => !task.dueDate || new Date(task.dueDate) <= today);
  const featuredJourneyNames = ["Blaire Willow", "Elizabeth Melody", "Carter Johnson"];
  const journeyTasks = [...openItTasks]
    .sort((a, b) => {
      const aEmployee = c.employees.find((employee) => employee.id === a.employeeId);
      const bEmployee = c.employees.find((employee) => employee.id === b.employeeId);
      const aFeatured = featuredJourneyNames.indexOf(aEmployee?.name);
      const bFeatured = featuredJourneyNames.indexOf(bEmployee?.name);
      if (aFeatured !== -1 || bFeatured !== -1) {
        if (aFeatured === -1) return 1;
        if (bFeatured === -1) return -1;
        return aFeatured - bFeatured;
      }
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    })
    .slice(0, 3);

  const statCards = [
    {
      icon: Laptop,
      value: availableEquipment.length,
      label: availableEquipment.length === 1 ? "Device" : "Devices",
      detail: "waiting to be assigned",
      button: "Go to Equipment",
      path: "/equipment",
      tone: "rose",
    },
    {
      icon: ShieldCheck,
      value: pendingAccess.length,
      label: "Access Requests",
      detail: "pending your review",
      button: "Review Requests",
      path: "/access-requests",
      tone: "gold",
    },
    {
      icon: Users,
      value: accountEmployees.size,
      label: accountEmployees.size === 1 ? "Account" : "Accounts",
      detail: "need your attention",
      button: "Go to Accounts",
      path: "/accounts",
      tone: "violet",
    },
    {
      icon: ClipboardCheck,
      value: tasksDueToday.length,
      label: "IT Tasks",
      detail: "assigned for today",
      button: "View IT Tasks",
      path: "/tasks",
      tone: "green",
    },
  ];

  const getEmployee = (task) => c.employees.find((employee) => employee.id === task.employeeId);
  const formatDueDate = (task) => {
    if (!task.dueDate) return "Ready when you are";
    const due = new Date(task.dueDate);
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const tomorrow = new Date(startToday);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (due < startToday) return "Overdue";
    if (due < tomorrow) return "Due today";
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);
    if (due < nextDay) return "Due tomorrow";
    return `Due ${due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  };

  return (
    <div className="it-dashboard-v2">
      <div className="it-stat-grid">
        {statCards.map(({ icon: Icon, value, label, detail, button, path, tone }) => (
          <article className={`it-stat-card ${tone}`} key={label}>
            <div className="it-stat-content">
              <div className="it-stat-icon"><Icon /></div>
              <div className="it-stat-copy">
                <strong>{value}</strong>
                <h2>{label}</h2>
                <p>{detail}</p>
              </div>
            </div>
            <button className="it-card-action" onClick={() => c.navigate(path)}>
              {button}<ArrowRight />
            </button>
          </article>
        ))}
      </div>

      <div className="it-dashboard-panels">
        <section className="it-panel today-journey-panel">
          <div className="it-panel-header">
            <div className="it-panel-title">
              <span className="it-panel-icon"><CalendarDays /></span>
              <div>
                <h2>Today's Journey</h2>
                <p>Your top tasks for active employee journeys</p>
              </div>
            </div>
            <button className="it-text-link" onClick={() => c.navigate("/tasks")}>View all</button>
          </div>

          <div className="it-journey-list">
            {journeyTasks.map((task) => {
              const employee = getEmployee(task);
              const initials = employee?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2) || "IT";
              const employeeTasks = openItTasks.filter((item) => item.employeeId === task.employeeId);
              const completedTasks = c.tasks.filter((item) => item.employeeId === task.employeeId && (item.done || item.status === "COMPLETED")).length;
              const totalTasks = completedTasks + employeeTasks.length;
              const dueLabel = formatDueDate(task);
              return (
                <button
                  className="it-journey-row"
                  key={task.id}
                  onClick={() => c.navigate(getTaskRoute(task, c.employees))}
                  aria-label={`Open ${task.label} for ${employee?.name || "employee"}`}
                >
                  {employee?.avatar ? <img className="it-person-avatar" src={employee.avatar} alt="" /> : <span className="it-person-avatar initials">{initials}</span>}
                  <div className="it-person-copy">
                    <strong>{employee?.name || "Employee journey"}</strong>
                    <span>{employee ? `${employee.role} · ${employee.department}` : task.assignedRole}</span>
                  </div>
                  <div className="it-task-copy">
                    <strong>{task.label}</strong>
                    <span className={dueLabel === "Overdue" || dueLabel === "Due today" ? "urgent" : ""}>{dueLabel}</span>
                  </div>
                  <span className={`it-status-badge ${(task.status || "pending").toLowerCase()}`}>
                    {task.status === "IN_PROGRESS" ? "In Progress" : "Pending"}
                  </span>
                  <span className="it-task-progress">{completedTasks} / {Math.max(totalTasks, 1)}</span>
                  <ArrowRight className="it-row-arrow" />
                </button>
              );
            })}
            {!journeyTasks.length && (
              <div className="it-friendly-empty">
                <CircleCheckBig />
                <div><strong>You're all caught up!</strong><span>No IT journey tasks are waiting right now.</span></div>
              </div>
            )}
          </div>

          <button className="it-panel-footer-action" onClick={() => c.navigate("/tasks")}>View all journeys <ArrowRight /></button>
        </section>

        <section className="it-panel access-panel">
          <div className="it-panel-header">
            <div className="it-panel-title">
              <span className="it-panel-icon gold"><KeyRound /></span>
              <div><h2>Pending Access Requests</h2></div>
            </div>
            <button className="it-text-link" onClick={() => c.navigate("/access-requests")}>View all</button>
          </div>

          <div className="it-access-list">
            {pendingAccess.slice(0, 3).map((request) => {
              const employee = c.employees.find((item) => item.name === request.name || item.id === request.employeeId);
              const initials = request.name?.split(" ").map((part) => part[0]).join("").slice(0, 2) || "AR";
              return (
                <button
                  className="it-access-row"
                  key={request.id}
                  onClick={() => c.navigate(`/access-requests?focus=${request.id}`)}
                  aria-label={`Review ${request.system} access request for ${request.name}`}
                >
                  {(request.avatar || employee?.avatar) ? <img className="it-person-avatar" src={request.avatar || employee.avatar} alt="" /> : <span className="it-person-avatar initials">{initials}</span>}
                  <div className="it-person-copy">
                    <strong>{request.name}</strong>
                    <span>{employee?.role || request.role || "Employee"}</span>
                  </div>
                  <div className="it-request-copy">
                    <strong>{request.system}</strong>
                    <span>{employee?.department || request.department || "Company access"}</span>
                  </div>
                  <span className="it-request-age">{request.requested || "Pending"}</span>
                  <span className="it-review-button">Review <ArrowRight /></span>
                </button>
              );
            })}
            {!pendingAccess.length && (
              <div className="it-friendly-empty compact">
                <CircleCheckBig />
                <div><strong>No requests waiting</strong><span>Your access queue is clear.</span></div>
              </div>
            )}
          </div>

          <div className="it-security-note">
            <div className="it-security-icon"><ShieldCheck /></div>
            <div><strong>Security is a team effort.</strong><p>Review and approve access requests regularly to keep company systems secure.</p></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HRDashboard({ c }) {
  const hrTasks = c.tasks.filter((t) => /HR Manager/i.test(t.assignedRole || "") && !t.done);
  const starts = c.employees.filter((e) => e.type === "onboarding" && e.progress < 100);
  const leaves = c.employees.filter((e) => e.type === "offboarding" && e.progress < 100);
  const documentTasks = hrTasks.filter((t) => /document|offer|welcome/i.test(t.label));
  return <>
    <div className="role-metric-grid">
      <MetricCard icon={UserPlus} value={starts.length} label="Employees starting" note="Active onboarding journeys" />
      <MetricCard icon={LogOut} value={leaves.length} label="Employees leaving" note="Active offboarding journeys" />
      <MetricCard icon={FileText} value={documentTasks.length} label="Documents waiting" note="Review or collection needed" />
      <MetricCard icon={CalendarDays} value={starts.filter((e) => e.steps?.some((s) => s.id === "schedule-orientation" && !s.done)).length} label="Orientations to schedule" note="Upcoming first days" />
    </div>
    <h2 className="section-title">Quick actions</h2>
    <div className="quick-actions role-actions">
      <ActionCard icon={UserPlus} title="Start Onboarding" description="Add a new employee and coordinate their first day." onClick={c.startOnboarding} />
      <ActionCard icon={LogOut} title="Start Offboarding" description="Begin a respectful and complete departure workflow." onClick={c.startOffboarding} />
      <ActionCard icon={FileText} title="Review Documents" description="Track signed forms and employee records." onClick={() => c.navigate("/documents")} />
      <ActionCard icon={CalendarDays} title="Plan Orientation" description="Schedule first-day sessions and hosts." onClick={() => c.navigate("/orientation")} />
    </div>
    <div className="dashboard-grid role-dashboard-grid">
      <Section title="Employees Starting"><JourneyList employees={c.employees} type="onboarding" onOpen={c.openEmployee}/></Section>
      <Section title="HR Tasks"><TaskList tasks={hrTasks}/></Section>
    </div>
  </>;
}

function AuditorDashboard({ c }) {
  const logs = c.auditLogs || [];
  const completed = c.tasks.filter((t) => t.done || t.status === "COMPLETED").length;
  const total = c.tasks.length || 1;
  const complianceScore = Math.round((completed / total) * 100);
  return <>
    <div className="role-metric-grid">
      <MetricCard icon={Activity} value={logs.length} label="Audit events" note="Recorded system actions" />
      <MetricCard icon={ScrollText} value={`${complianceScore}%`} label="Workflow completion" note="Based on task evidence" />
      <MetricCard icon={TriangleAlert} value={c.tasks.filter(t => !t.done && t.dueDate && new Date(t.dueDate) < new Date()).length} label="Overdue controls" note="Open past due date" />
      <MetricCard icon={BarChart2} value={c.employees.length} label="Employee records" note="Available for review" />
    </div>
    <h2 className="section-title">Audit workspace</h2>
    <div className="quick-actions role-actions auditor-actions">
      <ActionCard icon={ScrollText} title="Open Compliance" description="Review controls, evidence, and quality metrics." onClick={() => c.navigate("/compliance")} />
      <ActionCard icon={BarChart2} title="View Reports" description="Review or export lifecycle records." onClick={() => c.navigate("/reports")} />
    </div>
    <div className="dashboard-grid role-dashboard-grid">
      <Section title="Recent Audit Activity">
        {logs.slice(0,6).map((log, index) => <div className="role-list-row" key={log.id || index}><div className="role-list-icon"><Activity/></div><div className="role-list-body"><strong>{(log.action || "SYSTEM_EVENT").replaceAll("_"," ")}</strong><span>{log.resourceType || "system"} · {log.actorName || log.userName || "JourneyOne user"}</span></div><small>{log.timestamp ? new Date(log.timestamp).toLocaleDateString() : "Recorded"}</small></div>)}
        {!logs.length && <div className="empty-state">Audit events will appear as users complete actions.</div>}
      </Section>
      <Section title="Read-only Review">
        <div className="audit-readonly-note"><ShieldCheck/><div><strong>Auditor permissions are read-only</strong><p>You can review reports, compliance controls, and audit history, but cannot change employee, equipment, or access records.</p></div></div>
      </Section>
    </div>
  </>;
}

export default function Dashboard() {
  const c = useOutletContext();
  const role = c.currentUser.role || "IT_MANAGER";
  const copy = roleCopy[role] || roleCopy.IT_MANAGER;
  return <>
    <div className="dashboard-greeting-section role-dashboard-heading">
      {copy.eyebrow && <p className="eyebrow">{copy.eyebrow}</p>}
      <h1 className="dashboard-greeting">{role === "IT_MANAGER" ? "Good morning" : `${copy.title}, ${c.currentUser.firstName}`}</h1>
      <p className="dashboard-greeting-subtitle">{copy.subtitle}</p>
    </div>
    {role === "IT_MANAGER" && <ITDashboard c={c}/>} 
    {role === "HR_MANAGER" && <HRDashboard c={c}/>} 
    {role === "AUDITOR" && <AuditorDashboard c={c}/>} 
    {role !== "IT_MANAGER" && <div className="banner">
      <div className="banner-left"><div className="banner-icon"><Flag/></div><div><h3>Every journey matters.</h3><p>Each role sees the information and actions needed to support a secure, coordinated employee experience.</p></div></div>
      <button className="btn-primary" onClick={c.showHow}>See how it works <Play/></button>
    </div>}
  </>;
}
