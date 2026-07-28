import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Check, Laptop, Plus, Search, UserRound, X } from "lucide-react";

function AssignEquipmentModal({ equipment, employees, onClose, onAssign }) {
  const eligibleEmployees = useMemo(
    () => employees.filter((employee) => employee.type === "onboarding" && employee.status !== "Archived"),
    [employees]
  );
  const preselected = eligibleEmployees.find((employee) => employee.name === equipment.assignedTo)?.id || "";
  const [employeeId, setEmployeeId] = useState(preselected);

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-card equipment-assignment-modal" role="dialog" aria-modal="true" aria-labelledby="assign-equipment-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Equipment assignment</p>
            <h2 id="assign-equipment-title">Assign device to an employee</h2>
            <p>Choose the employee who should receive this available device.</p>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close assignment form"><X /></button>
        </div>

        <div className="assignment-device-preview">
          <span className="assignment-device-icon"><Laptop /></span>
          <div>
            <strong>{equipment.item}</strong>
            <span>{equipment.assetTag}</span>
          </div>
          <span className={`status-chip ${equipment.status.replace(/\s+/g, "")}`}>{equipment.status}</span>
        </div>

        <div className="field">
          <label htmlFor="equipment-employee">Assign to</label>
          <div className="select-with-icon">
            <UserRound />
            <select id="equipment-employee" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} required>
              <option value="">Choose an employee...</option>
              {eligibleEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} — {employee.department}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="btn-primary" type="button" disabled={!employeeId} onClick={() => onAssign(equipment.id, employeeId)}>
            <Check /> Assign equipment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EquipmentInventory() {
  const c = useOutletContext();
  const [searchParams] = useSearchParams();
  const focusName = searchParams.get("focus");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState("");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
  const [assigningEquipment, setAssigningEquipment] = useState(null);
  const rowRefs = useRef({});

  useEffect(() => {
    if (!focusName) return;
    const match = c.equipment.find((eq) => eq.assignedTo === focusName);
    const node = match && rowRefs.current[match.id];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusName, c.equipment]);

  const filteredEquipment = c.equipment.filter((eq) =>
    `${eq.item} ${eq.assetTag} ${eq.assignedTo} ${eq.status}`.toLowerCase().includes(query.toLowerCase())
  );

  const focusEmployee = focusName ? c.employees.find((employee) => employee.name === focusName) : null;
  const focusHasEquipment = focusName ? c.equipment.some((eq) => eq.assignedTo === focusName) : true;
  const collectEquipmentStep = focusEmployee?.steps?.find((step) => step.id === "collect-equipment");
  const canCloseOutCollectStep =
    focusEmployee?.type === "offboarding" && collectEquipmentStep && !collectEquipmentStep.done;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Equipment</h2>
          <p>Track hardware assigned to onboarding and offboarding employees.</p>
        </div>
        <button className="btn-primary" onClick={() => setShow(!show)}><Plus />Add equipment</button>
      </div>
      {focusName && !focusHasEquipment && (
        <div className="card empty-state" role="status">
          No equipment is currently assigned to <strong>{focusName}</strong>
          {focusEmployee?.type === "offboarding" ? " — there's nothing outstanding to collect." : "."}
          {canCloseOutCollectStep && (
            <div className="modal-actions" style={{ marginTop: "0.75rem" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  c.completeOffboardingStep(focusEmployee.id, "collect-equipment", {
                    employeeName: focusEmployee.name,
                    employeeAvatar: focusEmployee.avatar,
                    returnedItem: "No equipment outstanding",
                  })
                }
              >
                <Check /> Confirm nothing outstanding
              </button>
            </div>
          )}
        </div>
      )}
      {show && (
        <form
          className="card inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (item) c.addEquipment({ item, assetTag: tag || `JO-${Date.now().toString().slice(-4)}`, assignedTo: "Unassigned", status: "Available" });
            setItem(""); setTag(""); setShow(false);
          }}
        >
          <div className="field"><label>Equipment name</label><input value={item} onChange={(e) => setItem(e.target.value)} required /></div>
          <div className="field"><label>Asset tag</label><input value={tag} onChange={(e) => setTag(e.target.value)} /></div>
          <button className="btn-primary">Save equipment</button>
        </form>
      )}
      <div className="equipment-toolbar">
        <div className="search-box equipment-search">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by model, asset tag, employee, or status..."
            aria-label="Search equipment"
          />
        </div>
        <span className="equipment-result-count">{filteredEquipment.length} item{filteredEquipment.length === 1 ? "" : "s"}</span>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Item</th><th>Asset Tag</th><th>Assigned To</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filteredEquipment.map((eq) => {
              const canAssign = eq.status === "Available" || eq.status === "Pending Assignment" || eq.assignedTo === "Unassigned";
              const assignedEmployee = c.employees.find((employee) => employee.id === eq.employeeId || employee.name === eq.assignedTo);
              const isOwedByOffboardingEmployee = eq.status === "Assigned" && assignedEmployee?.type === "offboarding";
              const canMarkReturned = eq.status === "To Be Collected" || isOwedByOffboardingEmployee;
              return (
                <tr key={eq.id} ref={(node) => (rowRefs.current[eq.id] = node)} className={focusName === eq.assignedTo ? "row-highlight" : ""}>
                  <td><strong>{eq.item}</strong></td>
                  <td>{eq.assetTag}</td>
                  <td>{eq.assignedTo}</td>
                  <td><span className={`status-chip ${eq.status.replace(/\s+/g, "")}`}>{eq.status}</span></td>
                  <td className="equipment-action-cell">
                    {canAssign && <button className="btn-secondary assign-equipment-btn" onClick={() => setAssigningEquipment(eq)}><UserRound />Assign to person</button>}
                    {canMarkReturned && <button className="btn-secondary" onClick={() => c.markEquipment(eq.id, "Available")}>Mark returned</button>}
                  </td>
                </tr>
              );
            })}
            {!filteredEquipment.length && (
              <tr><td colSpan="5"><div className="empty-state">No equipment matches your search.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {assigningEquipment && (
        <AssignEquipmentModal
          equipment={assigningEquipment}
          employees={c.employees}
          onClose={() => setAssigningEquipment(null)}
          onAssign={(equipmentId, employeeId) => {
            c.assignEquipment(equipmentId, employeeId);
            setAssigningEquipment(null);
          }}
        />
      )}
    </div>
  );
}