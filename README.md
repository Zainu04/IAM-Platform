# JourneyOne

🔗 **Live Site:** https://journey-one.onrender.com

JourneyOne is an employee onboarding and offboarding management system for HR and IT teams. It coordinates employee journeys, equipment, system access, automatic tasks, notifications, reports, role permissions, audit logs, and quality metrics.

## What was added

- Express REST API with durable data storage
- JWT authentication and role-based authorization
- Password hashing and protected endpoints
- Automatic task creation and completion linked to real workflow actions
- Equipment conflict validation and access-request decision tracking
- Audit logs for security and accountability
- In-app notifications, reporting metrics, and Compliance page
- Safe email-preview and orientation-calendar integration endpoints
- Automated API tests with Vitest and Supertest
- PostgreSQL database integration for production deployment
- Architecture, testing, security, and administration documentation

## Run the complete system

```bash
npm install
cp .env.example .env
npm run dev:full
```

Client:
```
http://localhost:5173
```

API:
```
http://localhost:3001/api
```

The frontend continues in local demo mode when the API is not running, so the UI remains usable during development.

## Demo accounts

All demo accounts use the password:

```
secret
```

| Role | Email |
|---|---|
| IT Manager | zainab@journeyone.local |
| HR Manager | hr@journeyone.local |
| Auditor | auditor@journeyone.local |

## Testing

Run automated tests:

```bash
npm test
```

See `docs/TEST_PLAN.md` for acceptance criteria and quality targets.

## Production Deployment

JourneyOne is deployed using Render with:

- React frontend
- Express backend
- PostgreSQL database
- JWT authentication
- Production environment variables

Required environment variables:

```
CLIENT_URL
DATABASE_URL
JWT_SECRET
NODE_ENV
VITE_API_URL
```

## Role-Specific Workspaces

JourneyOne provides separate dashboards and permissions for each account while maintaining the same maroon-and-gold design system.

### HR Manager

- Employee records
- Onboarding and offboarding workflows
- Documents
- Orientation scheduling
- HR tasks and reports

### IT Manager

- Equipment management
- System access requests
- Account administration
- Technical onboarding and offboarding tasks

### Auditor

- Read-only compliance dashboard
- Audit history
- Reports and metrics
- No operational create or edit permissions

All roles use the JourneyOne maroon-and-gold design system.
