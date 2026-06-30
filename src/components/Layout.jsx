import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/onboarding': 'Onboarding',
  '/offboarding': 'Offboarding',
  '/equipment': 'Equipment Inventory',
  '/department-access': 'Department Access',
  '/access-requests': 'Access Requests',
  '/notifications': 'Notifications',
  '/reports': 'Reports',
  '/settings': 'Settings'
};

function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <TopNavbar title={title} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
