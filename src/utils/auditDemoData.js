export const AUDIT_DEMO_LOGS = [
  {
    id: "audit-20260722-001",
    action: "ACCESS_REVOKED",
    resourceType: "Access",
    resourceId: "access-carter-slack",
    actorName: "Marcus Lee",
    actorEmail: "marcus.lee@journeyone.com",
    actorRole: "IT_MANAGER",
    createdAt: "2026-07-22T13:42:18-04:00",
    status: "SUCCESS",
    details: { employeeName: "Carter Johnson", employeeId: "emp-carter-johnson", employeeCode: "EMP-1048", department: "Engineering", system: "Slack", category: "Access Revoked", proof: "Slack workspace access revoked 18 minutes after HR submitted the offboarding request." }
  },
  {
    id: "audit-20260722-002",
    action: "HARDWARE_RETURNED",
    resourceType: "Equipment",
    resourceId: "asset-JO-2041",
    actorName: "Zainab Akhtar",
    actorEmail: "zainab.akhtar@journeyone.com",
    actorRole: "IT_MANAGER",
    createdAt: "2026-07-22T11:16:04-04:00",
    status: "SUCCESS",
    details: { employeeName: "Blaire Willow", employeeId: "emp-blaire-willow", employeeCode: "EMP-1034", department: "Design", system: "Jamf MDM", category: "Hardware Returned", assetTag: "JO-2041", serialNumber: "C02ZQ0MALVDL", proof: "MacBook Pro received by IT and MDM wipe verified." }
  },
  {
    id: "audit-20260721-003",
    action: "POLICY_SIGNED",
    resourceType: "Document",
    resourceId: "doc-security-policy-118",
    actorName: "Elizabeth Melody",
    actorEmail: "elizabeth.melody@journeyone.com",
    actorRole: "EMPLOYEE",
    createdAt: "2026-07-21T16:08:33-04:00",
    status: "SUCCESS",
    details: { employeeName: "Elizabeth Melody", employeeId: "emp-elizabeth-melody", employeeCode: "EMP-1051", department: "Finance", system: "JourneyOne Documents", category: "Policy Signed", documentTitle: "Information Security Acceptable Use Policy", proof: "Signed policy stored with timestamp and employee identifier." }
  },
  {
    id: "audit-20260721-004",
    action: "ORIENTATION_SCHEDULED",
    resourceType: "Orientation",
    resourceId: "orientation-elizabeth-01",
    actorName: "Nora Bennett",
    actorEmail: "nora.bennett@journeyone.com",
    actorRole: "HR_MANAGER",
    createdAt: "2026-07-21T10:27:51-04:00",
    status: "SUCCESS",
    details: { employeeName: "Elizabeth Melody", employeeId: "emp-elizabeth-melody", employeeCode: "EMP-1051", department: "Finance", system: "JourneyOne Orientation", category: "Orientation Scheduled", proof: "Orientation scheduled for July 28 at 9:00 AM with host Maya Patel." }
  },
  {
    id: "audit-20260720-005",
    action: "ACCESS_GRANTED",
    resourceType: "Access",
    resourceId: "access-blaire-figma",
    actorName: "Marcus Lee",
    actorEmail: "marcus.lee@journeyone.com",
    actorRole: "IT_MANAGER",
    createdAt: "2026-07-20T14:35:12-04:00",
    status: "SUCCESS",
    details: { employeeName: "Blaire Willow", employeeId: "emp-blaire-willow", employeeCode: "EMP-1034", department: "Design", system: "Figma", category: "Access Granted", requestor: "Nora Bennett", executor: "Marcus Lee", proof: "Figma Professional seat granted after HR request approval." }
  },
  {
    id: "audit-20260719-006",
    action: "ACCOUNT_DEACTIVATION_FAILED",
    resourceType: "Account",
    resourceId: "acct-carter-aws",
    actorName: "System Automation",
    actorEmail: "automation@journeyone.com",
    actorRole: "SYSTEM",
    createdAt: "2026-07-19T18:02:49-04:00",
    status: "FAILED",
    details: { employeeName: "Carter Johnson", employeeId: "emp-carter-johnson", employeeCode: "EMP-1048", department: "Engineering", system: "AWS IAM", category: "Access Revoked", proof: "Automated deactivation failed because the IAM role was managed outside JourneyOne. Manual review required." }
  },
  {
    id: "audit-20260719-007",
    action: "OFFBOARDING_INITIATED",
    resourceType: "Employee Journey",
    resourceId: "journey-carter-offboarding",
    actorName: "Nora Bennett",
    actorEmail: "nora.bennett@journeyone.com",
    actorRole: "HR_MANAGER",
    createdAt: "2026-07-19T17:44:21-04:00",
    status: "SUCCESS",
    details: { employeeName: "Carter Johnson", employeeId: "emp-carter-johnson", employeeCode: "EMP-1048", department: "Engineering", system: "JourneyOne", category: "Offboarding Started", proof: "HR submitted the offboarding request with a final employment time of July 19 at 5:30 PM." }
  },
  {
    id: "audit-20260718-008",
    action: "DOCUMENT_VERIFIED",
    resourceType: "Document",
    resourceId: "doc-i9-blaire",
    actorName: "Nora Bennett",
    actorEmail: "nora.bennett@journeyone.com",
    actorRole: "HR_MANAGER",
    createdAt: "2026-07-18T15:12:07-04:00",
    status: "SUCCESS",
    details: { employeeName: "Blaire Willow", employeeId: "emp-blaire-willow", employeeCode: "EMP-1034", department: "Design", system: "JourneyOne Documents", category: "Document Verified", documentTitle: "Form I-9", proof: "Form I-9 reviewed and marked complete by an authorized HR manager." }
  },
  {
    id: "audit-20260717-009",
    action: "ACCOUNT_PROVISIONED",
    resourceType: "Account",
    resourceId: "acct-elizabeth-google",
    actorName: "Zainab Akhtar",
    actorEmail: "zainab.akhtar@journeyone.com",
    actorRole: "IT_MANAGER",
    createdAt: "2026-07-17T09:05:44-04:00",
    status: "SUCCESS",
    details: { employeeName: "Elizabeth Melody", employeeId: "emp-elizabeth-melody", employeeCode: "EMP-1051", department: "Finance", system: "Google Workspace", category: "Account Provisioned", requestor: "Nora Bennett", executor: "Zainab Akhtar", proof: "Google Workspace account created with MFA enrollment required at first sign-in." }
  },
  {
    id: "audit-20260716-010",
    action: "EQUIPMENT_ASSIGNED",
    resourceType: "Equipment",
    resourceId: "asset-JO-2219",
    actorName: "Zainab Akhtar",
    actorEmail: "zainab.akhtar@journeyone.com",
    actorRole: "IT_MANAGER",
    createdAt: "2026-07-16T13:28:19-04:00",
    status: "SUCCESS",
    details: { employeeName: "Blaire Willow", employeeId: "emp-blaire-willow", employeeCode: "EMP-1034", department: "Design", system: "Jamf MDM", category: "Hardware Assigned", assetTag: "JO-2219", serialNumber: "FVFGH2KQ7CD6", proof: "MacBook Pro assigned and employee custody acknowledgement recorded." }
  }
];

export function getAuditLogs(logs = []) {
  // Keep the dashboard populated with realistic read-only demonstration evidence,
  // then layer live events from the current JourneyOne session on top.
  const combined = [...logs, ...AUDIT_DEMO_LOGS];
  const seen = new Set();
  return combined
    .filter((log) => {
      const key = log.id || `${log.action}-${log.resourceId}-${log.createdAt || log.timestamp}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
}
