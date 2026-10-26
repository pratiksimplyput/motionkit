# Validation

From the repository root, with Node 24 and Python 3:

```
npm run check
npm test
npm run package
npm run dev
```

`dev` serves a browser-only UI preview on port 8080. Apply and Set to 0 are disabled outside Adobe. Tests use a simulated ExtendScript property tree: they do not verify Adobe property identity, runtime loading, or undo behavior.

## Mandatory real-AE release gate

Record OS, AE version, CEP runtime, date, expected and actual outcomes. None of the following is host-verified yet:

- One rectangle; multiple rectangles across layers; deeply nested shape groups.
- Select just one path/group/roundness property among several; confirm siblings stay unchanged. Test overlapping parent/child selections for duplicates.
- Mixed non-shape layers, Bezier/ellipse/star paths, empty selection, no composition.
- Locked layers and selected hidden layers; only eligible unlocked targets change.
- Keyframed, enabled-expression and disabled-expression roundness remain untouched.
- Apply and Set to 0 each revert with one Undo; redo works.
- Fill, stroke, geometry, transforms, keyframes and expressions remain unchanged.
- Numeric and slider synchronization, decimals, 0, 1000, blank, negative and invalid inputs.
- Partial failures and skip counts match the actual affected selection.
- Dock at 280 px and larger; keyboard navigation, focus indicators, all category placeholders, loading and host errors remain usable.
- Close/reopen panel and restart AE; no missing assets or script-loading errors.

Do not call this release-ready or sell it before passing the real-host gate. Signing, installer validation on Windows/macOS, license/update decisions and distribution compatibility remain separate release work.
