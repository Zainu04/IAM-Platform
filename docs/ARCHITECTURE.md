# JourneyOne Architecture

JourneyOne uses a React/Vite client and an Express REST API. The API owns validation, authentication, role permissions, workflow automation, notifications, audit logs, metrics, and durable JSON-file persistence for local demonstrations. The repository also includes a PostgreSQL schema so the persistence layer can be replaced before production without redesigning the client-facing routes.

## Roles
- `IT_MANAGER`: equipment, account access, technical offboarding, reports.
- `HR_MANAGER`: employee journeys, documents, welcome communications, interviews.
- - `AUDITOR`: read-only audit and compliance access.

## Automatic task lifecycle
Tasks are generated when an employee journey is created. Each task has an `employeeId` and `actionType`. Completing the corresponding workflow action automatically closes the task and records who completed it and when.

## Security controls
JWT authentication, password hashing, role-based authorization, Helmet security headers, input validation with Zod, duplicate-journey checks, conflict responses for duplicate equipment assignments, environment-based secrets, and immutable audit events.
