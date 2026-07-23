import { makeId } from "./store.js";

const actionMap = {
  "assign-equipment": "EQUIPMENT_ASSIGNED",
  "provision-access": "ACCESS_PROVISIONED",
  "collect-documents": "DOCUMENTS_APPROVED",
  "send-welcome": "WELCOME_SENT",
  "schedule-orientation": "ORIENTATION_SCHEDULED",
  "revoke-access": "ACCESS_REVOKED",
  "collect-equipment": "EQUIPMENT_COLLECTED",
  "notify-teams": "TEAMS_NOTIFIED",
  "transfer-files": "FILES_TRANSFERRED",
  "archive-employee": "EMPLOYEE_ARCHIVED"
};

export function completeMatchingTasks(data, employeeId, actionType, actorId = "system") {
  const completedAt = new Date().toISOString();
  const completed = [];
  data.tasks = data.tasks.map(task => {
    if (task.employeeId === employeeId && task.actionType === actionType && task.status !== "COMPLETED") {
      completed.push(task.id);
      return { ...task, status: "COMPLETED", done: true, completedAt, completedBy: actorId };
    }
    return task;
  });
  return completed;
}

export function createWorkflowTasks(data, employee) {
  const due = employee.startDate || new Date().toISOString().slice(0, 10);
  const ownerByAction = {
    WELCOME_SENT: "HR_MANAGER", DOCUMENTS_APPROVED: "HR_MANAGER", ACCESS_PROVISIONED: "IT_MANAGER",
    EQUIPMENT_ASSIGNED: "IT_MANAGER", ORIENTATION_SCHEDULED: "HR_MANAGER", TEAMS_NOTIFIED: "HR_MANAGER",
    ACCESS_REVOKED: "IT_MANAGER", FILES_TRANSFERRED: "HR_MANAGER", EQUIPMENT_COLLECTED: "IT_MANAGER",
EMPLOYEE_ARCHIVED: "HR_MANAGER"
  };
  const labels = {
    WELCOME_SENT: `Send welcome letter to ${employee.name}`,
    DOCUMENTS_APPROVED: `Review documents for ${employee.name}`,
    ACCESS_PROVISIONED: `Provision system access for ${employee.name}`,
    EQUIPMENT_ASSIGNED: `Assign laptop to ${employee.name}`,
    ORIENTATION_SCHEDULED: `Schedule orientation for ${employee.name}`,
    TEAMS_NOTIFIED: `Notify IT and manager about ${employee.name}`,
    ACCESS_REVOKED: `Disable accounts for ${employee.name}`,
    FILES_TRANSFERRED: `Transfer files owned by ${employee.name}`,
    EQUIPMENT_COLLECTED: `Collect equipment from ${employee.name}`,
    EMPLOYEE_ARCHIVED: `Archive ${employee.name}'s employee record`
  };
  employee.steps.forEach((step, index) => {
    const actionType = actionMap[step.id];
    if (!actionType) return;
    data.tasks.push({
      id: makeId("task"), employeeId: employee.id, actionType,
      label: labels[actionType], subLabel: employee.type === "offboarding" ? "Offboarding" : "Onboarding",
      priority: index < 2 ? "High" : index < 4 ? "Medium" : "Low",
      assignedRole: ownerByAction[actionType], dueDate: due,
      status: step.done ? "COMPLETED" : "OPEN", done: Boolean(step.done), createdAt: new Date().toISOString()
    });
  });
}
