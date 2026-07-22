import { makeId } from "./store.js";
export function addAudit(data, req, action, resourceType, resourceId, details = {}) {
  data.auditLogs.unshift({
    id: makeId("audit"),
    actorId: req.user?.sub || "system",
    actorName: req.user?.name || "System",
    actorRole: req.user?.role || "SYSTEM",
    action, resourceType, resourceId,
    details,
    ip: req.ip,
    createdAt: new Date().toISOString()
  });
}
