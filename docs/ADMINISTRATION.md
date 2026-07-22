# Operating and Administration Guide

1. Copy `.env.example` to `.env` and change the JWT secret.
2. Run `npm install`.
3. Run the full system with `npm run dev:full`.
4. The client runs on port 5173 and API on port 3001 by default.
5. Demo accounts use password `secret`: `zainab@journeyone.local`, `hr@journeyone.local`, and `auditor@journeyone.local`.
6. Local API records are stored in `server/data/database.json`. Back up that file before demonstrations.
7. Never commit `.env`, production passwords, employee documents, or production data.
8. Run `npm test` before merging a feature branch.
9. Review `/api/audit-logs` for administrative and compliance investigations.
