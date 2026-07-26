# JourneyOne Verification Plan

## Acceptance metrics
- 100% of critical onboarding/offboarding actions create an audit event.
- Related tasks update within the same successful API transaction.
- Unauthorized requests return HTTP 401; forbidden role actions return HTTP 403.
- A device cannot be assigned to two active employees.
- Workflow progress reaches 100% only when every required step is complete.
- Target API response time: under 500 ms for standard CRUD operations in the class demonstration environment.
- Target accessibility score: 90+ in Lighthouse.

## Test categories
1. Authentication and authorization.
2. Employee and workflow validation.
3. Automatic task completion.
4. Equipment assignment conflict prevention.
5. Access approval/denial and reason capture.
6. Audit-log creation.
7. Reports and metrics accuracy.
8. Keyboard navigation, labels, focus states, and color contrast.
9. User acceptance tests with HR, IT, and manager personas.
