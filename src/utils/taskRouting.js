// Given a task, figure out exactly where the user needs to go to act on it.
// Equipment and access records in this app are keyed by employee *name*
// (see EquipmentInventory / AccessRequests), while employee journeys are
// keyed by employee *id* — so we look the employee up once and branch by
// actionType to build the right link.
export function getTaskRoute(task, employees = []) {
  if (task.route) return task.route;
  if (task.targetPath) return task.targetPath;
  const employee = employees.find((item) => item.id === task.employeeId);

  switch (task.actionType) {
    case "EQUIPMENT_ASSIGNED":
    case "EQUIPMENT_COLLECTED":
      return employee ? `/equipment?focus=${encodeURIComponent(employee.name)}` : "/equipment";

    case "ACCESS_PROVISIONED":
      return employee ? `/access-requests?focus=${employee.id}` : "/access-requests";

    case "ACCESS_REVOKED":
      return employee ? `/accounts?focus=${employee.id}` : "/accounts";

    case "ORIENTATION_SCHEDULED":
      return "/orientation";

    case "DOCUMENTS_APPROVED":
    case "WELCOME_SENT":
      return "/documents";

    default:
      if (!employee) return "/tasks";
      return employee.type === "offboarding"
        ? `/offboarding/${employee.id}`
        : `/onboarding/${employee.id}`;
  }
}
