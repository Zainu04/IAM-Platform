import { useEffect, useRef } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Check, X, KeyRound } from "lucide-react";

export default function AccessRequests() {
  const c = useOutletContext();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("focus");
  const rowRefs = useRef({});

  const pending = c.accessRequests.filter((r) => r.status === "Pending");
  const resolved = c.accessRequests.filter((r) => r.status !== "Pending");

  useEffect(() => {
    if (!focusId) return;
    const node = rowRefs.current[focusId];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusId, c.accessRequests]);

  function table(rows, actions) {
    return (
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th><th>System</th><th>Requested</th><th>Status</th>
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} ref={(node) => (rowRefs.current[r.id] = node)} className={focusId === r.id ? "row-highlight" : ""}>
              <td><div className="table-person"><img src={r.avatar} alt="" /><strong>{r.name}</strong></div></td>
              <td>{r.system}</td>
              <td>{r.requested}</td>
              <td><span className={`status-chip ${r.status}`}>{r.status}</span></td>
              {actions && (
                <td>
                  <button className="icon-btn approve" onClick={() => c.decideAccess(r.id, "Approved")}><Check /></button>
                  <button className="icon-btn deny" onClick={() => c.decideAccess(r.id, "Denied")}><X /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Access Requests</h2>
          <p>{pending.length} requests waiting on your review.</p>
        </div>
      </div>
      <div className="card">
        <h3 className="section-title">Pending</h3>
        {pending.length ? table(pending, true) : (
          <div className="empty-state"><KeyRound />Nothing pending — nice work.</div>
        )}
      </div>
      {resolved.length > 0 && (
        <div className="card section-gap">
          <h3 className="section-title">Resolved</h3>
          {table(resolved, false)}
        </div>
      )}
    </div>
  );
}
