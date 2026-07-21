import { useState, useMemo } from 'react';
import PageShell from '../components/PageShell.jsx';
import { useAccessRequests } from '../context/AccessRequestsContext.jsx';

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
}

// Small inline icons — no external icon package required.
function IconEye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function AccessRequests() {
  const { requests, updateStatus, addRequest, deleteRequest } = useAccessRequests();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selectedId, setSelectedId] = useState(null); // drives the drawer
  const [confirmingId, setConfirmingId] = useState(null); // drives the single approval modal
  const [denyingId, setDenyingId] = useState(null); // drives the single deny modal
  const [deletingId, setDeletingId] = useState(null); // drives the delete confirmation modal
  const [newRequestOpen, setNewRequestOpen] = useState(false); // drives the new request form
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    department: '',
    resource: '',
    reason: '',
    type: 'Temporary',
    expires: '',
  });

  // --- Bulk review state ---
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelectedIds, setBulkSelectedIds] = useState([]); // array of request ids
  const [bulkAction, setBulkAction] = useState(null); // 'Approved' | 'Denied' | null — drives bulk confirm modal

  // Departments are derived from actual data so the filter stays accurate
  // as new requests come in with new departments.
  const departmentOptions = useMemo(() => {
    const unique = new Set(requests.map(r => r.department));
    return Array.from(unique).sort();
  }, [requests]);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch =
      r.id.toLowerCase().includes(q) ||
      r.employee.toLowerCase().includes(q) ||
      r.resource.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All Statuses' || r.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All Departments' || r.department === departmentFilter;
    const matchesType = typeFilter === 'All Types' || r.type === typeFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesType;
  });

  const pendingVisible = filtered.filter(r => r.status === 'Pending');
  const allPendingVisibleSelected =
    pendingVisible.length > 0 && pendingVisible.every(r => bulkSelectedIds.includes(r.id));

  const selectedRequest = requests.find(r => r.id === selectedId) || null;
  const confirmingRequest = requests.find(r => r.id === confirmingId) || null;
  const denyingRequest = requests.find(r => r.id === denyingId) || null;
  const deletingRequest = requests.find(r => r.id === deletingId) || null;
  const bulkSelectedRequests = requests.filter(r => bulkSelectedIds.includes(r.id));

  function handleDenyClick(id) {
    setDenyingId(id);
  }

  function handleConfirmDeny() {
    if (denyingId) {
      updateStatus(denyingId, 'Denied');
      if (selectedId === denyingId) setSelectedId(null);
    }
    setDenyingId(null);
  }

  function handleApproveClick(id) {
    setConfirmingId(id);
  }

  function handleConfirmApprove() {
    if (confirmingId) {
      updateStatus(confirmingId, 'Approved');
      if (selectedId === confirmingId) setSelectedId(null);
    }
    setConfirmingId(null);
  }

  function handleDeleteClick(id) {
    setDeletingId(id);
  }

  function handleConfirmDelete() {
    if (deletingId) {
      deleteRequest(deletingId);
      if (selectedId === deletingId) setSelectedId(null);
    }
    setDeletingId(null);
  }

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    addRequest({
      employee: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      department: form.department,
      resource: form.resource,
      reason: form.reason,
      type: form.type,
      expires: form.type === 'Temporary' ? form.expires : '-',
    });
    setForm({ firstName: '', lastName: '', department: '', resource: '', reason: '', type: 'Temporary', expires: '' });
    setNewRequestOpen(false);
  }

  // --- Bulk review handlers ---
  function toggleBulkMode() {
    setBulkMode(prev => !prev);
    setBulkSelectedIds([]); // always start fresh when toggling
  }

  function toggleBulkSelect(id) {
    setBulkSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function toggleSelectAllPending() {
    if (allPendingVisibleSelected) {
      // deselect only the currently visible pending ones
      setBulkSelectedIds(prev => prev.filter(id => !pendingVisible.some(r => r.id === id)));
    } else {
      const idsToAdd = pendingVisible.map(r => r.id);
      setBulkSelectedIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
    }
  }

  function handleBulkActionClick(action) {
    setBulkAction(action); // 'Approved' or 'Denied'
  }

  function handleConfirmBulkAction() {
    if (bulkAction) {
      bulkSelectedIds.forEach(id => updateStatus(id, bulkAction));
    }
    setBulkAction(null);
    setBulkSelectedIds([]);
    setBulkMode(false);
  }

  return (
    <PageShell pageName="Access Requests" owner="Anthony">

      {/* Filter Bar */}
      <div className="access-toolbar">
        <input
          type="text"
          placeholder="Search request ID, employee, resource..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="access-search"
        />
        <select
          className="access-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Denied</option>
        </select>
        <select
          className="access-filter"
          value={departmentFilter}
          onChange={e => setDepartmentFilter(e.target.value)}
        >
          <option>All Departments</option>
          {departmentOptions.map(dept => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
        <select
          className="access-filter"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>Temporary</option>
          <option>Permanent</option>
        </select>
        <button className="btn-primary" onClick={() => setNewRequestOpen(true)}>+ New Request</button>
      </div>

      {/* Access Requests Queue box */}
      <div className="access-box">
        <div className="access-box-header">
          <div>
            <h3>Access Requests Queue</h3>
            <p>Manager or IT approval queue for access outside department defaults.</p>
          </div>
          <button className="access-actions-btn" onClick={toggleBulkMode}>
            {bulkMode ? 'Cancel Bulk Review' : 'Bulk Review'}
          </button>
        </div>

        {/* Bulk action bar — appears once at least one row is selected */}
        {bulkMode && bulkSelectedIds.length > 0 && (
          <div className="access-bulk-bar">
            <span>{bulkSelectedIds.length} selected</span>
            <div className="access-bulk-bar-actions">
              <button className="link-action link-action-deny" onClick={() => handleBulkActionClick('Denied')}>
                Deny All
              </button>
              <button className="btn-primary" onClick={() => handleBulkActionClick('Approved')}>
                Approve All
              </button>
            </div>
          </div>
        )}

        <table className="access-table">
          <thead>
            <tr>
              {bulkMode && (
                <th>
                  <input
                    type="checkbox"
                    checked={allPendingVisibleSelected}
                    onChange={toggleSelectAllPending}
                    disabled={pendingVisible.length === 0}
                    aria-label="Select all pending requests"
                  />
                </th>
              )}
              <th>Request ID</th>
              <th>Employee</th>
              <th>Resource</th>
              <th>Reason</th>
              <th>Type</th>
              <th>Expires On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                {bulkMode && (
                  <td>
                    {r.status === 'Pending' && (
                      <input
                        type="checkbox"
                        checked={bulkSelectedIds.includes(r.id)}
                        onChange={() => toggleBulkSelect(r.id)}
                        aria-label={`Select ${r.id}`}
                      />
                    )}
                  </td>
                )}
                <td>{r.id}</td>
                <td>{r.employee}</td>
                <td>{r.resource}</td>
                <td>{r.reason}</td>
                <td>{r.type}</td>
                <td>{r.expires}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="access-actions">
                  <div className="access-row-actions">
                    <button className="action-pill action-pill-view" onClick={() => setSelectedId(r.id)}>
                      <IconEye /> View
                    </button>
                    {r.status === 'Pending' && (
                      <>
                        <button className="action-pill action-pill-approve" onClick={() => handleApproveClick(r.id)}>
                          <IconCheck /> Approve
                        </button>
                        <button className="action-pill action-pill-deny" onClick={() => handleDenyClick(r.id)}>
                          <IconX /> Deny
                        </button>
                      </>
                    )}
                    <button className="action-pill action-pill-delete" onClick={() => handleDeleteClick(r.id)}>
                      <IconTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={bulkMode ? 9 : 8} className="access-empty-row">No requests match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Request Detail Drawer — slides in when a request is opened */}
      {selectedRequest && (
        <div className="access-overlay" onClick={() => setSelectedId(null)}>
          <div className="access-drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="access-box-header">
              <div>
                <h3>Request Detail</h3>
                <p>{selectedRequest.id}</p>
              </div>
              <button className="access-close-btn" onClick={() => setSelectedId(null)} aria-label="Close">×</button>
            </div>

            <div className="access-drawer-grid">
              <div>
                <label>Employee</label>
                <div className="access-drawer-field">{selectedRequest.employee} — {selectedRequest.department}</div>
              </div>
              <div>
                <label>Requested Resource</label>
                <div className="access-drawer-field">{selectedRequest.resource}</div>
              </div>
              <div>
                <label>Access Type</label>
                <div className="access-drawer-field">{selectedRequest.type}</div>
              </div>
              <div>
                <label>Expiration Date</label>
                <div className="access-drawer-field">{selectedRequest.expires}</div>
              </div>
            </div>
            <label>Business Reason</label>
            <div className="access-drawer-field access-drawer-reason">{selectedRequest.reason}</div>

            <div className="access-drawer-actions">
              {selectedRequest.status === 'Pending' ? (
                <>
                  <button className="btn-view" onClick={() => handleDenyClick(selectedRequest.id)}>Deny</button>
                  <button className="btn-primary" onClick={() => handleApproveClick(selectedRequest.id)}>Approve</button>
                </>
              ) : (
                <StatusBadge status={selectedRequest.status} />
              )}
              <button className="action-pill action-pill-delete" onClick={() => handleDeleteClick(selectedRequest.id)}>
                <IconTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Confirmation Modal — appears before granting access (single request) */}
      {confirmingRequest && (
        <div className="access-overlay" onClick={() => setConfirmingId(null)}>
          <div className="access-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="access-modal-inner">
              <h4>Approve {confirmingRequest.type} Access?</h4>
              <p>
                This will grant {confirmingRequest.resource} access to {confirmingRequest.employee}
                {confirmingRequest.type === 'Temporary' ? ` until ${confirmingRequest.expires}.` : '.'}
                {' '}The system will automatically revoke access after expiration.
              </p>
              <p className="access-modal-warning">
                Once approved, this request's status cannot be changed.
              </p>
              <div className="access-modal-actions">
                <button className="btn-view" onClick={() => setConfirmingId(null)}>Cancel</button>
                <button className="btn-primary" onClick={handleConfirmApprove}>Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deny Confirmation Modal — appears before denying access (single request) */}
      {denyingRequest && (
        <div className="access-overlay" onClick={() => setDenyingId(null)}>
          <div className="access-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="access-modal-inner">
              <h4>Deny Access Request?</h4>
              <p>
                This will deny {denyingRequest.resource} access for {denyingRequest.employee}.
              </p>
              <p className="access-modal-warning">
                Once denied, this request's status cannot be changed.
              </p>
              <div className="access-modal-actions">
                <button className="btn-view" onClick={() => setDenyingId(null)}>Cancel</button>
                <button className="btn-primary" onClick={handleConfirmDeny}>Deny</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal — appears before permanently removing a request */}
      {deletingRequest && (
        <div className="access-overlay" onClick={() => setDeletingId(null)}>
          <div className="access-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="access-modal-inner">
              <h4>Delete {deletingRequest.id}?</h4>
              <p>
                This will permanently remove the request for {deletingRequest.resource} from {deletingRequest.employee}.
                This action cannot be undone.
              </p>
              <div className="access-modal-actions">
                <button className="btn-view" onClick={() => setDeletingId(null)}>Cancel</button>
                <button className="btn-primary" onClick={handleConfirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Confirmation Modal — appears before approving/denying multiple requests at once */}
      {bulkAction && (
        <div className="access-overlay" onClick={() => setBulkAction(null)}>
          <div className="access-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="access-modal-inner">
              <h4>{bulkAction === 'Approved' ? 'Approve' : 'Deny'} {bulkSelectedRequests.length} Request{bulkSelectedRequests.length === 1 ? '' : 's'}?</h4>
              <p>
                This will mark the following as {bulkAction.toLowerCase()}:
              </p>
              <ul className="access-bulk-list">
                {bulkSelectedRequests.map(r => (
                  <li key={r.id}>{r.id} — {r.employee} ({r.resource})</li>
                ))}
              </ul>
              <p className="access-modal-warning">
                Once {bulkAction === 'Approved' ? 'approved' : 'denied'}, these requests' statuses cannot be changed.
              </p>
              <div className="access-modal-actions">
                <button className="btn-view" onClick={() => setBulkAction(null)}>Cancel</button>
                <button className="btn-primary" onClick={handleConfirmBulkAction}>
                  Confirm {bulkAction === 'Approved' ? 'Approve' : 'Deny'} All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Request Form — appears when "+ New Request" is clicked */}
      {newRequestOpen && (
        <div className="access-overlay" onClick={() => setNewRequestOpen(false)}>
          <div className="access-drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="access-box-header">
              <div>
                <h3>New Access Request</h3>
                <p>Submit a request for manager or IT approval.</p>
              </div>
              <button className="access-close-btn" onClick={() => setNewRequestOpen(false)} aria-label="Close">×</button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="access-drawer-grid">
                <div>
                  <label>First Name</label>
                  <input
                    className="access-drawer-field"
                    value={form.firstName}
                    onChange={e => handleFormChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    className="access-drawer-field"
                    value={form.lastName}
                    onChange={e => handleFormChange('lastName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Department</label>
                  <input
                    className="access-drawer-field"
                    value={form.department}
                    onChange={e => handleFormChange('department', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Requested Resource</label>
                  <input
                    className="access-drawer-field"
                    value={form.resource}
                    onChange={e => handleFormChange('resource', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Access Type</label>
                  <select
                    className="access-drawer-field"
                    value={form.type}
                    onChange={e => handleFormChange('type', e.target.value)}
                  >
                    <option>Temporary</option>
                    <option>Permanent</option>
                  </select>
                </div>
                {form.type === 'Temporary' && (
                  <div>
                    <label>Expiration Date</label>
                    <input
                      type="date"
                      className="access-drawer-field"
                      value={form.expires}
                      onChange={e => handleFormChange('expires', e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              <label>Business Reason</label>
              <textarea
                className="access-drawer-field access-drawer-reason"
                value={form.reason}
                onChange={e => handleFormChange('reason', e.target.value)}
                required
              />

              <div className="access-drawer-actions">
                <button type="button" className="btn-view" onClick={() => setNewRequestOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageShell>
  );
}

export default AccessRequests;