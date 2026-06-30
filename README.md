# IT Onboarding & Offboarding Management System — Team Starter

This is the lightweight React starter project for the Capstone II frontend phase.

## Purpose

This starter includes the shared project foundation only:

- React + Vite setup
- React Router routes
- Shared sidebar
- Shared top navigation
- Empty page shells for each assigned page
- Global CSS foundation
- Comments/notes showing each developer where to build

The actual page content is intentionally left for each assigned developer to build from the wireframes.

## Team Assignments

| Team Member | Page(s) |
|---|---|
| Zainab | Dashboard, Onboarding, Offboarding, Notifications, Reports, Settings, backend integration, final testing |
| Hugo | Employees |
| Maliha | Equipment Inventory |
| Javier | Department Access |
| Anthony | Access Requests |

## Setup Instructions

```bash
npm install
npm run dev
```

Open the local URL that Vite provides.

## Important Development Notes

- Use the provided wireframes as your guide.
- Each developer should work inside their assigned page file in `src/pages/`.
- Reuse the shared sidebar and topbar already included in the layout.
- Keep the styling consistent with `src/styles/global.css`.
- Use placeholder data while building the UI.
- Do not push directly to `main`. Create a branch for your page.

## Suggested Branch Names

```bash
git checkout -b hugo-employees

git checkout -b maliha-equipment-inventory

git checkout -b javier-department-access

git checkout -b anthony-access-requests
```

## File Map

```text
src/
├── components/
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── TopNavbar.jsx
│   └── PageShell.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Employees.jsx
│   ├── Onboarding.jsx
│   ├── Offboarding.jsx
│   ├── EquipmentInventory.jsx
│   ├── DepartmentAccess.jsx
│   ├── AccessRequests.jsx
│   ├── Notifications.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```
