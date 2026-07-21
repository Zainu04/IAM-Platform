import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'iam-platform:access-requests';

const defaultRequests = [
  { id: 'REQ-1001', employee: 'John Smith', department: 'IT', resource: 'Adobe Creative Cloud', reason: 'Needs access for short-term design project support.', type: 'Temporary', expires: '05/30/2025', status: 'Pending' },
  { id: 'REQ-1002', employee: 'Sarah Johnson', department: 'Sales', resource: 'Salesforce', reason: 'CRM access', type: 'Permanent', expires: '-', status: 'Approved' },
  { id: 'REQ-1003', employee: 'Michael Brown', department: 'IT', resource: 'Admin Console', reason: 'Development support', type: 'Temporary', expires: '06/15/2025', status: 'Pending' },
  { id: 'REQ-1004', employee: 'David Lee', department: 'Finance', resource: 'Power BI', reason: 'Reporting', type: 'Permanent', expires: '-', status: 'Approved' },
  { id: 'REQ-1005', employee: 'Jessica Wilson', department: 'Marketing', resource: 'VPN Access', reason: 'Remote work', type: 'Temporary', expires: '05/25/2025', status: 'Denied' },
];

function loadInitialRequests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultRequests;
  } catch {
    return defaultRequests;
  }
}

const AccessRequestsContext = createContext(null);

export function AccessRequestsProvider({ children }) {
  const [requests, setRequests] = useState(loadInitialRequests);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      // localStorage unavailable — fail silently
    }
  }, [requests]);

  function updateStatus(id, status) {
    setRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
  }

  function resetRequests() {
    setRequests(defaultRequests);
  }

  function addRequest(newRequest) {
    setRequests(prev => [
      {
        id: `REQ-${1000 + prev.length + 1}`,
        status: 'Pending',
        ...newRequest,
      },
      ...prev,
    ]);
  }

  function deleteRequest(id) {
    setRequests(prev => prev.filter(r => r.id !== id));
  }

  const value = { requests, updateStatus, resetRequests, addRequest, deleteRequest };

  return (
    <AccessRequestsContext.Provider value={value}>
      {children}
    </AccessRequestsContext.Provider>
  );
}

export function useAccessRequests() {
  const ctx = useContext(AccessRequestsContext);
  if (!ctx) {
    throw new Error('useAccessRequests must be used inside an AccessRequestsProvider');
  }
  return ctx;
}