import { useOutletContext } from "react-router-dom";
import {
  UserPlus, LogOut, ShieldCheck, BarChart2, ArrowRight, Laptop,
  FileText, Briefcase, Clock3, Users, CalendarDays, ClipboardCheck,
  MonitorCheck, KeyRound, TriangleAlert, ScrollText, Activity,
  CircleCheckBig, GraduationCap, UserCheck, Flag, Play, ListChecks, Plus, Check, Pencil
} from "lucide-react";
import { getTaskRoute } from "../utils/taskRouting.js";
import { getAuditLogs } from "../utils/auditDemoData.js";
import { roleLabel } from "../utils/roles.js";

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
        <div className="role-list-body"><strong>{task.label}</strong><span>{roleLabel(task.assignedRole) || task.subLabel}</span></div>
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
  const openItTasks = c.tasks.filter((task) => task.assignedRole === "IT_MANAGER" && !task.done && task.status !== "COMPLETED");
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
  const hrTasks = c.tasks.filter((task) => task.assignedRole === "HR_MANAGER");
  const activeHrTasks = hrTasks.filter((task) => !task.done && task.status !== "COMPLETED");
  const activeEmployees = c.employees
    .filter((employee) => employee.progress < 100)
    .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
    .slice(0, 6);

  const routeForEmployee = (employee) => employee.type === "offboarding"
    ? `/offboarding/${employee.id}`
    : `/onboarding/${employee.id}`;

  const employeeStatus = (employee) => {
    if (employee.progress >= 100) return "Complete";
    if (employee.type === "offboarding") return "Offboarding";
    return "Onboarding";
  };

  const currentStep = (employee) =>
    employee.steps?.find((step) => !step.done)?.label || employee.nextStep?.label || "Review journey";

  // Count each employee journey once, even when older/demo data contains duplicates.
  const uniqueJourneys = Array.from(
    new Map(
      c.employees.map((employee) => [
        `${employee.type}:${String(employee.profileId || employee.email || employee.name).trim().toLowerCase()}`,
        employee,
      ])
    ).values()
  );
  const activeOnboardings = uniqueJourneys.filter((employee) => employee.type !== "offboarding" && employee.progress < 100);
  const activeOffboardings = uniqueJourneys.filter((employee) => employee.type === "offboarding" && employee.progress < 100);
  const onboardingCount = activeOnboardings.length;
  const offboardingCount = activeOffboardings.length;
  const documentsCount = activeOnboardings.filter((employee) => {
    const documentStep = employee.steps?.find((step) => ["collect-documents", "upload-documents"].includes(step.id));
    return documentStep && !documentStep.done;
  }).length;
  const orientationCount = activeOnboardings.filter((employee) =>
    employee.steps?.some((step) => step.id === "schedule-orientation" && step.done)
  ).length;

  const hrActions = [
    {
      count: onboardingCount,
      statusText: `${onboardingCount === 1 ? "Onboarding" : "Onboardings"} in progress`,
      icon: UserPlus,
      title: "Start Onboarding",
      description: "Create a new employee journey and coordinate their first day.",
      actionLabel: "Start Onboarding",
      onClick: c.startOnboarding,
    },
    {
      count: offboardingCount,
      statusText: `${offboardingCount === 1 ? "Offboarding" : "Offboardings"} in progress`,
      icon: LogOut,
      title: "Start Offboarding",
      description: "Begin a complete and respectful employee departure workflow.",
      actionLabel: "Start Offboarding",
      onClick: c.startOffboarding,
    },
    {
      count: documentsCount,
      statusText: `${documentsCount === 1 ? "Document" : "Documents"} pending review`,
      icon: FileText,
      title: "Review Documents",
      description: "Review employment forms, acknowledgements, and records.",
      actionLabel: "Review Documents",
      onClick: () => c.navigate("/documents"),
    },
    {
      count: orientationCount,
      statusText: `${orientationCount === 1 ? "Orientation" : "Orientations"} scheduled`,
      icon: CalendarDays,
      title: "Plan Orientation",
      description: "Schedule first-day sessions, locations, and orientation hosts.",
      actionLabel: "Plan Orientation",
      onClick: () => c.navigate("/orientation"),
    },
  ];

  return (
    <div className="hr-dashboard-v2">
      <div className="hr-action-grid">
        {hrActions.map(({ icon: Icon, title, description, statusText, actionLabel, onClick, count }) => (
          <button className="hr-action-card" key={title} onClick={onClick}>
            <span className="hr-action-icon"><Icon /></span>
            <span className="hr-action-copy">
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <span className="hr-action-stat">
              <em className="hr-action-count">{count}</em>
              <small>{statusText}</small>
            </span>
            <span className="hr-action-button" aria-hidden="true"><Plus /> {actionLabel}</span>
          </button>
        ))}
      </div>

      <div className="hr-dashboard-panels">
        <section className="hr-panel hr-employee-panel">
          <div className="hr-panel-header">
            <div className="hr-panel-title">
              <span className="hr-panel-icon"><Users /></span>
              <div>
                <h2>Employee Journeys</h2>
                <p>See who needs attention and continue from their current step.</p>
              </div>
            </div>
            <button className="hr-text-link" onClick={() => c.navigate("/employees")}>View all</button>
          </div>

          <div className="hr-employee-list">
            {activeEmployees.map((employee) => {
              const initials = employee.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
              return (
                <article className="hr-employee-row" key={employee.id}>
                  {employee.avatar
                    ? <img className="hr-employee-avatar" src={employee.avatar} alt="" />
                    : <span className="hr-employee-avatar initials">{initials}</span>}
                  <div className="hr-employee-contact">
                    <strong>{employee.name}</strong>
                    <a href={`mailto:${employee.email}`} onClick={(event) => event.stopPropagation()}>{employee.email}</a>
                    <span>{employee.role} · {employee.department}</span>
                  </div>
                  <div className="hr-employee-status">
                    <span className={`hr-status-pill ${employee.type}`}>{employeeStatus(employee)}</span>
                    <small>{currentStep(employee)}</small>
                  </div>
                  <div className="hr-progress-block">
                    <div><span>Progress</span><strong>{employee.progress}%</strong></div>
                    <div className="hr-progress-track"><i style={{ width: `${employee.progress}%` }} /></div>
                  </div>
                  <button className="hr-continue-button" onClick={() => c.navigate(routeForEmployee(employee))}>
                    Continue <ArrowRight />
                  </button>
                </article>
              );
            })}
            {!activeEmployees.length && (
              <div className="hr-empty-state">
                <CircleCheckBig />
                <div><strong>Every journey is up to date</strong><span>New employee journeys will appear here.</span></div>
              </div>
            )}
          </div>
        </section>

        <section className="hr-panel hr-task-panel">
          <div className="hr-panel-header">
            <div className="hr-panel-title">
              <span className="hr-panel-icon gold"><ListChecks /></span>
              <div>
                <h2>HR Tasks</h2>
                <p>{activeHrTasks.length} task{activeHrTasks.length === 1 ? "" : "s"} still need attention.</p>
              </div>
            </div>
            <div className="hr-task-header-actions">
              <button className="hr-icon-button" onClick={c.addHrTask} aria-label="Add HR task" title="Add HR task"><Pencil /></button>
              <button className="hr-text-link" onClick={() => c.navigate("/tasks")}>View all</button>
            </div>
          </div>

          <div className="hr-task-list">
            {hrTasks.slice(0, 7).map((task) => {
              const complete = task.done || task.status === "COMPLETED";
              const employee = c.employees.find((item) => item.id === task.employeeId);
              return (
                <div className={`hr-task-row ${complete ? "complete" : ""}`} key={task.id}>
                  <button
                    className={`hr-task-checkbox ${complete ? "checked" : ""}`}
                    onClick={() => c.manualToggleTask(task.id)}
                    aria-label={`${complete ? "Reopen" : "Complete"} ${task.label}`}
                  >
                    {complete && <Check />}
                  </button>
                  <button className="hr-task-open" onClick={() => c.navigate(getTaskRoute(task, c.employees))}>
                    <span className="hr-task-copy">
                      <strong>{task.label}</strong>
                      <small>{employee ? `${employee.name} · ${task.priority || "Medium"} priority` : task.subLabel || task.assignedRole}</small>
                    </span>
                    <ArrowRight />
                  </button>
                </div>
              );
            })}
            {!hrTasks.length && (
              <div className="hr-empty-state compact">
                <CircleCheckBig />
                <div><strong>You are all caught up</strong><span>New HR tasks will appear automatically.</span></div>
              </div>
            )}
          </div>
          <div className="hr-task-note">
            <ClipboardCheck />
            <p>Tasks check off automatically when you complete their workflow action, or you can mark them manually.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function AuditorDashboard({ c }) {
  const logs = getAuditLogs(c.auditLogs || []);
  const offboardingLogs = logs.filter((log) => /OFFBOARD|ACCESS_REVOKED|ACCOUNT_DEACTIVATION/i.test(log.action || ""));
  const offboardingStarts = logs.filter((log) => /OFFBOARDING_(INITIATED|STARTED)|EMPLOYEE_JOURNEY_CREATED/i.test(log.action || "") && (log.details?.type === "offboarding" || /OFFBOARD/i.test(log.action || "")));
  const offboardedEmployeeIds = new Set(offboardingStarts.map((log) => log.details?.employeeId || log.resourceId || log.details?.employeeName));
  const failedLogs = logs.filter((log) => String(log.status || "").toUpperCase() === "FAILED");
  const criticalFailureLogs = failedLogs.filter((log) => /ACCESS|ACCOUNT/i.test(log.action || ""));
  const openCriticalRisks = criticalFailureLogs.length;
  const orphanedAccounts = 1;
  const deactivationEvents = logs.filter((log) => /ACCESS_REVOKED|ACCOUNT_DEACTIVATION/i.test(log.action || ""));
  const failedDeactivations = deactivationEvents.filter((log) => String(log.status || "").toUpperCase() === "FAILED");
  const slaBreaches = deactivationEvents.length ? Math.round((failedDeactivations.length / deactivationEvents.length) * 100) : 0;

  const sortedLogs = [...logs].sort((a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp));
  const dailyMap = new Map();
  sortedLogs.forEach((log) => {
    const date = new Date(log.createdAt || log.timestamp);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toISOString().slice(0, 10);
    dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
  });
  const activity = [...dailyMap.entries()].slice(-7).map(([date, count]) => ({ date, count }));
  const maxCount = Math.max(...activity.map((item) => item.count), 1);
  const chartWidth = 640;
  const chartHeight = 210;
  const leftPad = 38;
  const bottomPad = 35;
  const usableWidth = chartWidth - leftPad - 20;
  const usableHeight = chartHeight - bottomPad - 20;
  const points = activity.map((item, index) => ({
    ...item,
    x: leftPad + (activity.length === 1 ? usableWidth / 2 : (index * usableWidth) / (activity.length - 1)),
    y: 15 + usableHeight - (item.count / maxCount) * usableHeight,
  }));
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  const metricCards = [
    { label: "Total offboardings", value: offboardedEmployeeIds.size, note: "Employees with an offboarding event in this audit period", tone: "blue" },
    { label: "SLA breach rate", value: `${slaBreaches}%`, note: slaBreaches ? "Deactivation exceeded the target window" : "All reviewed deactivations met SLA", tone: slaBreaches ? "red" : "green", change: slaBreaches ? "↑ Needs review" : "↓ On target" },
    { label: "Open critical risks", value: openCriticalRisks, note: "Former employee access still requiring proof", tone: openCriticalRisks ? "red" : "green" },
    { label: "Orphaned accounts", value: orphanedAccounts, note: "Active account without a current employee match", tone: orphanedAccounts ? "gold" : "green" },
  ];

  const evidenceLabel = (log) => {
    const details = log.details || {};
    return {
      title: details.category || String(log.action || "System event").replaceAll("_", " "),
      proof: details.proof || `${details.employeeName || "A system record"} was verified in the immutable ledger.`,
      timestamp: new Date(log.createdAt || log.timestamp).toISOString(),
      status: String(log.status || "SUCCESS").toUpperCase(),
    };
  };

  return <div className="auditor-dashboard-v3">
    <div className="auditor-insight-grid">
      {metricCards.map((card) => <article className={`auditor-insight-card ${card.tone}`} key={card.label}>
        <span className="auditor-insight-label">{card.label}</span>
        <div className="auditor-insight-value"><strong>{card.value}</strong>{card.change && <span className={card.tone === "red" ? "trend-down" : "trend-up"}>{card.change}</span>}</div>
        <p><span className="insight-spark">✦</span>{card.note}</p>
      </article>)}
    </div>

    <div className="auditor-visual-grid refined">
      <section className="card auditor-chart-card line-chart-card">
        <div className="card-head"><div><h2 className="section-title no-margin">Verified event activity</h2><p className="qa-desc">Daily count of immutable HR, IT, access, document, and equipment events.</p></div><button className="hr-text-link" onClick={() => c.navigate("/audit-history")}>Open ledger</button></div>
        <div className="auditor-line-chart" aria-label="Verified audit event activity by day">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img">
            {[0, 1, 2, 3].map((line) => {
              const y = 15 + (usableHeight * line) / 3;
              return <line key={line} x1={leftPad} x2={chartWidth - 20} y1={y} y2={y} className="chart-grid-line" />;
            })}
            {points.length > 1 && <polyline points={polyline} className="audit-chart-line" />}
            {points.map((point) => <g key={point.date}>
              <circle cx={point.x} cy={point.y} r="5" className="audit-chart-point" />
              <text x={point.x} y={point.y - 12} textAnchor="middle" className="audit-chart-count">{point.count}</text>
              <text x={point.x} y={chartHeight - 10} textAnchor="middle" className="audit-chart-date">{new Date(`${point.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>
            </g>)}
          </svg>
        </div>
        <div className="chart-caption"><Clock3 /> Each point is backed by exact event timestamps in Audit History.</div>
      </section>

      <section className="card auditor-risk-card">
        <div className="card-head"><div><h2 className="section-title no-margin">SLA proof snapshot</h2><p className="qa-desc">Offboarding access removal evidence.</p></div><button className="hr-text-link" onClick={() => c.navigate("/compliance")}>Review controls</button></div>
        <div className="sla-proof-list">
          <div><span>HR termination recorded</span><strong>Jul 19 · 5:44 PM</strong><small>Nora Bennett</small></div>
          <i />
          <div><span>AWS deactivation attempted</span><strong>Jul 19 · 6:02 PM</strong><small className="risk-text">Failed · manual action required</small></div>
          <i />
          <div><span>Slack access revoked</span><strong>Jul 22 · 1:42 PM</strong><small className="success-text">Verified in audit ledger</small></div>
        </div>
      </section>
    </div>

    <div className="dashboard-grid role-dashboard-grid auditor-bottom-grid">
      <Section title="Latest Verified Evidence" action={<button className="hr-text-link" onClick={() => c.navigate("/audit-history")}>View full ledger</button>}>
        <p className="evidence-helper">Each item is proof that a specific lifecycle control was performed by an identified actor at an exact time.</p>
        {logs.slice(0, 5).map((log, index) => {
          const evidence = evidenceLabel(log);
          return <button className="auditor-evidence-row detailed" onClick={() => c.navigate("/audit-history")} key={log.id || index}>
            <div className="role-list-icon"><Activity /></div>
            <div className="role-list-body"><strong>{evidence.title}</strong><span>{evidence.proof}</span><code>{evidence.timestamp}</code></div>
            <span className={`audit-status ${evidence.status.toLowerCase()}`}>{evidence.status}</span>
            <ArrowRight />
          </button>;
        })}
      </Section>
      <Section title="Auditor Shortcuts">
        <div className="auditor-shortcut-list">
          <button onClick={() => c.navigate("/compliance")}><ShieldCheck /><span><strong>Review compliance controls</strong><small>Interpret ledger evidence as risks, exceptions, and SLA gaps.</small></span><ArrowRight /></button>
          <button onClick={() => c.navigate("/audit-history")}><ScrollText /><span><strong>Inspect immutable event ledger</strong><small>Filter by employee, app, actor, action, or status and export CSV.</small></span><ArrowRight /></button>
          <button onClick={() => c.navigate("/reports")}><BarChart2 /><span><strong>Export compliance reports</strong><small>Prepare offline evidence for external review.</small></span><ArrowRight /></button>
        </div>
      </Section>
    </div>
  </div>;
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

  </>;
}
