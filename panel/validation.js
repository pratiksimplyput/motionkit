(function (root) {
  'use strict';
  function radius(value) {
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (String(value).trim() === '') return null;
    var n = Number(value);
    return isFinite(n) && n >= 0 && n <= 1000 ? Math.round(n * 10) / 10 : null;
  }
  root.MotionKitValidation = { radius: radius };
  if (typeof module !== 'undefined') module.exports = root.MotionKitValidation;
}(typeof window === 'undefined' ? globalThis : window));
