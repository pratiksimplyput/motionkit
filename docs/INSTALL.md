# Install the development build

This is an unsigned CEP development panel, not a commercial installer. The manifest permits AE 24–26 (2024–2026), but none of those versions is host-verified yet. Confirm CEP availability in your installed AE before distribution. No UXP support is claimed.

1. Close After Effects.
2. Copy the `CSXS`, `panel`, and `host` directories together into a folder named `com.simplyput.motionkit` under:
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/`
   - Windows: `%APPDATA%\Adobe\CEP\extensions\`
3. Enable unsigned extensions for your AE's CEP runtime. For CEP 11 on macOS: `defaults write com.adobe.CSXS.11 PlayerDebugMode -string 1`. On Windows set the string value `PlayerDebugMode` to `1` under `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`. The runtime number must match your installed Adobe runtime; do not assume every AE release uses 11.
4. Restart AE. Open **Window → Extensions → MotionKit** (menu wording may differ by version).
5. Open a composition, create a parametric rectangle shape layer, select it, and apply 24 px. Undo once and confirm the previous value returns.

If the panel is missing, check extension folder nesting, manifest host range, runtime and debug preference first. Record exact AE/OS versions in any bug report. Remove the debug setting after development; production distribution needs signing and a tested installer. Never ask customers to disable extension verification as the commercial installation flow.

## Selection and safety

Selecting a layer targets all its compatible rectangle paths, including nested groups. Selecting properties narrows the scope to those properties/groups; an unrelated selected property does not silently target the whole layer. Hidden but selected unlocked layers are eligible. Locked layers, Bezier/ellipse/star paths, animated roundness, and any nonempty roundness expression (even disabled) are skipped. `Set to 0` affects the current eligible selection, not a saved snapshot. Counts describe paths or explicitly skipped items, not a universal count of every property in a layer.

The preview is illustrative; it does not read artwork or show actual AE geometry. Maximum input is 1,000 px. No external network requests, analytics, or fonts are used by the panel.
