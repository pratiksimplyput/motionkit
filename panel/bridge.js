(function () {
  'use strict';
  window.MotionKitHost = {
    available: !!window.__adobe_cep__,
    apply: function (radius) {
      return new Promise(function (resolve, reject) {
        if (!window.__adobe_cep__) return reject(new Error('Open MotionKit inside After Effects to edit your selection.'));
        var timeout = setTimeout(function () { reject(new Error('After Effects has not responded. Check for an open dialog before trying again.')); }, 15000);
        window.__adobe_cep__.evalScript('MotionKit.applyRoundness(' + radius + ')', function (raw) {
          clearTimeout(timeout);
          try {
            var result = JSON.parse(raw);
            if (!result || typeof result.updated !== 'number' || typeof result.skipped !== 'number') throw new Error('Invalid response');
            resolve(result);
          } catch (_) { reject(new Error('Could not read the host response. Reopen the panel and try again.')); }
        });
      });
    }
  };
}());
