import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Offboarding from './pages/Offboarding.jsx';
import EquipmentInventory from './pages/EquipmentInventory.jsx';
import DepartmentAccess from './pages/DepartmentAccess.jsx';
import AccessRequests from './pages/AccessRequests.jsx';
import Notifications from './pages/Notifications.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/offboarding" element={<Offboarding />} />
        <Route path="/equipment" element={<EquipmentInventory />} />
        <Route path="/department-access" element={<DepartmentAccess />} />
        <Route path="/access-requests" element={<AccessRequests />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
