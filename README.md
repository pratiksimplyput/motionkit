# MotionKit · SimplyPut

A focused After Effects workflow panel. First development draft: a dark modular shell and an undo-grouped Roundness tool. Other categories are explicitly Coming soon.

No production dependencies or build step. CEP loads `panel/index.html`; the manifest loads `host/roundness.jsx`. Presentation lives in `panel/`, host communication in `panel/bridge.js`, numeric validation in `panel/validation.js`, and AE traversal/writes in `host/roundness.jsx`. Future tools should have independent UI and host modules rather than extending a monolithic action handler.

- [Install in AE](docs/INSTALL.md)
- [Development and manual testing](docs/TESTING.md)
- [Audit and implementation decisions](docs/AUDIT.md)
- [Product brief](docs/PROJECT_BRIEF.md)

Run `npm run check`, `npm test`, and `npm run package`. `npm run dev` is a UI-only preview; it cannot edit After Effects projects. The generated `dist/MotionKit-0.1.0-dev.zip` is unsigned and is not a ZXP.
