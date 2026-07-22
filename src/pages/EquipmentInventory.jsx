import { useEffect, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";

export default function EquipmentInventory() {
  const c = useOutletContext();
  const [searchParams] = useSearchParams();
  const focusName = searchParams.get("focus");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState("");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Equipment</h2>
          <p>Track hardware assigned to onboarding and offboarding employees.</p>
        </div>
        <button className="btn-primary" onClick={() => setShow(!show)}><Plus />Add equipment</button>
      </div>
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
            {filteredEquipment.map((eq) => (
              <tr key={eq.id} ref={(node) => (rowRefs.current[eq.id] = node)} className={focusName === eq.assignedTo ? "row-highlight" : ""}>
                <td><strong>{eq.item}</strong></td>
                <td>{eq.assetTag}</td>
                <td>{eq.assignedTo}</td>
                <td><span className={`status-chip ${eq.status.replace(/\s+/g, "")}`}>{eq.status}</span></td>
                <td>{eq.status !== "Assigned" && <button className="btn-secondary" onClick={() => c.markEquipment(eq.id)}>Mark handled</button>}</td>
              </tr>
            ))}
            {!filteredEquipment.length && (
              <tr><td colSpan="5"><div className="empty-state">No equipment matches your search.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
