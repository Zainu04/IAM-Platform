import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Activity, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

export default function Compliance(){
  const c=useOutletContext();
  const metrics=useMemo(()=>({
    total:c.tasks.length,
    completed:c.tasks.filter(t=>t.done).length,
    open:c.tasks.filter(t=>!t.done).length,
    overdue:c.tasks.filter(t=>!t.done&&t.dueDate&&new Date(`${t.dueDate}T23:59:59`)<new Date()).length,
  }),[c.tasks]);
  const cards=[
    {label:"Completed tasks",value:metrics.completed,icon:CheckCircle2},
    {label:"Open tasks",value:metrics.open,icon:Clock3},
    {label:"Overdue tasks",value:metrics.overdue,icon:Activity},
    {label:"Audit events",value:c.auditLogs.length,icon:ShieldCheck},
  ];
  return <div>
    <div className="page-header"><div><h2>Compliance & System Quality</h2><p>Review task automation, accountability, security events, and measurable system outcomes.</p></div><span className="status-chip Approved">{c.systemMode}</span></div>
    <div className="metric-grid">{cards.map(({label,value,icon:Icon})=><div className="card metric-card" key={label}><Icon/><div><strong>{value}</strong><span>{label}</span></div></div>)}</div>
    <div className="card">
      <div className="card-head"><div><h3 className="section-title no-margin">Audit trail</h3><p className="qa-desc">Actions are timestamped and attributed to support privacy, security, and professional accountability.</p></div></div>
      {!c.auditLogs.length?<div className="empty-state">Complete a workflow action to create the first audit event.</div>:<div className="audit-list">{c.auditLogs.slice(0,50).map(log=><div className="audit-row" key={log.id}><div className="audit-dot"/><div><strong>{log.action.replaceAll("_"," ")}</strong><span>{log.actorName} · {log.actorRole}</span><small>{new Date(log.createdAt).toLocaleString()} · {log.resourceType} {log.resourceId}</small></div></div>)}</div>}
    </div>
    <div className="card quality-card"><h3>Verification targets</h3><ul><li>Related tasks complete automatically in the same user action.</li><li>All critical workflow actions create an audit event.</li><li>Unauthorized API requests return 401 or 403.</li><li>Equipment assignment conflicts are rejected.</li><li>Target API response time is under 500 ms in the demonstration environment.</li></ul></div>
  </div>
}
