# Use Case Analysis — Crown Jewel Hotel Management System

## Verified user actors

The application defines seven distinct roles in `frontend/lib/auth-routing.ts`. The database schema seeds six roles in migration 001, adds `admin` in migration 003, and the development seed includes an administrator profile. The role names below are normalized to their user-facing labels.

| Actor | Verified responsibilities and sidebar tasks | Implemented subfunctions represented |
|---|---|---|
| Administrator | Administrator dashboard; Tasks; Employees; Ratings; Feedback; Reports; Settings | Review and update the operations alert inbox; broadcast staff announcements; manage room rates and payments; task and staff management; view ratings/reports/feedback; account preferences. |
| Hotel Manager | Manager dashboard; Tasks; Employees; Ratings; Feedback; Reports; Settings | Operations overview and room rates; task CRUD/status actions; staff roster management; view ratings and record performance evaluations; review feedback; generate and download reports; account preferences. |
| Front Desk Staff | Front Desk Command; Front Desk Tasks; Staff Service Ratings; Guest Feedback; Settings | View room/booking status; check guests in/out; process payments; manage rates; run night audit; record late-arrival evidence; issue keycards; update task status; access ratings/feedback. |
| Housekeeping Staff | Housekeeping Board; Cleaning Tasks; Settings | View cleaning queue; start cleaning; mark a room clean/ready; view and update assigned task status. |
| Maintenance Staff | Maintenance Desk; Work Orders & Tasks; Settings | View work orders/equipment; create or update work tickets; update equipment status; request spare parts; view and update assigned task status. |
| Hotel Owner | Executive Desk; Financial & Revenue Reports; Guest Ratings & Scores; Guest Feedback; Settings | View executive metrics; set fiscal targets; manage room rates; view ratings and feedback; generate/download reports; account preferences. |
| Guest | My Stay Folio; Service Feedback; Settings | View folio/receipt/keycard; request room cleaning; rate hotel employees; request hotel services; access the feedback page. |

## Sidebar-to-use-case organization

Sidebar labels are read from `frontend/components/layout/DashboardLayout.tsx`; authorization is read from `frontend/lib/auth-routing.ts`.

| Sidebar task / functional module | Actors with route access | Represented subfunctions |
|---|---|---|
| Role dashboard | All seven; each has a distinct dashboard route | Role-specific overview represented as one use case per dashboard. |
| Tasks / Cleaning Tasks / Work Orders & Tasks | Administrator, Manager, Front Desk, Housekeeping, Maintenance | View/update assigned tasks; create/delete tasks. Create/delete are associated with Administrator and Manager in line with task API authorization; task status changes are assigned-task/manager operations. |
| Employees | Administrator, Manager | View/search staff; manage staff records (add, update, status change, delete). |
| Ratings / Staff Service Ratings / Guest Ratings & Scores | Administrator, Manager, Front Desk, Owner | View/filter ratings; manager performance evaluation. Guest employee ratings are a distinct guest action from the guest portal. |
| Feedback / Guest Feedback / Service Feedback | Administrator, Manager, Front Desk, Owner, Guest | Open the feedback workspace and view/export its displayed data; Manager can review feedback in the authorized data policy. Guest is not associated with review moderation. |
| Reports / Financial & Revenue Reports | Administrator, Manager, Owner | Generate and download a report. The implemented export is JSON. |
| Settings | All seven | Manage account and preferences (profile, notification, security, appearance, and language options). |
| Role-specific dashboard operations | Administrator | Alert inbox/status, staff announcement, room rates, payment terminal. |
| Role-specific dashboard operations | Manager | Room-rate management. |
| Role-specific dashboard operations | Front Desk | Room/booking overview, check-in/out, payment, rates, night audit, late-arrival evidence, keycard issuance. |
| Role-specific dashboard operations | Housekeeping | Cleaning queue, start cleaning, mark clean/ready. |
| Role-specific dashboard operations | Maintenance | Work orders/equipment, work tickets, equipment status, spare-parts requests. |
| Role-specific dashboard operations | Owner | Fiscal targets. Room-rate management is available from the dashboard. |
| Role-specific dashboard operations | Guest | Folio/receipt/keycard, cleaning request, staff rating, hotel-service request. |

The actor associations are drawn to each role's sidebar-module use case. Child ovals are separate use cases grouped in the same package to show the module's actual subfunctions; the analysis tables map those subfunctions to the authorized roles. No `<<include>>` or `<<extend>>` relationship is asserted because module membership alone does not justify either UML relationship.

## Evidence and implementation limits

