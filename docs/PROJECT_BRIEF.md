# MOTIONKIT — PROJECT BRIEF FOR CODEX

**Project:** MotionKit  
**Brand:** SimplyPut  
**Document date:** 26 October 2026  
**Purpose:** Transfer product context, previous decisions, technical expectations, and immediate instructions to a coding agent.  
**Status:** Early development. The repository and actual working functionality have **not** been audited for this brief.

> **Read this first, Codex:** This is a context and direction document, not proof that the codebase matches it. Inspect the existing repository before making changes. Preserve working code. Report discrepancies. Do not assume that planned features have been implemented.

## 1. What MotionKit is

MotionKit is a planned collection of workflow tools for **Adobe After Effects**. It will live inside a **single unified extension/panel**, instead of forcing users to install a separate interface for every tool. The product sits under **SimplyPut**, a motion-design YouTube brand.

**Product vision:** Help motion designers create polished SaaS/product animations faster, with less repetitive manual work and more time for visual quality and storytelling.

This is **not** intended to be a general-purpose motion-design application, an After Effects replacement, or a copy of any competitor's plugin. Its value should come from useful workflows, an efficient user experience, and well-executed integrations with After Effects.

### Primary audience

- Intermediate motion designers who already know After Effects.
- Designers working on SaaS explainers, product UI demos, website animations, and commercial motion graphics.
- People who can follow tutorials but want to execute professional work faster and with greater independence.

**Distribution advantage:** SimplyPut has an existing motion-design YouTube audience. Tutorials and real-world demonstrations can introduce MotionKit to potential buyers. Audience size does not guarantee sales.

## 2. Previous decisions: confirmed direction vs. unvalidated ideas

| Area | What we decided or discussed | Confidence/status |
|---|---|---|
| Name | **MotionKit** | Working product name |
| Brand | **SimplyPut** | Confirmed direction |
| Host | **Adobe After Effects** | Confirmed |
| Form factor | **One expandable panel/suite** with tools grouped by category | Confirmed direction |
| UI look | Premium, modern, **dark-themed** interface | Agreed design direction |
| Start small | Build the overall shell, with **Roundness as the first functional tool** | Confirmed plan |
| First tool | Roundness control for compatible rectangle shape paths | Confirmed specification; runtime not verified |
| Code status | An initial tool/project was reportedly created through Codex | User-reported; inspect repository |
| Extension framework | CEP was previously mentioned, but architecture was **not verified or conclusively locked** | Audit before choosing or changing |
| Later tools | Import, animation, UI-building, typography, and utility tools | Exploratory backlog; not commitments |
| Monetization | Sell as a digital software product | Strategic intention; no finalized offer |
| Pricing | Early examples of **US$29–49** for a focused product, with later **US$59–79** discussed | Illustrative hypotheses, **not** approved prices |

## 3. UX and information architecture

The agreed idea is to create the **complete expandable interface now**, but not implement every tool at once.

### Main panel categories

1. **Import** — e.g. future Figma → AE and Illustrator → AE workflows.
2. **Animate** — e.g. stagger, cursor animation, transitions, and animation helpers.
3. **UI** — e.g. Roundness, Auto Layout, Smart Card, Carousel, Browser Frame.
4. **Text** — e.g. text animation and text systems.
5. **Effects** — e.g. gradient or glow controls.
6. **Utilities** — e.g. counters, charts, repetitive workflow shortcuts.

These groupings are a **starting taxonomy**, not a requirement to display fake functional controls. Names and categories may evolve based on user testing.

### Interface requirements

- Visually consistent, polished dark UI suitable for a **narrow, docked After Effects panel**.
- Consistent navigation, spacing, typography, control heights, hover/focus states, and icons.
- Shared reusable components for tool cards, sliders, numeric inputs, buttons, selection/status notices, and error states.
- The active tool is obvious. Controls must show when they are unavailable.
- Future features may appear as **clearly labeled “Coming soon” placeholders**, not as dead buttons that seem functional.
- One tool should not be tightly coupled to another tool's implementation.
- Keep the panel useful if the user's selection is empty, incompatible, or mixed.
- Prioritize usability and stability over decoration.

## 4. First functional feature — Roundness

**Goal:** Change the corner radius of eligible rectangle shape paths in After Effects without manually opening each layer's shape property hierarchy.

### Expected user flow

1. Select one or more shape layers or compatible rectangle shape paths in After Effects.
2. Open **MotionKit → UI → Roundness**.
3. Enter the corner radius through a **slider and synchronized numeric field**.
4. Click **Apply** to apply the value to all compatible selected rectangle paths.
5. Receive clear feedback on what was changed and what was skipped.
6. Use a clearly defined **Reset** action only when its effect is unambiguous.

