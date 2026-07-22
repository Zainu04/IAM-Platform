import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Download, Filter, Search, ShieldCheck } from "lucide-react";
import { getAuditLogs } from "../utils/auditDemoData.js";

function readable(value = "") {
  return String(value).replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function eventDate(log) {
  return log.createdAt || log.timestamp;
}

function eventDetails(log) {
  const details = log.details || {};
  return {
    employee: details.employeeName || "System record",
    employeeCode: details.employeeCode || log.resourceId || "N/A",
    department: details.department || "—",
    category: details.category || readable(log.action || "System event"),
    system: details.system || readable(log.resourceType || "JourneyOne"),
    actor: log.actorEmail || log.actorName || log.userName || "System Automation",
    status: String(log.status || "SUCCESS").toUpperCase(),
    proof: details.proof || `${readable(log.action || "System event")} was recorded as immutable audit evidence.`,
  };
}

function isoTimestamp(value) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

export default function AuditHistory() {
  const c = useOutletContext();
  const logs = getAuditLogs(c.auditLogs || []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const rows = useMemo(() => logs.map((log) => ({ log, ...eventDetails(log) })), [logs]);
  const categories = ["ALL", ...new Set(rows.map((row) => row.category))];

  const filteredRows = useMemo(() => rows.filter((row) => {
    const haystack = `${row.employee} ${row.employeeCode} ${row.department} ${row.category} ${row.system} ${row.actor} ${row.status} ${row.proof}`.toLowerCase();
    return haystack.includes(query.toLowerCase())
      && (category === "ALL" || row.category === category)
      && (status === "ALL" || row.status === status);
  }), [rows, query, category, status]);

  const exportCsv = () => {
    const header = ["Timestamp", "Target Employee", "Employee ID", "Department", "Action Category", "System/App", "Initiated By", "Status", "Compliance Evidence"];
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [header, ...filteredRows.map((row) => [
      isoTimestamp(eventDate(row.log)), row.employee, row.employeeCode, row.department,
      row.category, row.system, row.actor, row.status, row.proof,
    ])].map((line) => line.map(escape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `journeyone-audit-evidence-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content role-page audit-history-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Auditor workspace</p>
          <h1>Audit History</h1>
          <p>The immutable event ledger used to verify who performed each lifecycle action, when it occurred, which employee or system was affected, and whether it succeeded.</p>
        </div>
        <button className="btn-primary audit-export-button" onClick={exportCsv}><Download /> Export CSV</button>
      </div>

      <div className="audit-readonly-note">
        <ShieldCheck />
        <div><strong>Read-only compliance evidence</strong><p>Auditors can search, filter, and export this ledger, but cannot edit or delete recorded events.</p></div>
      </div>

      <div className="audit-toolbar advanced">
        <label className="audit-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee, ID, app, actor, or action..." /></label>
        <label className="audit-filter"><Filter /><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option value={item} key={item}>{item === "ALL" ? "All action types" : item}</option>)}</select></label>
        <label className="audit-filter"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value="SUCCESS">Success</option><option value="FAILED">Failed</option><option value="PENDING">Pending</option></select></label>
      </div>

      <div className="data-card audit-ledger-card">
        <div className="data-card-header"><div><h2>Lifecycle event ledger</h2><p>{filteredRows.length} verified event{filteredRows.length === 1 ? "" : "s"}</p></div><span className="pill gold">Insert-only record</span></div>
        <div className="audit-table-wrap">
          <table className="audit-ledger-table">
            <thead><tr><th>Event timestamp</th><th>Target employee</th><th>Action</th><th>System / app</th><th>Initiated by</th><th>Status</th></tr></thead>
            <tbody>
              {filteredRows.map((row) => <tr key={row.log.id}>
                <td><code>{isoTimestamp(eventDate(row.log))}</code></td>
                <td><strong>{row.employee}</strong><span>{row.employeeCode} · {row.department}</span></td>
                <td><strong>{row.category}</strong><span>{row.proof}</span></td>
                <td>{row.system}</td>
                <td><strong>{row.actor}</strong><span>{readable(row.log.actorRole || "System")}</span></td>
                <td><span className={`audit-status ${row.status.toLowerCase()}`}>{readable(row.status)}</span></td>
              </tr>)}
              {!filteredRows.length && <tr><td colSpan="6"><div className="empty-state">No audit events match your current filters.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="audit-distinction-note">
        <strong>Audit History vs. Compliance</strong>
        <p><b>Audit History</b> is the factual evidence ledger: who did what, to which employee or system, at what exact time, and with what result. <b>Compliance</b> interprets that evidence to identify control gaps, overdue actions, SLA breaches, and risk.</p>
      </div>
    </div>
  );
}
