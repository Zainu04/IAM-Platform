import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileCheck2, FileClock, FileText, Search, Upload } from "lucide-react";

export default function Documents() {
  const c = useOutletContext();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => c.employees
    .filter((employee) => employee.name.toLowerCase().includes(query.toLowerCase()))
    .map((employee) => {
      const step = employee.steps?.find((item) => item.id === "collect-documents" || /document/i.test(item.label));
      const documents = step?.details?.documents || [];
      return {
        ...employee,
        complete: Boolean(step?.done),
        documents,
        documentTitles: [...new Set(documents.map((document) => document.title || document.name).filter(Boolean))],
      };
    }), [c.employees, query]);

  const complete = rows.filter((row) => row.complete).length;
  const waiting = rows.filter((row) => !row.complete).length;

  return (
    <div className="page-content role-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">HR workspace</p>
          <h1>Employee Documents</h1>
          <p>Track offer letters, tax forms, acknowledgements, and signed employment records.</p>
        </div>
        <button className="btn-primary" onClick={() => c.uploadDocument()}>
          <Upload /> Upload document
        </button>
      </div>

      <div className="document-metric-grid">
        <Metric tone="neutral" icon={FileText} value={rows.length} label="Employee files" />
        <Metric tone="complete" icon={FileCheck2} value={complete} label="Complete" />
        <Metric tone="waiting" icon={FileClock} value={waiting} label="Waiting" />
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employee documents" />
        </div>
      </div>

      <div className="data-card">
        <div className="data-card-header"><h2>Document status</h2><span className="pill gold">HR only</span></div>
        {rows.map((row) => (
          <div className="document-status-row" key={row.id}>
            <div className="role-list-icon"><FileText /></div>
            <div className="document-employee-copy">
              <strong>{row.name}</strong>
              <span>{row.department} · {row.email}</span>
              <div className="document-title-list">
                {row.documentTitles.length
                  ? row.documentTitles.map((title) => <small key={title}><FileCheck2 /> {title}</small>)
                  : <small className="missing-document-title">No document uploaded yet</small>}
              </div>
            </div>
            <span className={`pill ${row.complete ? "green" : "gold"}`}>{row.complete ? "Verified" : "Action required"}</span>
            <button className="btn-secondary document-row-action" onClick={() => c.uploadDocument(row.id)}>
              <Upload /> {row.complete ? "Add another" : "Upload"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, value, label, tone }) {
  return (
    <div className={`document-metric-card ${tone}`}>
      <div className="metric-icon"><Icon /></div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
