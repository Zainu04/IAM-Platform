// Single source of truth for role identifiers and which workflow steps
// belong to which role. Role identifiers always match the JWT `role` claim
// issued by the API (IT_MANAGER / HR_MANAGER / AUDITOR) so client-side task
// filtering, server-side authorization, and audit logs never disagree with
// each other. Anywhere a human-readable label is needed, use ROLE_LABEL.

export const ROLE_LABEL = {
  IT_MANAGER: "IT Manager",
  HR_MANAGER: "HR Manager",
  AUDITOR: "Auditor",
};

export function roleLabel(role) {
  return ROLE_LABEL[role] || role;
}

// Workflow step ids that IT is responsible for completing. These must stay
// in sync with the `itSteps` set enforced in server/lib/automation.js and
// server/app.js. Everything else defaults to HR.
export const IT_OWNED_STEP_IDS = new Set([
  "assign-equipment",
  "provision-access",
  "revoke-access",
  "collect-equipment",
]);

export function stepOwnerRole(stepId) {
  return IT_OWNED_STEP_IDS.has(stepId) ? "IT_MANAGER" : "HR_MANAGER";
}
