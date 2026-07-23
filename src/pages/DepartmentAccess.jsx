import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Building2, Plus, Search, ShieldCheck, Trash2, X } from "lucide-react";

function AddSystemModal({ department, onClose, onAdd }) {
  const [system, setSystem] = useState("");
  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 420 }}>
        <div className="modal-head">
          <h3>Add department access</h3>
          <button className="modal-close" onClick={onClose}><X /></button>
        </div>
        <p className="modal-sub">Add an application or system to the default access package for {department.name}.</p>
        <form onSubmit={(event) => { event.preventDefault(); if (system.trim()) onAdd(system.trim()); }}>
          <div className="field">
            <label>Application or system</label>
            <input autoFocus value={system} onChange={(event) => setSystem(event.target.value)} placeholder="e.g. Figma, Canva, GitHub" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary"><Plus size={15} /> Add access</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DepartmentAccess() {
  const context = useOutletContext();
  const [query, setQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const filteredDepartments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return context.departments;
    return context.departments.filter((department) =>
      `${department.name} ${department.systems.join(" ")}`.toLowerCase().includes(normalized)
    );
  }, [context.departments, query]);

  const totalSystems = context.departments.reduce((total, department) => total + department.systems.length, 0);

  function addSystem(system) {
    const exists = selectedDepartment.systems.some((item) => item.toLowerCase() === system.toLowerCase());
    if (exists) {
      context.flash(`${system} is already included for ${selectedDepartment.name}.`);
      return;
    }
    context.setDepartments((departments) => departments.map((department) =>
      department.id === selectedDepartment.id
        ? { ...department, systems: [...department.systems, system] }
        : department
    ));
    context.recordAudit("DEPARTMENT_ACCESS_UPDATED", "department", selectedDepartment.id, {
      department: selectedDepartment.name,
      system,
      action: "added",
    });
    context.flash(`${system} added to ${selectedDepartment.name}.`);
    setSelectedDepartment(null);
  }

  function removeSystem(department, system) {
    context.setDepartments((departments) => departments.map((item) =>
      item.id === department.id
        ? { ...item, systems: item.systems.filter((entry) => entry !== system) }
        : item
    ));
    context.recordAudit("DEPARTMENT_ACCESS_UPDATED", "department", department.id, {
      department: department.name,
      system,
      action: "removed",
    });
    context.flash(`${system} removed from ${department.name}.`);
  }

  return (
    <div className="page-content role-page department-access-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">IT workspace</p>
          <h1>Department Access</h1>
          <p>Manage the standard applications and systems employees receive based on their department.</p>
        </div>
      </div>

      <div className="department-access-summary">
        <div><Building2 /><span><strong>{context.departments.length}</strong> Departments</span></div>
        <div><ShieldCheck /><span><strong>{totalSystems}</strong> Access assignments</span></div>
      </div>

      <div className="search-box department-access-search">
        <Search />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search departments or applications..." />
      </div>

      <div className="department-access-grid">
        {filteredDepartments.map((department) => (
          <section className="department-access-card" key={department.id}>
            <div className="department-access-card-head">
              <div className="department-access-icon" style={{ "--department-color": department.color }}>
                <Building2 />
              </div>
              <div>
                <h2>{department.name}</h2>
                <p>{department.systems.length} approved {department.systems.length === 1 ? "system" : "systems"}</p>
              </div>
            </div>

            <div className="department-system-list">
              {department.systems.map((system) => (
                <div className="department-system-row" key={system}>
                  <span><ShieldCheck />{system}</span>
                  <button title={`Remove ${system}`} onClick={() => removeSystem(department, system)}><Trash2 /></button>
                </div>
              ))}
              {!department.systems.length && <div className="department-system-empty">No systems assigned yet.</div>}
            </div>

            <button className="btn-secondary department-add-system" onClick={() => setSelectedDepartment(department)}>
              <Plus size={16} /> Add application or system
            </button>
          </section>
        ))}
      </div>

      {!filteredDepartments.length && <div className="empty-state">No departments or applications match your search.</div>}

      {selectedDepartment && (
        <AddSystemModal
          department={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          onAdd={addSystem}
        />
      )}
    </div>
  );
}
