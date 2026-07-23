import { useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Files,
  Laptop,
  LogOut,
  Mail,
  ShieldOff,
  X,
} from "lucide-react";

const STEP_ICONS = {
  "notify-teams": Mail,
  "revoke-access": ShieldOff,
  "transfer-files": Files,
  "collect-equipment": Laptop,
  "archive-employee": Archive,
};

function TaskModal({ employee, step, context, onClose }) {
  const assignedEquipment = context.equipment.filter(
    (item) => item.assignedTo === employee.name
  );
  const approvedAccess = context.accessRequests.filter(
    (request) => request.name === employee.name && request.status !== "Revoked"
  );

  const [managerName, setManagerName] = useState("Sarah Johnson");
  const [notificationMessage, setNotificationMessage] = useState(
    `${employee.name}'s final working day is ${employee.startLabel.replace("Last Day: ", "")}. Please complete all required handoffs before departure.`
  );
  const [selectedSystems, setSelectedSystems] = useState(
    approvedAccess.map((request) => request.system)
  );
  const [transferOwner, setTransferOwner] = useState(context.currentUser.name);
  const [transferNotes, setTransferNotes] = useState(
    `Transfer shared files, project ownership, and active responsibilities from ${employee.name}.`
  );
  const [returnedItems, setReturnedItems] = useState(
    assignedEquipment.map((item) => item.id)
  );
  const [archiveConfirmed, setArchiveConfirmed] = useState(false);

  function complete(details) {
    context.completeOffboardingStep(employee.id, step.id, {
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      ...details,
    });
    onClose();
  }

  function toggleSystem(system) {
    setSelectedSystems((current) =>
      current.includes(system)
        ? current.filter((item) => item !== system)
        : [...current, system]
    );
  }

  function toggleEquipment(id) {
    setReturnedItems((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
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

        {step.id === "notify-teams" && (
          <div>
            <div className="workflow-form-grid">
              <div className="field">
                <label>Employee</label>
                <input value={employee.name} readOnly />
              </div>
              <div className="field">
                <label>Manager</label>
                <input value={managerName} onChange={(event) => setManagerName(event.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Recipients</label>
              <input value={`${managerName || "Manager"}, IT Operations`} readOnly />
            </div>
            <div className="field">
              <label>Departure notice</label>
              <textarea
                rows="6"
                value={notificationMessage}
                onChange={(event) => setNotificationMessage(event.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-primary"
                disabled={!managerName.trim() || !notificationMessage.trim()}
                onClick={() => complete({ managerName, notificationMessage, notifiedTeams: ["Manager", "IT Operations"] })}
              >
                <Mail /> Send notifications
              </button>
            </div>
          </div>
        )}

        {step.id === "revoke-access" && (
          <div>
            <p className="modal-sub">
              Select the accounts that should be disabled. Completing this task updates Department Access automatically.
            </p>
            <div className="access-option-list">
              {(approvedAccess.length
                ? approvedAccess.map((request) => request.system)
                : ["Microsoft 365", "Slack", "HR Portal", "VPN"]
              ).map((system) => (
                <label className="access-option" key={system}>
                  <input
                    type="checkbox"
                    checked={selectedSystems.includes(system)}
                    onChange={() => toggleSystem(system)}
                  />
                  <span>
                    <strong>{system}</strong>
                    <small>Disable account and revoke employee permissions</small>
                  </span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-primary"
                disabled={!selectedSystems.length}
                onClick={() => complete({ systems: selectedSystems, revokedAt: new Date().toISOString() })}
              >
                <ShieldOff /> Revoke selected access
              </button>
            </div>
          </div>
        )}

        {step.id === "transfer-files" && (
          <div>
            <div className="field">
              <label>Transfer ownership to</label>
              <input value={transferOwner} onChange={(event) => setTransferOwner(event.target.value)} />
            </div>
            <div className="field">
              <label>Handoff notes</label>
              <textarea
                rows="7"
                value={transferNotes}
                onChange={(event) => setTransferNotes(event.target.value)}
              />
            </div>
            <div className="saved-profile-note">
              Shared drives, project documents, and active ownership will be recorded as transferred to the selected owner.
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-primary"
                disabled={!transferOwner.trim() || !transferNotes.trim()}
                onClick={() => complete({ transferOwner, transferNotes })}
              >
                <Files /> Complete transfer
              </button>
            </div>
          </div>
        )}

        {step.id === "collect-equipment" && (
          <div>
            <p className="modal-sub">
              Confirm every assigned item that has been returned. Equipment Inventory will mark returned assets as available.
            </p>
            {assignedEquipment.length ? (
              <div className="access-option-list">
                {assignedEquipment.map((item) => (
                  <label className="access-option" key={item.id}>
                    <input
                      type="checkbox"
                      checked={returnedItems.includes(item.id)}
                      onChange={() => toggleEquipment(item.id)}
                    />
                    <span>
                      <strong>{item.item}</strong>
                      <small>{item.assetTag} · {item.status}</small>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="workflow-warning">
                No assigned equipment was found. You may confirm that there are no outstanding company assets.
              </div>
            )}
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-primary"
                disabled={assignedEquipment.length > 0 && returnedItems.length !== assignedEquipment.length}
                onClick={() => complete({ returnedEquipmentIds: returnedItems, itemCount: assignedEquipment.length })}
              >
                <Laptop /> Confirm equipment return
              </button>
            </div>
          </div>
        )}

        {step.id === "archive-employee" && (
          <div>
            <div className="archive-summary">
              <h4>Final offboarding review</h4>
              <dl>
                <div><dt>Employee</dt><dd>{employee.name}</dd></div>
                <div><dt>Department</dt><dd>{employee.department}</dd></div>
                <div><dt>Final working day</dt><dd>{employee.startLabel.replace("Last Day: ", "")}</dd></div>
                <div><dt>Tasks completed</dt><dd>{employee.steps.filter((item) => item.done).length} of {employee.steps.length - 1}</dd></div>
                <div><dt>Access</dt><dd>Ready to archive</dd></div>
                <div><dt>Equipment</dt><dd>Return confirmed</dd></div>
              </dl>
            </div>
            <label className="archive-confirmation">
              <input
                type="checkbox"
                checked={archiveConfirmed}
                onChange={(event) => setArchiveConfirmed(event.target.checked)}
              />
              <span>
                <strong>I confirm this employee is ready to be archived.</strong>
                <small>The employee will move to Completed Offboarding and disappear from active dashboard work.</small>
              </span>
            </label>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button
                type="button"
                className="btn-primary"
                disabled={!archiveConfirmed}
                onClick={() => complete({ archivedBy: context.currentUser.name, archivedAt: new Date().toISOString() })}
              >
                <Archive /> Archive employee
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OffboardingList({ context, employees }) {
  const activeEmployees = employees.filter((employee) => employee.progress < 100);
  const completedEmployees = employees.filter((employee) => employee.progress === 100);

  function renderJourneyRow(employee, completed = false) {
    return (
      <div className={`journey-row ${completed ? "completed-journey-row" : ""}`} key={employee.id}>
        <button className="person person-button" onClick={() => context.navigate(`/offboarding/${employee.id}`)}>
          <img src={employee.avatar} alt="" />
          <div>
            <strong>{employee.name}</strong>
            <div className="role">{employee.role}</div>
            <span className={`pill ${completed ? "green" : "rose"}`}>
              {completed ? "Offboarding completed" : employee.startLabel}
            </span>
          </div>
        </button>

        <div className="progress-block">
          <div className="label">Overall Progress</div>
          <div className="progress-bar-row">
            <div className="progress-track">
              <div className="progress-fill offboarding" style={{ width: `${employee.progress}%` }} />
            </div>
            <span className="progress-pct">{employee.progress}%</span>
          </div>
        </div>

        {completed ? (
          <div className="completed-onboarding-actions">
            <div>
              <span className="label">Employee record</span>
              <strong>Archived successfully</strong>
            </div>
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
          aria-label={`Open ${employee.name}'s offboarding workflow`}
          onClick={() => context.navigate(`/offboarding/${employee.id}`)}
        >
          <ChevronRight />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Offboarding</h2>
          <p>{activeEmployees.length} active offboarding journeys.</p>
        </div>
        <button className="btn-primary" onClick={context.startOffboarding}>
          <LogOut /> Start Offboarding
        </button>
      </div>

      <section className="onboarding-section">
        <div className="section-title-row">
          <div>
            <h3>Active offboarding</h3>
            <p>Employees who still have departure tasks to complete.</p>
          </div>
          <span className="section-count">{activeEmployees.length}</span>
        </div>
        <div className="card">
          {activeEmployees.map((employee) => renderJourneyRow(employee))}
          {!activeEmployees.length && <div className="empty-state">No active offboarding journeys.</div>}
        </div>
      </section>

      <section className="onboarding-section completed-onboarding-section">
        <div className="section-title-row">
          <div>
            <h3>Completed offboarding</h3>
            <p>Archived employees are moved here automatically after every task is complete.</p>
          </div>
          <span className="section-count complete">{completedEmployees.length}</span>
        </div>
        <div className="card">
          {completedEmployees.map((employee) => renderJourneyRow(employee, true))}
          {!completedEmployees.length && (
            <div className="empty-state">Completed offboarding journeys will appear here automatically.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function OffboardingWorkflow({ context, employee }) {
  const [activeStep, setActiveStep] = useState(null);
  const completedCount = employee.steps.filter((step) => step.done).length;
  const isComplete = completedCount === employee.steps.length;

  return (
    <div className="workflow-page">
      <button type="button" className="workflow-back" onClick={() => context.navigate("/offboarding")}>
        <ArrowLeft /> Back to offboarding
      </button>

      <div className="workflow-hero offboarding-workflow-hero">
        <div className="workflow-person">
          <img src={employee.avatar} alt="" />
          <div>
            <span className={`workflow-status offboarding-status ${isComplete ? "complete" : ""}`}>
              {isComplete ? "Offboarding complete" : "Offboarding in progress"}
            </span>
            <h2>{employee.name}</h2>
            <p>{employee.role} · {employee.department} · {employee.startLabel}</p>
          </div>
        </div>

        <div className="workflow-progress-summary">
          <div>
            <span>Journey progress</span>
            <strong>{employee.progress}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill offboarding" style={{ width: `${employee.progress}%` }} />
          </div>
          <small>{completedCount} of {employee.steps.length} tasks completed</small>
        </div>
      </div>

      {isComplete && (
        <div className="workflow-complete-banner">
          <CheckCircle2 />
          <div>
            <strong>{employee.name}'s offboarding is complete.</strong>
            <span>All access, equipment, handoff, and employee records have been completed and archived.</span>
          </div>
        </div>
      )}

      <div className="workflow-layout">
        <section className="workflow-task-section">
          <div className="workflow-section-heading">
            <div>
              <h3>Offboarding checklist</h3>
              <p>Complete each task in order to safely close the employee lifecycle.</p>
            </div>
          </div>

          <div className="workflow-task-list">
            {employee.steps.map((step, index) => {
              const Icon = STEP_ICONS[step.id] || Archive;
              const previousComplete = index === 0 || employee.steps[index - 1].done;
              const locked = !step.done && !previousComplete;

              return (
                <article
                  className={`workflow-task-card ${step.done ? "done" : ""} ${locked ? "locked" : ""}`}
                  key={step.id}
                >
                  <div className="workflow-task-number">{step.done ? <Check /> : index + 1}</div>
                  <div className="workflow-task-icon"><Icon /></div>
                  <div className="workflow-task-copy">
                    <div className="workflow-task-title-row">
                      <h4>{step.label}</h4>
                      <span className={`workflow-task-state ${step.done ? "done" : ""}`}>
                        {step.done ? "Completed" : locked ? "Waiting" : "Ready"}
                      </span>
                    </div>
                    <p>{step.description}</p>
                    {step.done && step.details && (
                      <small className="workflow-task-record">Completed and saved to this employee's offboarding record.</small>
                    )}
                  </div>
                  <button
                    type="button"
                    className={step.done ? "btn-secondary" : "btn-primary"}
                    disabled={locked || step.done}
                    onClick={() => setActiveStep(step)}
                  >
                    {step.done ? <><Check /> Done</> : locked ? "Complete previous task" : <>Start task <ChevronRight /></>}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="workflow-sidebar-card">
          <h3>Employee details</h3>
          <dl>
            <div><dt>Email</dt><dd>{employee.email}</dd></div>
            <div><dt>Department</dt><dd>{employee.department}</dd></div>
            <div><dt>Role</dt><dd>{employee.role}</dd></div>
            <div>
              <dt>Final working day</dt>
              <dd>{new Date(`${employee.startDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</dd>
            </div>
            <div><dt>Status</dt><dd>{isComplete ? "Archived" : "Offboarding"}</dd></div>
          </dl>
        </aside>
      </div>

      {activeStep && (
        <TaskModal employee={employee} step={activeStep} context={context} onClose={() => setActiveStep(null)} />
      )}
    </div>
  );
}

export default function Offboarding() {
  const context = useOutletContext();
  const { employeeId } = useParams();
  const offboardingEmployees = useMemo(
    () => context.employees.filter((employee) => employee.type === "offboarding"),
    [context.employees]
  );

  if (!employeeId) {
    return <OffboardingList context={context} employees={offboardingEmployees} />;
  }

  const employee = offboardingEmployees.find((item) => item.id === employeeId);

  if (!employee) {
    return (
      <div className="card empty-state">
        <h2>Offboarding journey not found</h2>
        <p>This employee may have been removed or the link is no longer valid.</p>
        <button className="btn-primary" onClick={() => context.navigate("/offboarding")}>
          Return to offboarding
        </button>
      </div>
    );
  }

  return <OffboardingWorkflow context={context} employee={employee} />;
}