### Required behavior

- Find compatible **parametric Rectangle Path → Roundness** properties within the current selection, including eligible nested shape groups where practical.
- Support **multiple selected shape layers** and, when unambiguous, selected properties/groups.
- Preserve unrelated shape properties, layer transforms, expressions, and animation.
- Handle no selection, mixed selection, locked layers, non-shape layers, and unsupported paths safely.
- Wrap changes in an **After Effects undo group**, so one Undo can revert the operation.
- Never silently convert a Bezier path, destructive-expand artwork, or replace other shape geometry.
- Skip or explicitly handle Roundness values driven by animation/expressions. Do not silently overwrite keyframes or expressions.
- Surface accurate counts or feedback, e.g. “Updated 5 rectangle paths; skipped 2 unsupported items.”
- Keep the slider and input in sync. Validate numeric values and reasonable limits.

### Reset semantics — important clarification

Our earlier plan named an **Apply/Reset** workflow, but did not settle what Reset means. **Do not guess.** Prefer either:
- `Restore previous values`, only if reliable value snapshots exist and the behavior is fully specified; **or**
- `Set to 0`, if the button clearly says exactly that.

For the initial build, a clearly named **Set to 0** is safer than an ambiguous Reset.

### Definition of done for Roundness

A user can select multiple eligible shapes, change their radius, undo it safely, and understand any skipped items. The panel does not throw or modify unrelated layers. Behavior is tested in a real, supported After Effects version.

## 5. Feature backlog — ideas, NOT current build scope

The following came up in our earlier brainstorming. Their presence here does **not** authorize implementing them immediately.

| Category | Tool concepts previously discussed | Why they might matter |
|---|---|---|
| Import | **Figma → AE**, Illustrator → AE | Faster handoff of editable design assets |
| Animate | Stagger, text animations, cursor/click animations, transition helpers | Reduce repetitive timeline work |
| UI | Auto Layout/flex-like layout, Smart Cards, Carousel, Browser Frame, UI Reveal Builder | Build animated SaaS UI components faster |
| Text | SaaS Text System, kinetic typography, counters | Consistent text and data motion |
| Effects | Gradient, glow, related styling controls | Faster visual polish |
| Utilities | Chart builders, scene builders, other shortcuts | Speed up common presentation workflows |
| Presets/assets | Ready-made SaaS scenes | Could be a separate kit or complementary product |

**Potential later candidates** should be selected using evidence: frequency of the pain point, existing alternatives, implementation complexity, demo appeal, compatibility risk, and whether people would pay.

**Do not** add every backlog idea to the first release. Figma/Illustrator import, in particular, can have significant engineering and asset-conversion complexity.

## 6. Engineering principles

### Architecture

- First, **inspect the existing repository** and report the extension framework, current panel structure, scripts, dependencies, version configuration, and functionality.
- Determine whether it uses **CEP, UXP, ScriptUI, ExtendScript**, or a combination. Do not assume one is correct merely because it was previously mentioned.
- Check Adobe's current compatibility and distribution requirements against the desired After Effects versions. The target versions, OS matrix, and packaging method are **not yet locked**.
- **Do not rewrite or migrate** a functioning codebase unless there is a clear technical reason and an agreed plan.
- Keep UI presentation, Adobe host communication, tool logic, shared components, utilities, and configuration separated.
- Use well-defined interfaces for adding more tools later.
- Favor direct, maintainable implementations over unnecessary frameworks or premature abstractions.

### Suggested modular boundaries (adapt to the repo)

```text
motionkit/
  panel/               # Navigation, shared UI components, tool views
  tools/
    roundness/         # Roundness-specific UI, logic, tests
    ...                # Add only when approved
  host/                # After Effects scripting and host bridge
  shared/              # Reusable utilities, validation, messages
  assets/              # Icons and UI assets
  docs/                # Install, test, develop, release
  config/              # Build and extension configuration
```

This is **illustrative**, not an instruction to replace the existing structure.

### Quality and safety

- Never perform destructive edits without explicit user intent.
- Prefer predictable effects and AE-native undo behavior.
- Handle host errors and unsupported versions gracefully.
- Avoid pretending unsupported operations succeeded.
- No external analytics, licensing, telemetry, network requests, or paid SDKs without an explicit product decision.
- Keep development/test installation instructions reproducible.
- Provide a clear release packaging path when the tech stack is known.

## 7. Business context and constraints

MotionKit is intended to create **scalable product revenue**, not another client-heavy agency or teaching business.