| Evidence | What it verifies |
|---|---|
| [`frontend/components/layout/DashboardLayout.tsx`](../frontend/components/layout/DashboardLayout.tsx) | Exact role-specific sidebar menu labels and navigation entries. |
| [`frontend/lib/auth-routing.ts`](../frontend/lib/auth-routing.ts) | Seven normalized roles, dashboard routes, and per-role allowed dashboard pages. |
| [`frontend/app/dashboard/admin/page.tsx`](../frontend/app/dashboard/admin/page.tsx) | Administrator dispatch inbox, alert status actions, announcement broadcast, rate management, and payment terminal. |
| [`frontend/app/dashboard/manager/page.tsx`](../frontend/app/dashboard/manager/page.tsx) | Manager dashboard and room-rate/report actions. |
| [`frontend/app/dashboard/front-desk/page.tsx`](../frontend/app/dashboard/front-desk/page.tsx) | Front-desk room operations, check-in/out, payment, rate, night-audit, and late-arrival workflows. |
| [`frontend/app/dashboard/housekeeping/page.tsx`](../frontend/app/dashboard/housekeeping/page.tsx) | Cleaning queue, start-cleaning, and room-ready actions. |
| [`frontend/app/dashboard/maintenance/page.tsx`](../frontend/app/dashboard/maintenance/page.tsx) | Maintenance ticket, equipment-status, and spare-parts controls. |
| [`frontend/app/dashboard/owner/page.tsx`](../frontend/app/dashboard/owner/page.tsx) | Owner metrics, rate management, and fiscal-target form. |
| [`frontend/app/dashboard/guest/page.tsx`](../frontend/app/dashboard/guest/page.tsx) | Guest folio, cleaning request, staff rating, receipt, keycard, and service controls. |
| [`frontend/app/dashboard/tasks/page.tsx`](../frontend/app/dashboard/tasks/page.tsx) and [`backend/src/routes/tasks.routes.ts`](../backend/src/routes/tasks.routes.ts) | Task UI actions and authenticated task API routes; manager/admin restrictions for create/update/delete and authenticated task status/complete routes. |
| [`frontend/app/dashboard/employees/page.tsx`](../frontend/app/dashboard/employees/page.tsx), [`backend/src/routes/employees.routes.ts`](../backend/src/routes/employees.routes.ts), and [`backend/src/controllers/employees.controller.ts`](../backend/src/controllers/employees.controller.ts) | Employee list/actions, endpoints, and controller-level role checks for employee creation. |
| [`frontend/app/dashboard/ratings/page.tsx`](../frontend/app/dashboard/ratings/page.tsx) and [`frontend/components/guest/GuestEmployeeRatingModal.tsx`](../frontend/components/guest/GuestEmployeeRatingModal.tsx) | Staff evaluation and guest rating interfaces. |
| [`frontend/app/dashboard/feedback/page.tsx`](../frontend/app/dashboard/feedback/page.tsx) and [`frontend/app/dashboard/reports/page.tsx`](../frontend/app/dashboard/reports/page.tsx) | Feedback review/export controls and report generation/download behavior. |
| [`frontend/app/dashboard/settings/page.tsx`](../frontend/app/dashboard/settings/page.tsx) | Settings tabs and persistence behavior. |
| [`database/migrations/001_initial_schema.sql`](../database/migrations/001_initial_schema.sql), [`database/migrations/003_admin_notifications.sql`](../database/migrations/003_admin_notifications.sql), and [`database/seeds/seed_data.sql`](../database/seeds/seed_data.sql) | Base roles, later Administrator role, and development role profiles. |
| [`database/migrations/002_rls_policies.sql`](../database/migrations/002_rls_policies.sql) | Database role constraints for tasks, ratings, and feedback. |
| [`frontend/components/notifications/NotificationProvider.tsx`](../frontend/components/notifications/NotificationProvider.tsx) and [`database/migrations/003_admin_notifications.sql`](../database/migrations/003_admin_notifications.sql) | Cleaning service-request/notification workflow and available database tables/policies. |

### Prototype and authorization caveats

- Several visible screens are client-side demonstrations rather than fully wired business workflows. The task and employee pages use in-memory sample records and do not call their corresponding backend APIs. The backend task API and some employee endpoints do enforce separate authorization rules.
- The ratings interface stores ratings using the frontend room-data helper rather than the `employee_ratings` table. The page exposes evaluation controls to Administrator, Manager, Front Desk, and Owner; the database policy allows managers to create performance ratings and owners/managers to view records.
- The feedback page uses a hard-coded local list. The feedback RLS policies grant viewing to owners/managers and updates to managers, while the UI route is also exposed to Administrator, Front Desk, and Guest. This discrepancy must be resolved before treating those UI controls as a secure production permission model.
- The task page exposes create/status/delete controls to all roles routed to it, but its API restricts task creation, full updates, verification, and deletion to managers/admins; assigned employees can change task status/complete tasks. The current task page does not call that API, so its client-side demonstration does not enforce the same restrictions.
- The employee API allows only manager/owner/admin to create staff in the controller, while the sidebar page is exposed only to Administrator and Manager. Update/delete controller actions do not add an equivalent role check.
- Maintenance tickets/equipment and owner fiscal targets are local React state. Report data is demo content and report downloads are JSON. Some profile/security settings only show a success state; selected preferences are stored in browser local storage.
- Room, booking, rate, and payment flows are implemented in frontend helpers and modals; the existence of SQL tables does not establish that each screen persists to those tables.
- Guest cleaning requests attempt to write `service_requests` and `notifications` and retain a local notification fallback.

The diagram represents available role routes and concrete UI/API actions, while this section flags simulated or mismatched persistence/authorization instead of presenting it as verified database behavior.
