const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { radius } = require('../panel/validation.js');
const source = fs.readFileSync('host/roundness.jsx', 'utf8');
function group(name, children = []) {
  const p = { matchName: name, numProperties: children.length, property: key => typeof key === 'number' ? children[key - 1] : children.find(c => c.matchName === key) };
  children.forEach(c => { c.parentProperty = p; }); return p;
}
function rectangle(options = {}) {
  const prop = { matchName: 'ADBE Vector Rect Roundness', value: 10, expressionEnabled: false, canSetExpression: true, expression: '', numKeys: 0, setValue(v) { this.value = v; }, ...options };
  return { prop, path: group('ADBE Vector Shape - Rect', [prop]) };
}
function layer(children, options = {}) { return { locked: false, selectedProperties: [], property: () => group('ADBE Root Vectors Group', children), ...options }; }
function run(layers, value = 24) {
  function CompItem() { this.selectedLayers = layers; }
  let begins = 0, ends = 0;
  const ctx = { CompItem, app: { project: { activeItem: new CompItem() }, beginUndoGroup() { begins++; }, endUndoGroup() { ends++; } } };
  vm.createContext(ctx); vm.runInContext(source, ctx);
  return { result: JSON.parse(ctx.MotionKit.applyRoundness(value)), begins, ends };
}
test('numeric validation rejects blank, non-finite, and out of range values', () => {
  for (const value of ['', ' ', null, undefined, -1, 1001, Infinity, 'x']) assert.equal(radius(value), null);
  assert.equal(radius('24.25'), 24.3); assert.equal(radius(0), 0);
});
test('multiple nested rectangles share one undo group', () => {
  const a = rectangle(), b = rectangle();
  const { result, begins, ends } = run([layer([group('ADBE Vector Group', [group('ADBE Vectors Group', [a.path])])]), layer([b.path])]);
  assert.equal(result.updated, 2); assert.equal(a.prop.value, 24); assert.equal(b.prop.value, 24); assert.equal(begins, 1); assert.equal(ends, 1);
});
test('animated, disabled-expression, and locked items are preserved', () => {
  const a = rectangle({ numKeys: 2 }), b = rectangle({ expression: 'value' }), c = rectangle();
  const { result, begins } = run([layer([a.path, b.path]), layer([c.path], { locked: true })]);
  assert.equal(result.updated, 0); assert.equal(result.skipped, 3); assert.equal(begins, 0);
  for (const p of [a, b, c]) assert.equal(p.prop.value, 10);
});
test('explicit property selection is narrow and deduplicated', () => {
  const a = rectangle(), b = rectangle();
  const l = layer([a.path, b.path]); l.property(); l.selectedProperties = [a.path, a.prop];
  const { result } = run([l]); assert.equal(result.updated, 1); assert.equal(b.prop.value, 10);
});
test('unsupported selected properties do not fall back to entire layer', () => {
  const a = rectangle(), l = layer([a.path], { selectedProperties: [group('ADBE Transform Group')] });
  assert.equal(run([l]).result.updated, 0); assert.equal(a.prop.value, 10);
});
test('mixed unsupported paths and layers are counted', () => {
  const a = rectangle(); const r = run([layer([a.path, group('ADBE Vector Shape - Ellipse')]), { locked: false, property: () => null }]).result;
  assert.equal(r.updated, 1); assert.equal(r.skipped, 2);
});
test('empty selection and invalid values do not open undo groups', () => {
  assert.match(run([]).result.message, /Select/); assert.equal(run([], -1).begins, 0);
});
test('write failures report partial success and close undo group', () => {
  const a = rectangle(), b = rectangle({ setValue() { throw Error('write failed'); } });
  const r = run([layer([a.path, b.path])]); assert.equal(r.result.updated, 1); assert.equal(r.result.failed, 1); assert.equal(r.ends, 1);
});
test('set to zero and no-op feedback are explicit', () => {
  const a = rectangle(); assert.equal(run([layer([a.path])], 0).result.updated, 1); assert.equal(a.prop.value, 0);
  const r = run([layer([a.path])], 0); assert.equal(r.result.skipped, 1); assert.equal(r.begins, 0);
});
