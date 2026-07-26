import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Clock3, FileCheck2, XCircle } from "lucide-react";
import { getAuditLogs } from "../utils/auditDemoData.js";

export default function Compliance() {
  const c = useOutletContext();
  const metrics = useMemo(() => {
    const total = c.tasks.length || 1;
    const completed = c.tasks.filter((task) => task.done || task.status === "COMPLETED").length;
    const open = c.tasks.filter((task) => !(task.done || task.status === "COMPLETED")).length;
    const overdue = c.tasks.filter((task) => !(task.done || task.status === "COMPLETED") && task.dueDate && new Date(`${task.dueDate}T23:59:59`) < new Date()).length;
    const approvedAccess = c.accessRequests.filter((request) => request.status === "Approved").length;
    const auditLogs = getAuditLogs(c.auditLogs || []);
    const criticalRisks = auditLogs.filter((log) =>
      String(log.status || "").toUpperCase() === "FAILED" && /ACCESS|ACCOUNT/i.test(log.action || "")
    ).length;
    const controlCount = 6;
    const riskPercent = criticalRisks === 0 ? 0 : Math.min(100, Math.max(1, Math.round((criticalRisks / controlCount) * 100)));
    return { total, completed, open, overdue, approvedAccess, criticalRisks, score: Math.round((completed / total) * 100), riskPercent };
  }, [c.tasks, c.accessRequests, c.auditLogs]);

  const controls = [
    { title: "Onboarding task completion", detail: `${metrics.completed} of ${metrics.total} workflow tasks contain completion evidence.`, status: metrics.score >= 80 ? "pass" : "warning" },
    { title: "Overdue workflow controls", detail: metrics.overdue ? `${metrics.overdue} task${metrics.overdue === 1 ? " is" : "s are"} past the required due date.` : "No open workflow tasks are currently overdue.", status: metrics.overdue ? "warning" : "pass" },
    { title: "Access approval evidence", detail: `${metrics.approvedAccess} approved request${metrics.approvedAccess === 1 ? " has" : "s have"} a recorded decision trail.`, status: "pass" },
    { title: "Role-based access protection", detail: "Auditor accounts remain read-only and operational changes require an authorized HR or IT role.", status: "pass" },
    { title: "Critical access risk", detail: metrics.criticalRisks ? `${metrics.criticalRisks} failed account or access action still requires verified remediation.` : "No failed account or access actions currently require remediation.", status: metrics.criticalRisks ? "warning" : "pass" },
    { title: "Open workflow exposure", detail: `${metrics.open} task${metrics.open === 1 ? " remains" : "s remain"} open and should be reviewed by the assigned manager.`, status: metrics.open > 5 ? "warning" : "pass" },
  ];

  return (
    <div className="compliance-page">
      <div className="page-header"><div><p className="eyebrow">Control monitoring</p><h2>Compliance & System Quality</h2><p>Evaluate whether required controls are being followed—not the individual action-by-action event history.</p></div><span className="status-chip Approved">{c.systemMode}</span></div>

      <div className="compliance-overview-grid">
        <div className="compliance-score-card"><div className="compliance-score-ring" style={{ "--score": `${metrics.riskPercent * 3.6}deg` }}><span>{metrics.riskPercent}%</span></div><div><p>Controls at risk</p><h3>{metrics.criticalRisks === 0 ? "No critical risks" : `${metrics.criticalRisks} critical risk${metrics.criticalRisks === 1 ? "" : "s"}`}</h3><small>Calculated from the same failed access and account evidence shown in the critical-risk card.</small></div></div>
        <div className="compliance-mini-card success"><CheckCircle2 /><div><strong>{metrics.completed}</strong><span>Controls satisfied</span></div></div>
        <div className="compliance-mini-card warning"><Clock3 /><div><strong>{metrics.open}</strong><span>Controls still open</span></div></div>
        <div className="compliance-mini-card danger"><AlertTriangle /><div><strong>{metrics.criticalRisks}</strong><span>Critical risks</span></div></div>
      </div>

      <div className="card compliance-control-card">
        <div className="card-head"><div><h3 className="section-title no-margin">Control checklist</h3><p className="qa-desc">Each item summarizes current risk and whether JourneyOne is meeting the expected control.</p></div><span className="pill gold">{controls.filter((item) => item.status === "pass").length}/{controls.length} passing</span></div>
        <div className="compliance-control-list">
          {controls.map((control) => {
            const Icon = control.status === "pass" ? FileCheck2 : XCircle;
            return <div className={`compliance-control-row ${control.status}`} key={control.title}><div className="compliance-control-icon"><Icon /></div><div><strong>{control.title}</strong><p>{control.detail}</p></div><span>{control.status === "pass" ? "Passing" : "Review"}</span></div>;
          })}
        </div>
      </div>

    </div>
  );
}
