import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Good morning!</h2>
          <p>Here&apos;s what needs your attention today — IAM lifecycle overview</p>
        </div>
        <div className="page-header-right">
          <button className="btn btn-secondary">▦ Generate report</button>
          <button className="btn btn-primary">＋ Start onboarding</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-label">Active employees</div>
          <div className="kpi-value">312</div>
          <div className="kpi-sub"><span className="up">↑ 6</span> added this month</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: '82%' }} /></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Pending onboarding</div>
          <div className="kpi-value">4</div>
          <div className="kpi-sub"><span className="warn">2 start this week</span></div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: '40%' }} /></div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">Pending offboarding</div>
          <div className="kpi-value">1</div>
          <div className="kpi-sub"><span className="down">Due in 2 days</span></div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: '15%' }} /></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-label">Open access requests</div>
          <div className="kpi-value">3</div>
          <div className="kpi-sub"><span className="warn">1 overdue</span> approval</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: '30%' }} /></div>
        </div>
        <div className="kpi-card slate">
          <div className="kpi-label">Equipment in stock</div>
          <div className="kpi-value">87</div>
          <div className="kpi-sub">14 reserved for new hires</div>
          <div className="kpi-bar"><div className="kpi-bar-fill" style={{ width: '65%' }} /></div>
        </div>
      </div>

      <div className="section-title">Quick actions</div>
      <div className="quick-grid">
        <div className="quick-card"><div className="quick-icon blue">＋</div><div><div className="qt-title">Start onboarding</div><div className="qt-sub">Create a new hire record</div></div></div>
        <div className="quick-card"><div className="quick-icon red">−</div><div><div className="qt-title">Start offboarding</div><div className="qt-sub">Initiate employee exit checklist</div></div></div>
        <div className="quick-card"><div className="quick-icon amber">✓</div><div><div className="qt-title">Review access requests</div><div className="qt-sub">3 requests awaiting approval</div></div></div>
        <div className="quick-card"><div className="quick-icon slate">▤</div><div><div className="qt-title">Generate report</div><div className="qt-sub">Export activity summary</div></div></div>
      </div>

      <div className="section-title">Tasks &amp; activity</div>
      <div className="main-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-title">Tasks requiring attention</div>
              <div className="card-sub">Sorted by urgency — overdue items first</div>
            </div>
            <button className="btn btn-ghost btn-sm">View all tasks →</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th></th><th>Employee</th><th>Task</th><th>Type</th><th>Due</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="checkbox" /></td>
                  <td><div className="av-pill"><div className="av">RC</div><div><span className="td-primary">R. Chen</span><span className="td-sub">Engineering · EMP-00461</span></div></div></td>
                  <td><span className="td-normal">Access revocation</span></td>
                  <td><span className="badge badge-red">Offboarding</span></td>
                  <td className="due-red">Yesterday</td>
                  <td><span className="badge badge-red">Overdue</span></td>
                  <td><span className="row-link">Open →</span></td>
                </tr>
                <tr>
                  <td><span className="checkbox" /></td>
                  <td><div className="av-pill"><div className="av">MA</div><div><span className="td-primary">M. Alvarez</span><span className="td-sub">Marketing · EMP-00482</span></div></div></td>
                  <td><span className="td-normal">Equipment assignment</span></td>
                  <td><span className="badge badge-blue">Onboarding</span></td>
                  <td className="due-amber">Today</td>
                  <td><span className="badge badge-amber">In progress</span></td>
                  <td><span className="row-link">Open →</span></td>
                </tr>
                <tr>
                  <td><span className="checkbox" /></td>
                  <td><div className="av-pill"><div className="av">SP</div><div><span className="td-primary">S. Patel</span><span className="td-sub">Finance · EMP-00451</span></div></div></td>
                  <td><span className="td-normal">Temp access expiring (VPN)</span></td>
                  <td><span className="badge badge-gray">Access</span></td>
                  <td className="due-normal">In 3 days</td>
                  <td><span className="badge badge-gray">Scheduled</span></td>
                  <td><span className="row-link">Open →</span></td>
                </tr>
                <tr>
                  <td><span className="checkbox" /></td>
                  <td><div className="av-pill"><div className="av">TN</div><div><span className="td-primary">T. Nguyen</span><span className="td-sub">Sales · EMP-00479</span></div></div></td>
                  <td><span className="td-normal">Manager approval needed</span></td>
                  <td><span className="badge badge-gray">Access</span></td>
                  <td className="due-normal">In 4 days</td>
                  <td><span className="badge badge-amber">Awaiting approval</span></td>
                  <td><span className="row-link">Open →</span></td>
                </tr>
                <tr>
                  <td><span className="checkbox" /></td>
                  <td><div className="av-pill"><div className="av green">KB</div><div><span className="td-primary">K. Brooks</span><span className="td-sub">HR · EMP-00483</span></div></div></td>
                  <td><span className="td-normal">New hire paperwork</span></td>
                  <td><span className="badge badge-blue">Onboarding</span></td>
                  <td className="due-normal">In 6 days</td>
                  <td><span className="badge badge-gray">Not started</span></td>
                  <td><span className="row-link">Open →</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="pag-info">Showing 5 of 11 tasks</div>
            <div className="pag-pages"><div className="pag-btn">‹</div><div className="pag-btn active">1</div><div className="pag-btn">2</div><div className="pag-btn">3</div><div className="pag-btn">›</div></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-header-left"><div className="card-title">Recent activity</div><div className="card-sub">System and user actions</div></div></div>
          <div className="feed">
            <div className="feed-item"><div className="feed-dot green">✓</div><div><div className="feed-title">Account provisioned for <span>D. Walsh</span> (Engineering)</div><div className="feed-meta">12 min ago · J. Diaz</div></div></div>
            <div className="feed-item"><div className="feed-dot red">×</div><div><div className="feed-title">Access request denied — elevated DB access for <span>T. Nguyen</span></div><div className="feed-meta">1 hr ago · M. Reyes (Manager)</div></div></div>
            <div className="feed-item"><div className="feed-dot blue">▣</div><div><div className="feed-title">Laptop #LP-2291 assigned to <span>M. Alvarez</span></div><div className="feed-meta">2 hrs ago · IT Inventory (auto)</div></div></div>
            <div className="feed-item"><div className="feed-dot amber">!</div><div><div className="feed-title">Temp access for <span>S. Patel</span> expiring in 3 days</div><div className="feed-meta">4 hrs ago · System reminder</div></div></div>
            <div className="feed-item"><div className="feed-dot green">✓</div><div><div className="feed-title">Offboarding completed for <span>A. Romero</span> — all access revoked</div><div className="feed-meta">Yesterday · System (automated)</div></div></div>
            <div className="feed-item"><div className="feed-dot blue">＋</div><div><div className="feed-title">Onboarding started for <span>K. Brooks</span> — HR department</div><div className="feed-meta">Yesterday · S. Lopez (HR)</div></div></div>
          </div>
        </div>
      </div>

      <div className="section-title">Department access snapshot</div>
      <div className="card full-card">
        <div className="card-header">
          <div className="card-header-left"><div className="card-title">Department access templates</div><div className="card-sub">Active provisioning templates and assigned employee counts</div></div>
          <button className="btn btn-secondary btn-sm">Manage templates →</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Department</th><th>Template name</th><th>Systems &amp; access</th><th>Employees</th><th>Last updated</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><span className="td-primary">Engineering</span></td><td>ENG — Standard Access</td><td><span className="tag">GitHub</span><span className="tag">Jira</span><span className="tag">AWS</span><span className="tag">Slack</span></td><td className="mono-cell">84</td><td className="muted-date">Mar 14, 2025</td><td><span className="badge badge-green">Active</span></td></tr>
              <tr><td><span className="td-primary">Marketing</span></td><td>MKT — Standard Access</td><td><span className="tag">HubSpot</span><span className="tag">Slack</span><span className="tag">Drive</span></td><td className="mono-cell">41</td><td className="muted-date">Feb 02, 2025</td><td><span className="badge badge-green">Active</span></td></tr>
              <tr><td><span className="td-primary">Finance</span></td><td>FIN — Restricted Access</td><td><span className="tag">SAP</span><span className="tag">NetSuite</span><span className="tag">Slack</span></td><td className="mono-cell">23</td><td className="muted-date">Apr 01, 2025</td><td><span className="badge badge-green">Active</span></td></tr>
              <tr><td><span className="td-primary">Sales</span></td><td>SLS — Standard Access</td><td><span className="tag">Salesforce</span><span className="tag">Slack</span><span className="tag">Zoom</span></td><td className="mono-cell">56</td><td className="muted-date">Jan 19, 2025</td><td><span className="badge badge-amber">Review needed</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
