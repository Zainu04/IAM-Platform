import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
  AtSign, Building2, Briefcase, KeyRound, Power, RotateCcw,
  Search, Sparkles, UserCog, X,
} from "lucide-react";

function Metric({ icon: Icon, value, label, note, tone }) {
  return (
    <div className={`account-summary-card ${tone}`}>
      <div className="account-summary-icon"><Icon /></div>
      <div className="account-summary-copy">
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{note}</small>
      </div>
      <div className="account-summary-accent" aria-hidden="true" />
    </div>
  );
}

function AccountAvatar({ employee }) {
  if (employee.avatar) return <img className="account-card-avatar" src={employee.avatar} alt="" />;
  const initials = employee.name?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return <div className="account-card-avatar account-card-avatar-fallback">{initials}</div>;
}

function AccountCard({ employee, onManage }) {
  const status = employee.accountStatus || "Active";
  return (
    <div className="account-card">
      <div className="account-card-top">
        <AccountAvatar employee={employee} />
        <span className={`pill ${status === "Active" ? "green" : "red"}`}>{status}</span>
      </div>
      <h3 className="account-card-name">{employee.name}</h3>
      <p className="account-card-email"><AtSign size={14} />{employee.email}</p>
      <p className="account-card-meta"><Briefcase size={14} />{employee.role} <span className="dot-sep">·</span> <Building2 size={14} />{employee.department}</p>
      {employee.type && (
        <span className={`pill ${employee.type === "offboarding" ? "gold" : "rose"} account-journey-pill`}>
          {employee.type === "offboarding" ? "Offboarding" : "Onboarding"} · {employee.progress}%
        </span>
      )}
      <button className="btn-primary account-manage-btn" onClick={() => onManage(employee)}>
        <UserCog size={16} /> Manage account
      </button>
    </div>
  );
}

function ManageAccountModal({ employee, onClose, onSave, onToggleStatus, onResetPassword }) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [role, setRole] = useState(employee.role);
  const [department, setDepartment] = useState(employee.department);
  const status = employee.accountStatus || "Active";

  useEffect(() => {
    setName(employee.name); setEmail(employee.email); setRole(employee.role); setDepartment(employee.department);
  }, [employee.id]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 460 }}>
        <div className="modal-head">
          <h3>Manage account</h3>
          <button className="modal-close" onClick={onClose}><X /></button>
        </div>
        <p className="modal-sub">Update {employee.name.split(" ")[0]}'s profile, credentials, and account status.</p>

        <div className="account-modal-identity">
          <AccountAvatar employee={employee} />
          <div>
            <strong>{employee.name}</strong>
            <span className={`pill ${status === "Active" ? "green" : "red"}`}>{status}</span>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(employee.id, { name: name.trim(), email: email.trim(), role: role.trim(), department: department.trim() });
          }}
        >
          <div className="field"><label>Full name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="field"><label>Email address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="field"><label>Role / Title</label><input value={role} onChange={(e) => setRole(e.target.value)} required /></div>
          <div className="field"><label>Department</label><input value={department} onChange={(e) => setDepartment(e.target.value)} required /></div>

          <div className="account-modal-quick-actions">
            <button type="button" className="btn-secondary" onClick={() => onResetPassword(employee.id)}>
              <RotateCcw size={15} /> Reset password
            </button>
            <button type="button" className={status === "Active" ? "btn-danger" : "btn-secondary"} onClick={() => onToggleStatus(employee.id)}>
              <Power size={15} /> {status === "Active" ? "Disable account" : "Re-enable account"}
            </button>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary"><Sparkles size={15} /> Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Accounts() {
  const c = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [managing, setManaging] = useState(null);

  const accounts = useMemo(() => {
    const byProfile = new Map();
    c.employees.forEach((employee) => {
      const key = employee.profileId || employee.id;
      const existing = byProfile.get(key);
      if (!existing || (employee.progress < 100 && existing.progress === 100)) byProfile.set(key, employee);
    });
    return Array.from(byProfile.values());
  }, [c.employees]);

  const filtered = accounts.filter((e) =>
    `${e.name} ${e.email} ${e.role} ${e.department}`.toLowerCase().includes(query.toLowerCase())
  );

  const toProvision = c.employees.filter((e) => e.type === "onboarding" && e.progress < 100).length;
  const toDisable = c.employees.filter((e) => e.type === "offboarding" && e.progress < 100).length;
  const credentialTasks = c.tasks.filter((t) => /access|account|password/i.test(t.label) && !t.done).length;

  const focusId = searchParams.get("focus");
  useEffect(() => {
    if (!focusId) return;
    const employee = accounts.find((e) => e.id === focusId || e.profileId === focusId);
    if (employee) setManaging(employee);
  }, [focusId, accounts]);

  function closeModal() {
    setManaging(null);
    if (searchParams.get("focus")) { searchParams.delete("focus"); setSearchParams(searchParams, { replace: true }); }
  }

  return (
    <div className="page-content role-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">IT workspace</p>
          <h1>Account Administration</h1>
          <p>Create corporate accounts, reset credentials, and disable access during offboarding.</p>
        </div>
      </div>

      <div className="account-summary-grid">
        <Metric icon={AtSign} value={toProvision} label="Accounts to provision" note="New employee setup" tone="provision" />
        <Metric icon={Power} value={toDisable} label="Accounts to disable" note="Offboarding actions" tone="disable" />
        <Metric icon={KeyRound} value={credentialTasks} label="Credential tasks" note="Passwords and access" tone="credential" />
      </div>

      <div className="search-box account-search">
        <Search />
        <input placeholder="Search accounts by name, email, role..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length ? (
        <div className="account-card-grid">
          {filtered.map((employee) => (
            <AccountCard key={employee.id} employee={employee} onManage={setManaging} />
          ))}
        </div>
      ) : (
        <div className="empty-state">No accounts match your search.</div>
      )}

      {managing && (
        <ManageAccountModal
          employee={accounts.find((e) => e.id === managing.id) || managing}
          onClose={closeModal}
          onSave={(id, updates) => { c.updateEmployeeAccount(id, updates); closeModal(); }}
          onToggleStatus={(id) => c.toggleAccountStatus(id)}
          onResetPassword={(id) => c.resetAccountPassword(id)}
        />
      )}
    </div>
  );
}
