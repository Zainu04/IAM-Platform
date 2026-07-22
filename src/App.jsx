import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import AccessRequests from "./pages/AccessRequests.jsx";
import Compliance from "./pages/Compliance.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import EquipmentInventory from "./pages/EquipmentInventory.jsx";
import Login from "./pages/Login.jsx";
import Notifications from "./pages/Notifications.jsx";
import Offboarding from "./pages/Offboarding.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Documents from "./pages/Documents.jsx";
import Orientation from "./pages/Orientation.jsx";
import Accounts from "./pages/Accounts.jsx";
import Tasks from "./pages/Tasks.jsx";
import AuditHistory from "./pages/AuditHistory.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<ProtectedRoute roles={["HR_MANAGER"]}><Employees /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute roles={["HR_MANAGER"]}><Onboarding /></ProtectedRoute>} />
        <Route path="/onboarding/:employeeId" element={<ProtectedRoute roles={["HR_MANAGER"]}><Onboarding /></ProtectedRoute>} />
        <Route path="/offboarding" element={<ProtectedRoute roles={["HR_MANAGER"]}><Offboarding /></ProtectedRoute>} />
        <Route path="/offboarding/:employeeId" element={<ProtectedRoute roles={["HR_MANAGER"]}><Offboarding /></ProtectedRoute>} />
        <Route path="/equipment" element={<ProtectedRoute roles={["IT_MANAGER"]}><EquipmentInventory /></ProtectedRoute>} />
        <Route path="/access-requests" element={<ProtectedRoute roles={["IT_MANAGER"]}><AccessRequests /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute roles={["IT_MANAGER", "HR_MANAGER"]}><Notifications /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={["HR_MANAGER", "AUDITOR"]}><Reports /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute roles={["HR_MANAGER"]}><Documents /></ProtectedRoute>} />
        <Route path="/orientation" element={<ProtectedRoute roles={["HR_MANAGER"]}><Orientation /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute roles={["IT_MANAGER"]}><Accounts /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute roles={["IT_MANAGER", "HR_MANAGER"]}><Tasks /></ProtectedRoute>} />
        <Route path="/audit-history" element={<ProtectedRoute roles={["AUDITOR"]}><AuditHistory /></ProtectedRoute>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/compliance" element={<ProtectedRoute roles={["AUDITOR"]}><Compliance /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
