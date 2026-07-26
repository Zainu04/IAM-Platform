import { useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Laptop,
  Mail,
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";

const STEP_ICONS = {
  "send-welcome": Mail,
  "collect-documents": FileText,
  "provision-access": ShieldCheck,
  "assign-equipment": Laptop,
  "schedule-orientation": CalendarDays,
};

function TaskModal({ employee, step, context, onClose }) {
  const [subject, setSubject] = useState(
    `Welcome to JourneyOne, ${employee.name.split(" ")[0]}!`
  );
  const [message, setMessage] = useState(
    `Hi ${employee.name.split(" ")[0]},\n\nWe are excited to welcome you to the ${employee.department} team as our new ${employee.role}. Your start date is ${employee.startLabel.replace("Starts ", "")}. Please review the attached offer details and first-day information.\n\nWelcome aboard!`
  );
  const [documents, setDocuments] = useState([]);
  const [systems, setSystems] = useState([]);
  const [orientationDate, setOrientationDate] = useState(employee.startDate || "");
  const [orientationTime, setOrientationTime] = useState("09:00");
  const [orientationLocation, setOrientationLocation] = useState("Main Office - Conference Room A");
  const [orientationHost, setOrientationHost] = useState(context.currentUser.name);

  const department = context.departments.find(
    (item) => item.name.toLowerCase() === employee.department.toLowerCase()
  );
  const suggestedSystems = department?.systems || ["Microsoft 365", "Slack", "HR Portal"];

  function toggleSystem(system) {
    setSystems((current) =>
      current.includes(system)
        ? current.filter((item) => item !== system)
        : [...current, system]
    );
  }

  function complete(details) {
    context.completeOnboardingStep(employee.id, step.id, {
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      ...details,
    });
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="modal-box workflow-modal">
        <div className="modal-head">
          <div>
            <h3>{step.label}</h3>
            <p className="workflow-modal-person">For {employee.name}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        {step.id === "send-welcome" && (
          <div>
            <div className="field">
              <label>Send to</label>
              <input value={employee.email} readOnly />
            </div>
            <div className="field">
              <label>Subject</label>
              <input value={subject} onChange={(event) => setSubject(event.target.value)} />
            </div>
            <div className="field">
              <label>Welcome message</label>
              <textarea
                rows="8"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!subject.trim() || !message.trim()}
                onClick={() => complete({ subject, message, sentTo: employee.email })}
              >
                <Mail /> Send letter
              </button>
            </div>
          </div>
        )}

        {step.id === "collect-documents" && (
          <div>
            <p className="modal-sub">
              Upload the signed documents received from the employee. The files are
              recorded in this demo workflow but are not sent to a server.
            </p>
            <label className="document-upload">
              <FileText />
              <span>
                <strong>Select signed documents</strong>
                <small>Offer letter, tax forms, policies, or identification</small>
              </span>
              <input
                type="file"
                multiple
                onChange={(event) => setDocuments(Array.from(event.target.files || []))}
              />
            </label>

            {documents.length > 0 && (
              <div className="uploaded-files">
                {documents.map((file) => (
                  <div key={`${file.name}-${file.size}`}>
                    <FileText />
                    <span>{file.name}</span>
                    <CheckCircle2 />
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!documents.length}
                onClick={() =>
                  complete({
                    documents: documents.map((file) => ({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                    })),
                  })
                }
              >
                <Check /> Verify documents
              </button>
            </div>
          </div>
        )}

        {step.id === "provision-access" && (
          <div>
            <p className="modal-sub">
              Select the accounts and systems required for the {employee.department}
              department. This sends a request to IT — access is granted once IT
              approves it in their Access Requests queue.
            </p>
            <div className="access-option-list">
              {suggestedSystems.map((system) => (
                <label key={system} className="access-option">
                  <input
                    type="checkbox"
                    checked={systems.includes(system)}
                    onChange={() => toggleSystem(system)}
                  />
                  <span>
                    <strong>{system}</strong>
                    <small>Grant standard {employee.department} access</small>
                  </span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!systems.length}
                onClick={() => {
                  context.requestAccess(employee.id, systems);
                  onClose();
                }}
              >
                <ShieldCheck /> Request access
              </button>
            </div>
          </div>
        )}



        {step.id === "schedule-orientation" && (
          <div>
            <div className="workflow-form-grid">
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  value={orientationDate}
                  onChange={(event) => setOrientationDate(event.target.value)}
                />
              </div>
              <div className="field">
                <label>Time</label>
                <input
                  type="time"
                  value={orientationTime}
                  onChange={(event) => setOrientationTime(event.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label>Location or meeting link</label>
              <input
                value={orientationLocation}
                onChange={(event) => setOrientationLocation(event.target.value)}
              />
            </div>
            <div className="field">
              <label>Orientation host</label>
              <input
                value={orientationHost}
                onChange={(event) => setOrientationHost(event.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={
                  !orientationDate ||
                  !orientationTime ||
                  !orientationLocation.trim() ||
                  !orientationHost.trim()
                }
                onClick={() =>
                  complete({
                    date: orientationDate,
                    time: orientationTime,
                    location: orientationLocation,
                    host: orientationHost,
                  })
                }
              >
                <CalendarDays /> Schedule orientation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OnboardingList({ context, employees }) {
  const activeEmployees = employees.filter((employee) => employee.progress < 100);
  const completedEmployees = employees.filter((employee) => employee.progress === 100);

  const renderJourneyRow = (employee, completed = false) => (
    <div className={`journey-row ${completed ? "completed-journey-row" : ""}`} key={employee.id}>
      <button
        type="button"
        className="person person-link"
        onClick={() => context.navigate(`/onboarding/${employee.id}`)}
      >
        <img src={employee.avatar} alt="" />
        <div>
          <strong>{employee.name}</strong>
          <div className="role">{employee.role}</div>
          <span className={`pill ${completed ? "green" : "gold"}`}>
            {completed ? "Onboarding completed" : employee.startLabel}
          </span>
        </div>
      </button>

      <div className="progress-block">
        <div className="label">Overall Progress</div>
        <div className="progress-bar-row">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${employee.progress}%` }} />
          </div>
          <span className="progress-pct">{employee.progress}%</span>
        </div>
      </div>

      {completed ? (
        <div className="completed-onboarding-actions">
          <div>
            <span className="label">Employee record</span>
            <strong>Ready for active employment</strong>
          </div>
          <button
            type="button"
            className="btn-secondary start-offboarding-btn"
            onClick={() => context.startOffboardingFor(employee)}
          >
            Start Offboarding
          </button>
        </div>
      ) : (
        <div className="next-step">
          <div className="label">
            <span>Next Step</span>
            <span className="due">Due {employee.nextStep.due}</span>
          </div>
          <div className="step-line">{employee.nextStep.label}</div>
        </div>
      )}

      <button
        type="button"
        className="row-chevron"
        aria-label={`Open ${employee.name}'s onboarding workflow`}
        onClick={() => context.navigate(`/onboarding/${employee.id}`)}
      >
        <ChevronRight />
      </button>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Onboarding</h2>
          <p>{activeEmployees.length} active onboarding journeys.</p>
        </div>
        <button className="btn-primary" onClick={context.startOnboarding}>
          <UserPlus /> Start Onboarding Process
        </button>
      </div>

      <section className="onboarding-section">
        <div className="section-title-row">
          <div>
            <h3>Active onboarding</h3>
            <p>Employees who still have onboarding tasks to complete.</p>
          </div>
          <span className="section-count">{activeEmployees.length}</span>
        </div>
        <div className="card">
          {activeEmployees.map((employee) => renderJourneyRow(employee))}
          {!activeEmployees.length && (
            <div className="empty-state">No active onboarding journeys.</div>
          )}
        </div>
      </section>

      <section className="onboarding-section completed-onboarding-section">
        <div className="section-title-row">
          <div>
            <h3>Completed onboarding</h3>
            <p>Finished journeys are moved here automatically and kept as employee records.</p>
          </div>
          <span className="section-count complete">{completedEmployees.length}</span>
        </div>
        <div className="card">
          {completedEmployees.map((employee) => renderJourneyRow(employee, true))}
          {!completedEmployees.length && (
            <div className="empty-state">
              Completed employees will appear here automatically.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function OnboardingWorkflow({ context, employee }) {
  const [activeStep, setActiveStep] = useState(null);
  const completedCount = employee.steps.filter((step) => step.done).length;
  const isComplete = completedCount === employee.steps.length;

  return (
    <div className="workflow-page">
      <button
        type="button"
        className="workflow-back"
        onClick={() => context.navigate("/onboarding")}
      >
        <ArrowLeft /> Back to onboarding
      </button>

      <div className="workflow-hero">
        <div className="workflow-person">
          <img src={employee.avatar} alt="" />
          <div>
            <span className={`workflow-status ${isComplete ? "complete" : ""}`}>
              {isComplete ? "Onboarding complete" : "Onboarding in progress"}
            </span>
            <h2>{employee.name}</h2>
            <p>
              {employee.role} · {employee.department} · {employee.startLabel}
            </p>
          </div>
        </div>

        <div className="workflow-progress-summary">
          <div>
            <span>Journey progress</span>
            <strong>{employee.progress}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${employee.progress}%` }} />
          </div>
          <small>
            {completedCount} of {employee.steps.length} tasks completed
          </small>
        </div>
      </div>

      {isComplete && (
        <div className="workflow-complete-banner">
          <CheckCircle2 />
          <div>
            <strong>{employee.name}'s onboarding is complete.</strong>
            <span>All required tasks have been finished and recorded.</span>
          </div>
          <button
            type="button"
            className="btn-secondary workflow-offboarding-button"
            onClick={() => context.startOffboardingFor(employee)}
          >
            Start Offboarding
          </button>
        </div>
      )}

      <div className="workflow-layout">
        <section className="workflow-task-section">
          <div className="workflow-section-heading">
            <div>
              <h3>Onboarding checklist</h3>
              <p>Complete each task to move this employee through the full workflow.</p>
            </div>
          </div>

          <div className="workflow-task-list">
            {employee.steps.map((step, index) => {
              const Icon = STEP_ICONS[step.id] || FileText;
              const previousComplete = index === 0 || employee.steps[index - 1].done;
              const locked = !step.done && !previousComplete;
              const isItOwned = step.id === "assign-equipment" || step.id === "provision-access";
              const pendingProvisionRequest =
                step.id === "provision-access" &&
                context.accessRequests.some(
                  (request) =>
                    request.employeeId === employee.id &&
                    request.stage === "provision" &&
                    request.status === "Pending"
                );

              let stateLabel = step.done ? "Completed" : locked ? "Waiting" : "Ready";
              let ctaContent = (
                <>
                  Start task <ChevronRight />
                </>
              );
              let ctaDisabled = locked || step.done;
              let onCta = () => setActiveStep(step);

              if (!step.done && !locked && step.id === "provision-access") {
                if (pendingProvisionRequest) {
                  stateLabel = "Waiting on IT";
                  ctaContent = "Requested — waiting on IT";
                  ctaDisabled = true;
                } else {
                  ctaContent = (
                    <>
                      Request access <ChevronRight />
                    </>
                  );
                }
              }

              if (!step.done && !locked && step.id === "assign-equipment") {
                stateLabel = "Waiting on IT";
                ctaContent = "Handled in IT's Equipment queue";
                ctaDisabled = true;
                onCta = undefined;
              }

              return (
                <article
                  className={`workflow-task-card ${step.done ? "done" : ""} ${
                    locked ? "locked" : ""
                  }`}
                  key={step.id}
                >
                  <div className="workflow-task-number">
                    {step.done ? <Check /> : index + 1}
                  </div>
                  <div className="workflow-task-icon">
                    <Icon />
                  </div>
                  <div className="workflow-task-copy">
                    <div className="workflow-task-title-row">
                      <h4>{step.label}</h4>
                      <span className={`workflow-task-state ${step.done ? "done" : ""}`}>
                        {stateLabel}
                      </span>
                    </div>
                    <p>
                      {step.description ||
                        (isItOwned
                          ? "Owned by IT — this employee's IT dashboard picks it up automatically."
                          : "Complete this required onboarding task.")}
                    </p>
                    {step.done && step.details && (
                      <small className="workflow-task-record">
                        Completed and saved to this employee's journey record.
                      </small>
                    )}
                  </div>
                  <button
                    type="button"
                    className={step.done ? "btn-secondary" : "btn-primary"}
                    disabled={ctaDisabled}
                    onClick={onCta}
                  >
                    {step.done ? (
                      <>
                        <Check /> Done
                      </>
                    ) : locked ? (
                      "Complete previous task"
                    ) : (
                      ctaContent
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="workflow-sidebar-card">
          <h3>Employee details</h3>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{employee.email}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{employee.department}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{employee.role}</dd>
            </div>
            <div>
              <dt>Start date</dt>
              <dd>
                {new Date(`${employee.startDate}T00:00:00`).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {activeStep && (
        <TaskModal
          employee={employee}
          step={activeStep}
          context={context}
          onClose={() => setActiveStep(null)}
        />
      )}
    </div>
  );
}

export default function Onboarding() {
  const context = useOutletContext();
  const { employeeId } = useParams();
  const onboardingEmployees = useMemo(
    () => context.employees.filter((employee) => employee.type === "onboarding"),
    [context.employees]
  );

  if (!employeeId) {
    return <OnboardingList context={context} employees={onboardingEmployees} />;
  }

  const employee = onboardingEmployees.find((item) => item.id === employeeId);

  if (!employee) {
    return (
      <div className="card empty-state">
        <h2>Onboarding journey not found</h2>
        <p>This employee may have been removed or the link is no longer valid.</p>
        <button className="btn-primary" onClick={() => context.navigate("/onboarding")}>
          Return to onboarding
        </button>
      </div>
    );
  }

  return <OnboardingWorkflow context={context} employee={employee} />;
}
