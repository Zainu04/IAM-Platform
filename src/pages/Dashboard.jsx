import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  UserPlus,
  LogOut,
  ShieldCheck,
  BarChart2,
  ArrowRight,
  ChevronRight,
  Laptop,
  FileText,
  Mail,
  Briefcase,
  Check,
  Flag,
  Play,
} from "lucide-react";

const icons = {
  laptop: Laptop,
  shield: ShieldCheck,
  file: FileText,
  mail: Mail,
  briefcase: Briefcase,
  "file-text": FileText,
};

function DashboardGreeting() {
  return (
    <div className="dashboard-greeting-section">
      <h1 className="dashboard-greeting">Good morning</h1>
      <p className="dashboard-greeting-subtitle">
        Here’s what’s happening with your employee journeys today.
      </p>
    </div>
  );
}

function Quick({ c }) {
  const cards = [
    {
      i: UserPlus,
      t: "rose",
      a: "maroon",
      title: "Start Onboarding Process",
      d: "Add a new employee and get them started.",
      fn: c.startOnboarding,
    },
    {
      i: LogOut,
      t: "amber",
      a: "gold",
      title: "Start Offboarding",
      d: "Initiate the offboarding process for an employee.",
      fn: c.startOffboarding,
    },
    {
      i: ShieldCheck,
      t: "rose",
      a: "maroon",
      title: "Review Access Requests",
      d: "Review and take action on pending requests.",
      fn: () => c.navigate("/access-requests"),
    },
    {
      i: BarChart2,
      t: "amber",
      a: "gold",
      title: "Generate Report",
      d: "Create and download custom reports.",
      fn: c.generateReport,
    },
  ];

  return (
    <>
      <h2 className="section-title">What would you like to do?</h2>

      <div className="quick-actions">
        {cards.map((card) => {
          const Icon = card.i;

          return (
            <button
              className="qa-card"
              key={card.title}
              onClick={card.fn}
            >
              <div className={`qa-icon ${card.t}`}>
                <Icon />
              </div>

              <div>
                <p className="qa-title">{card.title}</p>
                <p className="qa-desc">{card.d}</p>
              </div>

              <span className={`qa-arrow ${card.a}`}>
                <ArrowRight />
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Journeys({ c }) {
  const [tab, setTab] = useState("onboarding");

  const onboardingEmployees = c.employees.filter(
    (employee) =>
      employee.type === "onboarding" && employee.progress < 100
  );

  const offboardingEmployees = c.employees.filter(
    (employee) =>
      employee.type === "offboarding" && employee.progress < 100
  );

  const journeyList =
    tab === "onboarding"
      ? onboardingEmployees
      : offboardingEmployees;

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="section-title no-margin">Today&apos;s Journeys</h3>

        <button
          className="link-btn"
          onClick={() => c.navigate(`/${tab}`)}
        >
          View all journeys
          <ArrowRight />
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${
            tab === "onboarding" ? "active" : ""
          }`}
          onClick={() => setTab("onboarding")}
        >
          Onboarding ({onboardingEmployees.length})
        </button>

        <button
          className={`tab-btn ${
            tab === "offboarding" ? "active" : ""
          }`}
          onClick={() => setTab("offboarding")}
        >
          Offboarding ({offboardingEmployees.length})
        </button>
      </div>

      {!journeyList.length && (
        <div className="empty-state">
          No active {tab} journeys for today.
        </div>
      )}

      {journeyList.map((employee) => {
        const StepIcon =
          icons[employee.nextStep.icon] || FileText;

        return (
          <div className="journey-row" key={employee.id}>
            <div className="person">
              <img
                src={employee.avatar}
                alt={`${employee.name} profile`}
              />

              <div>
                <strong>{employee.name}</strong>
                <div className="role">{employee.role}</div>

                <span
                  className={`pill ${
                    employee.type === "onboarding"
                      ? "gold"
                      : "rose"
                  }`}
                >
                  {employee.startLabel}
                </span>
              </div>
            </div>

            <div className="progress-block">
              <div className="label">Overall Progress</div>

              <div className="progress-bar-row">
                <div className="progress-track">
                  <div
                    className={`progress-fill ${
                      employee.type === "offboarding"
                        ? "offboarding"
                        : ""
                    }`}
                    style={{
                      width: `${employee.progress}%`,
                    }}
                  />
                </div>

                <span className="progress-pct">
                  {employee.progress}%
                </span>
              </div>
            </div>

            <div className="next-step">
              <div className="label">
                <span>Next Step</span>
                <span className="due">
                  Due {employee.nextStep.due}
                </span>
              </div>

              <div className="step-line">
                <StepIcon />
                {employee.nextStep.label}
              </div>
            </div>

            <button
              className="row-chevron"
              onClick={() => c.openEmployee(employee)}
              aria-label={`Open ${employee.name}`}
            >
              <ChevronRight />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Tasks({ c }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3 className="section-title no-margin">My Tasks</h3>
      </div>

      {c.tasks.map((task) => {
        const TaskIcon = icons[task.icon] || FileText;

        return (
          <div className="task-row" key={task.id}>
            <div className="task-icon">
              <TaskIcon />
            </div>

            <div
              className={`task-body ${
                task.done ? "done" : ""
              }`}
            >
              <strong>{task.label}</strong>
              <span>{task.subLabel}</span>
            </div>

            {!task.done && (
              <span
                className={`priority-badge ${task.priority}`}
              >
                {task.priority}
              </span>
            )}

            <button
              className={`task-check ${
                task.done ? "checked" : ""
              }`}
              onClick={() => c.toggleTask(task.id)}
              aria-label={`Mark ${task.label} as complete`}
            >
              {task.done && <Check />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Dates({ c }) {
  return (
    <div className="card dates-card">
      <div className="card-head">
        <h3 className="section-title no-margin">
          Upcoming Dates
        </h3>
      </div>

      {c.dates.map((date) => (
        <div className="date-row" key={date.id}>
          <div className="date-chip">
            <span className="m">{date.month}</span>
            <span className="d">{date.day}</span>
          </div>

          <div className="date-body">
            <strong>{date.title}</strong>
            <span>{date.subtitle}</span>
          </div>

          <span className="pill gold">{date.badge}</span>
        </div>
      ))}
    </div>
  );
}

function Overview({ c }) {
  const onboardingEmployees = c.employees.filter(
    (employee) =>
      employee.type === "onboarding" && employee.progress < 100
  );

  const offboardingEmployees = c.employees.filter(
    (employee) =>
      employee.type === "offboarding" && employee.progress < 100
  );

  const overviewCards = [
    {
      title: "Onboarding Overview",
      list: onboardingEmployees,
      tone: "maroon",
    },
    {
      title: "Offboarding Overview",
      list: offboardingEmployees,
      tone: "gold",
    },
  ];

  return (
    <div className="overview-grid">
      {overviewCards.map(({ title, list, tone }) => {
        const averageProgress = list.length
          ? Math.round(
              list.reduce(
                (total, employee) =>
                  total + employee.progress,
                0
              ) / list.length
            )
          : 0;

        const inProgress = list.filter(
          (employee) => employee.progress < 100
        ).length;

        return (
          <div className="overview-card" key={title}>
            <h3 className="section-title">{title}</h3>

            <div className="overview-number">
              {list.length}
            </div>

            <p className="overview-caption">
              Active journeys
            </p>

            <div className="overview-list">
              <span>In progress</span>
              <strong>{inProgress}</strong>
            </div>

            <div className="overview-list">
              <span>Average progress</span>
              <strong>{averageProgress}%</strong>
            </div>

            <div
              className={`overview-accent ${tone}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const c = useOutletContext();

  return (
    <>
      <DashboardGreeting />

      <Quick c={c} />

      <div className="dashboard-grid">
        <div>
          <Journeys c={c} />
          <Overview c={c} />
        </div>

        <div>
          <Tasks c={c} />
          <Dates c={c} />
        </div>
      </div>

      <div className="banner">
        <div className="banner-left">
          <div className="banner-icon">
            <Flag />
          </div>

          <div>
            <h3>Every journey matters.</h3>
            <p>
              A smooth start and a respectful exit create
              better experiences for everyone.
            </p>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={c.showHow}
        >
          See how it works
          <Play />
        </button>
      </div>
    </>
  );
}