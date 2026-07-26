# JourneyOne

JourneyOne is an employee onboarding and offboarding management system for HR and IT teams. It coordinates employee journeys, equipment, system access, automatic tasks, notifications, reports, role permissions, audit logs, and quality metrics.

## What was added

- Express REST API with durable local data storage
- JWT authentication and role-based authorization
- Password hashing and protected endpoints
- Automatic task creation and completion linked to real workflow actions
- Equipment conflict validation and access-request decision tracking
- Audit logs for security and accountability
- In-app notifications, reporting metrics, and a Compliance page
- Safe email-preview and orientation-calendar integration endpoints
- Automated API tests with Vitest and Supertest
- PostgreSQL schema for the production database migration
- Architecture, test, security, and administration documentation

## Run the complete system

```bash
npm install
cp .env.example .env
npm run dev:full
```

Client: `http://localhost:5173`  
API: `http://localhost:3001/api`

The frontend continues in local demo mode when the API is not running, so the UI remains usable during development.

## Demo accounts

All demo accounts use the password `secret`.

- `zainab@journeyone.local` — IT Manager
- `hr@journeyone.local` — HR Manager
- `auditor@journeyone.local` — Auditor

## Testing

```bash
npm test
```

See `docs/TEST_PLAN.md` for acceptance criteria and quality targets.

## Important production note

The included JSON repository makes the project easy to demonstrate without installing a database. Before production deployment, replace it with PostgreSQL using `server/data/postgresql-schema.sql`, change the JWT secret, configure HTTPS, and connect a production email/calendar provider.

## Role-specific workspaces
JourneyOne now provides a distinct dashboard and navigation menu for each account while preserving the maroon and gold brand:

- IT Manager: equipment, access, technical tasks, and security operations
- HR Manager: onboarding, offboarding, employee records, documents, and orientation
- Auditor: read-only compliance, reports, metrics, and audit history

All demo passwords are `secret`:

- `zainab@journeyone.local`
- `hr@journeyone.local`
- `auditor@journeyone.local`

## Role-separated workspaces

JourneyOne presents three purpose-built workspaces that share the same authenticated backend and JourneyOne visual system:

- **HR Manager:** employee records, onboarding, offboarding, documents, orientation, HR tasks, and HR reports.
- **IT Manager:** equipment, system access, account administration, access requests, and IT tasks. IT cannot open HR onboarding, offboarding, or document pages.
- **Auditor:** read-only audit history, compliance controls, and reports. Auditor accounts receive no operational create/edit actions.

All roles keep the existing JourneyOne maroon-and-gold design.
