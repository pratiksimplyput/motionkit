(function () {
  'use strict';
  var slider = document.getElementById('slider'), input = document.getElementById('radius');
  var apply = document.getElementById('apply'), zero = document.getElementById('zero');
  var status = document.getElementById('status'), error = document.getElementById('input-error');
  var busy = false, host = window.MotionKitHost;
  function sync(raw, source) {
    var value = window.MotionKitValidation.radius(raw), valid = value !== null;
    error.textContent = valid ? '' : 'Enter a number from 0 to 1,000 px.';
    input.setAttribute('aria-invalid', String(!valid));
    apply.disabled = busy || !valid || !host.available;
    if (valid) {
      if (source !== input) input.value = value;
      slider.value = value;
      document.getElementById('preview-shape').style.borderRadius = Math.min(value, 38) + 'px';
    }
    return value;
  }
  slider.addEventListener('input', function () { sync(slider.value, slider); });
  input.addEventListener('input', function () { sync(input.value, input); });
  function run(value) {
    if (busy || value === null) return;
    busy = true; apply.disabled = true; zero.disabled = true;
    status.textContent = 'Applying to your current After Effects selection…'; status.dataset.state = '';
    host.apply(value).then(function (r) {
      var details = Object.keys(r.reasons || {}).map(function (key) { return key + ': ' + r.reasons[key]; });
      status.textContent = r.message + ' Updated ' + r.updated + ' rectangle path(s); skipped ' + r.skipped + '; failed ' + r.failed + '.' + (details.length ? ' ' + details.join(' · ') + '.' : '');
      status.dataset.state = r.failed || !r.updated ? 'error' : 'success';
      if (r.updated) sync(value);
    }).catch(function (err) { status.textContent = err.message; status.dataset.state = 'error'; }).then(function () {
      busy = false; zero.disabled = !host.available; sync(input.value, input);
    });
  }
  apply.addEventListener('click', function () { run(sync(input.value, input)); });
  zero.addEventListener('click', function () { run(0); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !apply.disabled) apply.click(); });
  function category(name) {
    document.querySelectorAll('[data-category]').forEach(function (button) {
      if (button.dataset.category === name) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    document.getElementById('roundness').hidden = name !== 'UI';
    document.getElementById('coming-soon').hidden = name === 'UI';
    document.getElementById('category-title').textContent = name;
  }
  document.querySelectorAll('[data-category]').forEach(function (button) { button.addEventListener('click', function () { category(button.dataset.category); }); });
  document.getElementById('back').addEventListener('click', function () { category('UI'); });
  document.querySelector('.brand').addEventListener('click', function (e) { e.preventDefault(); category('UI'); });
  document.getElementById('host-status').textContent = host.available ? 'AFTER EFFECTS' : 'BROWSER PREVIEW';
  status.textContent = host.available ? 'Ready. Select rectangle layers or paths, then apply.' : 'UI preview only. Open the installed panel in After Effects to apply roundness.';
  zero.disabled = !host.available; sync(input.value);
}());