- Founder has a demanding full-time role and approximately **15+ hours/week** for side projects.
- Indicative operating budget: **AED 2,000/month**.
- Larger SimplyPut objective: consistent business income of **AED 20,000/month**, sustained for at least six months. MotionKit could contribute, but has **no validated share** of that target.
- Prefer a small, efficient operation and software/digital products that do not require intensive support.
- Marketing can leverage SimplyPut videos, tutorials, real workflow demonstrations, and a product landing page.
- Avoid treating viewer interest, subscribers, or waitlist signups as proof of willingness to pay.

### Validation before expansion

Before building complex tools, aim to collect evidence:

1. A demo showing **Roundness solving a real workflow problem**.
2. Specific feedback from relevant motion designers on usefulness and missing functionality.
3. A simple landing page or waitlist to measure qualified interest.
4. Evidence of purchase intent (ideally actual purchases/preorders after the MVP is stable and the offer is honest).
5. Only then select the next tool or expand scope.

**Critical product challenge:** Roundness alone may be too easy to replicate or too small a problem to justify a standalone purchase. Treat it as an engineering and UX proving ground. The paid offer likely needs a stronger, distinct workflow advantage.

## 8. What is and is not known

### Known from previous conversations

- MotionKit is a **SimplyPut After Effects panel/suite**.
- The UX should be a unified, dark-themed, expandable shell.
- The initial shell has categories: Import, Animate, UI, Text, Effects, Utilities.
- **Roundness** was the first planned functional tool.
- Initial coding through Codex was reported; the user previously indicated that the first tool was created.
- More tools should be added modularly over time, **not all at once**.

### Unknown — verify or ask only when blocking

- Actual repository path, git status, branch, and current source code.
- Whether Roundness currently installs, renders, or works correctly inside AE.
- Framework and build tools truly in use.
- Exact After Effects versions and supported Mac/Windows matrix.
- Final UI component library, fonts, icons, and design tokens.
- Plugin signing, installation, licensing, payment, update system, and store.
- Final tool feature priorities and pricing.

**Never claim these are already complete without examining evidence.**

## 9. Immediate instructions for Codex

**Do not start by implementing the entire backlog.** First make an evidence-based assessment of the current MotionKit project.

### Phase 0 — audit the repo

1. Read the project files and identify how the panel is loaded in After Effects.
2. Describe the current architecture, entry points, dependencies, scripts, and install/build process.
3. Show which features genuinely exist, which are placeholders, and which are broken or incomplete.
4. Inspect Roundness implementation against the acceptance criteria above.
5. List compatibility, reliability, and UX problems by severity.
6. Identify the smallest set of changes needed to deliver a stable first release candidate.

### Phase 1 — implement or repair the foundation

After the audit, make focused changes to:

1. Get the **existing MotionKit panel** running reliably, preserving working code.
2. Provide a coherent dark panel shell and navigation.
3. Make **Roundness** robust and undo-safe.
4. Display planned tools only as unmistakable **Coming soon** placeholders.
5. Add concise developer installation instructions and a manual AE test checklist.
6. Explain anything that cannot be verified without a local AE installation.

### Phase 2 — review before adding more features

Provide a short report covering:

- Files changed and why.
- Build/run/test commands and their actual results.
- Working functionality and known limitations.
- How to install and test in After Effects.
- Remaining issues and the **single best next tool** to build, with justification.

Do not implement Phase 2's proposed new tool without another instruction.

## 10. Required test checklist

For Roundness, verify at least:

- [ ] One selected rectangle shape path.
- [ ] Multiple supported rectangles across selected shape layers.
- [ ] A shape layer containing nested groups or multiple rectangle paths.
- [ ] Mixed selection including unsupported layers/paths.
- [ ] Empty selection.
- [ ] Locked and hidden layers where relevant.
- [ ] Existing keyframes and expressions are not unexpectedly destroyed.
- [ ] Slider/input synchronization and invalid input handling.
- [ ] One-step AE Undo after Apply.
- [ ] No unintended changes to transforms, strokes, fills, or other shape paths.
- [ ] Panel remains usable when narrow/docked.
- [ ] Action outcome is accurate; partial successes and failures are visible.

If the available environment cannot run After Effects, clearly distinguish **static checks** from **host-verified tests**.

---

## Copy-and-paste kickoff message for Codex

> This repository is the existing **MotionKit** After Effects extension project. Read `MotionKit_Codex_Project_Brief.md` fully. Treat it as historical product context, not proof of implementation. Audit the current repo first. Report what actually works, especially the panel shell and Roundness tool. Then fix only the smallest issues necessary for a stable, modular dark panel and functional Roundness workflow. Preserve working code. Do not build the future tools yet. Use genuine AE undo handling and safe selection checks. Show me changes, tests run, any AE tests you could not perform, and exact local installation steps. If you find a conflict between this brief and the repo, report it and choose the least destructive path.

**End of brief.**
