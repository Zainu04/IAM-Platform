import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PageShell from '../components/PageShell.jsx';


const INVENTORY = [
  { id: 'LT-1001', type: 'Laptop', model: 'Dell Latitude 5430', serial: 'SN-83920', assignedTo: 'John Smith', department: 'IT', status: 'Assigned' },
  { id: 'LT-1002', type: 'Laptop', model: 'HP EliteBook 840', serial: 'SN-44920', assignedTo: 'David Lee', department: 'IT', status: 'Assigned' },
  { id: 'MN-2001', type: 'Monitor', model: 'Dell 24 inch', serial: 'SN-98220', assignedTo: 'Sarah Johnson', department: 'HR', status: 'Assigned' },
  { id: 'PH-1001', type: 'Phone', model: 'iPhone 14', serial: 'SN-20113', assignedTo: 'Michael Brown', department: 'Finance', status: 'Assigned' },
  { id: 'BD-1001', type: 'Badge', model: 'Access Card', serial: 'BD-99872', assignedTo: 'Jessica Wilson', department: 'HR', status: 'Reserved' },
  { id: 'LT-1003', type: 'Laptop', model: 'Lenovo ThinkPad X1', serial: 'SN-78422', assignedTo: '-', department: '-', status: 'Available' },
  { id: 'MN-2002', type: 'Monitor', model: 'Dell 27 inch', serial: 'SN-77912', assignedTo: '-', department: '-', status: 'Available' },
  { id: 'LT-1004', type: 'Laptop', model: 'MacBook Pro 14', serial: 'SN-99821', assignedTo: 'Emily Davis', department: 'Marketing', status: 'Return due' }
];

const STATS = [
  { label: 'Total assets', value: 132, sub: 'Tracked inventory' },
  { label: 'Available', value: 87, sub: 'Ready to assign' },
  { label: 'Assigned', value: 45, sub: 'Currently in use' },
  { label: 'Missing / damaged', value: 3, sub: 'Need review' }
];

const TYPES = ['All Types', 'Laptop', 'Monitor', 'Phone', 'Badge'];
const STATUSES = ['All Statuses', 'Assigned', 'Available', 'Reserved', 'Return due'];
const DEPARTMENTS = ['All Departments', 'IT', 'HR', 'Finance', 'Marketing'];

function statusBadgeClass(status) {
  if (status === 'Assigned' || status === 'Reserved') return 'eq-badge';
  return 'eq-badge eq-badge-outline';
}

function EquipmentInventory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [assigningAsset, setAssigningAsset] = useState(null);

  const filteredInventory = useMemo(() => {
    const term = search.trim().toLowerCase();
    return INVENTORY.filter((item) => {
      const matchesSearch =
        !term ||
        item.id.toLowerCase().includes(term) ||
        item.serial.toLowerCase().includes(term) ||
        item.assignedTo.toLowerCase().includes(term);
      const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
      const matchesDept = deptFilter === 'All Departments' || item.department === deptFilter;
      return matchesSearch && matchesType && matchesStatus && matchesDept;
    });
  }, [search, typeFilter, statusFilter, deptFilter]);

  function handleAssignClick(item) {
    setAssigningAsset(item);
  }

  function handleCancelAssign() {
    setAssigningAsset(null);
  }

  return (
    <PageShell pageName="Equipment Inventory" owner="Maliha">
      {/* Toolbar: search + filters + add equipment */}
      <div className="eq-toolbar">
        <div className="eq-input eq-input-wide">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search asset ID, serial number, employee…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="eq-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select className="eq-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select className="eq-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <button type="button" className="eq-btn eq-btn-primary eq-toolbar-add">
          + Add Equipment
        </button>
      </div>

      {/* Summary stat cards */}
      <div className="eq-grid4">
        {STATS.map((stat) => (
          <div className="eq-card" key={stat.label}>
            <div className="eq-card-lbl">{stat.label}</div>
            <div className="eq-card-val">{stat.value}</div>
            <div className="eq-card-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Inventory table panel */}
      <div className="eq-panel">
        <div className="eq-panel-head">
          <div>
            <div className="eq-panel-title">Equipment Inventory</div>
            <div className="eq-panel-sub">
              Tracks laptops, monitors, phones, badges, and accessories used in onboarding/offboarding.
            </div>
          </div>
          <button type="button" className="eq-btn">Export inventory</button>
        </div>

        <table className="eq-table">
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Type</th>
              <th>Model</th>
              <th>Serial #</th>
              <th>Assigned To</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.id}</strong></td>
                <td>{item.type}</td>
                <td>{item.model}</td>
                <td>{item.serial}</td>
                <td>{item.assignedTo}</td>
                <td>{item.department}</td>
                <td>
                  <span className={statusBadgeClass(item.status)}>{item.status}</span>
                </td>
                <td>
                  {item.status === 'Assigned' && (
                    <span className="eq-actions">[ View ] [ Return ]</span>
                  )}
                  {item.status === 'Reserved' && (
                    <button type="button" className="eq-link-btn" onClick={() => handleAssignClick(item)}>
                      [ Assign ]
                    </button>
                  )}
                  {item.status === 'Available' && (
                    <button type="button" className="eq-link-btn" onClick={() => handleAssignClick(item)}>
                      [ Assign ]
                    </button>
                  )}
                  {item.status === 'Return due' && (
                    <span className="eq-actions">[ Mark Returned ]</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={8} className="eq-empty-row">No equipment matches your search or filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Equipment form — shown when the user clicks Assign */}
      {assigningAsset && (
        <div className="eq-panel">
          <div className="eq-panel-head">
            <div>
              <div className="eq-panel-title">Assign Equipment</div>
              <div className="eq-panel-sub">Shown when a user clicks Assign.</div>
            </div>
            <button type="button" className="eq-btn" onClick={handleCancelAssign}>Cancel</button>
          </div>

          <div className="eq-form-grid">
            <div className="eq-field">
              <label>Asset</label>
              <div className="eq-field-box">{assigningAsset.id} — {assigningAsset.model}</div>
            </div>
            <div className="eq-field">
              <label>Assign To</label>
              <input type="text" placeholder="Search employee" />
            </div>
            <div className="eq-field">
              <label>Assignment Date</label>
              <input type="text" placeholder="MM/DD/YYYY" />
            </div>
            <div className="eq-field">
              <label>Condition</label>
              <select>
                <option value="">New / Good / Used</option>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="eq-field eq-field-full">
              <label>Notes</label>
              <input type="text" placeholder="Optional assignment notes" />
            </div>
          </div>

          <div className="eq-form-actions">
            <button type="button" className="eq-btn" onClick={handleCancelAssign}>Cancel</button>
            <button type="button" className="eq-btn eq-btn-primary" onClick={handleCancelAssign}>
              Confirm Assignment
            </button>
          </div>
        </div>
      )}

      <div className="eq-note">
        <strong>Developer handoff:</strong> Inventory status values should drive onboarding equipment
        selection and offboarding return checklist.
      </div>
    </PageShell>
  );
}

export default EquipmentInventory;
