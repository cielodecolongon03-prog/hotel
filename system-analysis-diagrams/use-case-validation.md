# Use Case Diagram Validation

## Requirements checklist

- [x] Located and visually inspected the repository reference image, `use case example.jpg`, before authoring the diagram.
- [x] Followed the reference's traditional presentation: a blue system boundary, plain oval use cases, stick-figure actors outside the boundary, and simple associations.
- [x] Used exactly seven distinct user actors: Administrator, Hotel Manager, Front Desk Staff, Housekeeping Staff, Maintenance Staff, Hotel Owner, and Guest.
- [x] Verified the role names against `frontend/lib/auth-routing.ts`, `database/migrations/003_admin_notifications.sql`, and `database/seeds/seed_data.sql`.
- [x] Matched role-specific sidebar tasks to `frontend/components/layout/DashboardLayout.tsx` and checked route access in `frontend/lib/auth-routing.ts`.
- [x] Included module parent use cases and separate meaningful subfunction use cases; packages are visual groupings only.
- [x] Used solid actor-to-use-case associations. No `<<include>>` or `<<extend>>` relationship is asserted because no unconditional inclusion or conditional extension was necessary to represent the selected behavior.
- [x] Excluded Login, Sign in, authentication, and login-page use cases.
- [x] Did not treat the database, backend, or any internal software component as an actor.
- [x] Excluded unsubstantiated features and documented prototype behavior and UI/database authorization mismatches in `use-case-analysis.md`.
- [x] PlantUML source is saved as `use-case-diagram.puml`.

## Render and visual inspection

- [x] Generated `use-case-diagram.png` from the same diagram model and opened it for visual inspection.
- [x] Compared the output with `use case example.jpg`: both use a blue system boundary, simple oval use cases, stick-figure actors outside the boundary, and restrained styling.
- [x] Visually checked the seven actor figures and labels, boundary title, case labels, package groupings, readable spacing, and actor associations.
- [x] Re-rendered after revising the association routing and inspected the latest PNG.
- [x] Verified the PNG is 4900 x 3150 pixels at 300 DPI.

**Renderer note:** A PlantUML executable was unavailable in the environment. The editable `.puml` is saved, and the PNG was rendered locally from the same diagram model rather than by executing PlantUML. The source structure and output contents were checked separately; PlantUML-engine compilation has not been verified.

**Association layout note:** The diagram associates actors with their module-level use cases; child ovals are grouped subfunctions, not `<<include>>`/`<<extend>>` links. Some actor-to-module lines cross one another; they are drawn lightly and behind the ovals so use-case labels remain readable.
