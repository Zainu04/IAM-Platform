import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileCheck2, FileClock, FileText, Search, Upload } from "lucide-react";

export default function Documents() {
  const c = useOutletContext();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => c.employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).map(e => {
    const step = e.steps?.find(s => /document/i.test(s.label));
    return { ...e, complete: Boolean(step?.done) };
  }), [c.employees, query]);
  return <div className="page-content role-page">
    <div className="page-heading"><div><p className="eyebrow">HR workspace</p><h1>Employee Documents</h1><p>Track offer letters, tax forms, acknowledgements, and signed employment records.</p></div><button className="btn-primary"><Upload/> Upload document</button></div>
    <div className="role-metric-grid compact"><Metric icon={FileText} value={rows.length} label="Employee files"/><Metric icon={FileCheck2} value={rows.filter(r=>r.complete).length} label="Complete"/><Metric icon={FileClock} value={rows.filter(r=>!r.complete).length} label="Waiting"/></div>
    <div className="toolbar"><div className="search-box"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search employee documents"/></div></div>
    <div className="data-card"><div className="data-card-header"><h2>Document status</h2><span className="pill gold">HR only</span></div>{rows.map(r=><div className="role-list-row" key={r.id}><div className="role-list-icon"><FileText/></div><div className="role-list-body"><strong>{r.name}</strong><span>{r.department} · {r.email}</span></div><span className={`pill ${r.complete?'green':'gold'}`}>{r.complete?'Verified':'Action required'}</span></div>)}</div>
  </div>;
}
function Metric({icon:Icon,value,label}){return <div className="role-metric-card"><div className="metric-icon"><Icon/></div><strong>{value}</strong><span>{label}</span></div>}
