/* ExtendScript ES3: no network, geometry conversion, or expression evaluation. */
var MotionKit = (function () {
    function encode(s) {
        return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '"';
    }
    function serialize(r) {
        var reasons = [], k;
        for (k in r.reasons) if (r.reasons.hasOwnProperty(k)) reasons.push(encode(k) + ':' + r.reasons[k]);
        return '{"updated":' + r.updated + ',"skipped":' + r.skipped + ',"failed":' + r.failed + ',"message":' + encode(r.message) + ',"reasons":{' + reasons.join(',') + '}}';
    }
    function applyRoundness(value) {
        var r = { updated: 0, skipped: 0, failed: 0, reasons: {}, message: '' };
        var targets = [], visited = [], undoOpen = false;
        function skip(reason) { r.skipped++; r.reasons[reason] = (r.reasons[reason] || 0) + 1; }
        function seen(p) {
            for (var i = 0; i < visited.length; i++) if (visited[i] === p) return true;
            visited.push(p); return false;
        }
        function walk(p) {
            if (!p || seen(p)) return;
            if (p.matchName === 'ADBE Vector Shape - Rect') { targets.push(p.property('ADBE Vector Rect Roundness')); return; }
            if (p.matchName === 'ADBE Vector Rect Roundness') { targets.push(p); return; }
            if (!p.numProperties) { skip('Unsupported selected property'); return; }
            for (var i = 1; i <= p.numProperties; i++) {
                var child = p.property(i);
                if (child.matchName === 'ADBE Vector Shape - Rect' || child.matchName === 'ADBE Vectors Group' || child.matchName === 'ADBE Vector Group' || child.matchName === 'ADBE Root Vectors Group') walk(child);
                else if (child.matchName === 'ADBE Vector Shape - Group' || child.matchName === 'ADBE Vector Shape - Ellipse' || child.matchName === 'ADBE Vector Shape - Star') skip('Unsupported shape path');
            }
        }
        try {
            if (typeof value !== 'number' || !isFinite(value) || value < 0 || value > 1000) throw new Error('Enter a radius between 0 and 1000 px.');
            var comp = app.project && app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) throw new Error('Open a composition and select rectangle shape layers or paths.');
            var layers = comp.selectedLayers;
            if (!layers.length) throw new Error('Select at least one rectangle shape layer or path.');
            for (var l = 0; l < layers.length; l++) {
                var layer = layers[l];
                if (layer.locked) { skip('Locked layer'); continue; }
                var contents = layer.property('ADBE Root Vectors Group');
                if (!contents) { skip('Non-shape layer'); continue; }
                var selected = layer.selectedProperties, roots = [];
                // Explicit shape selections narrow the operation; unrelated properties never broaden it.
                if (selected.length) {
                    for (var s = 0; s < selected.length; s++) {
                        var p = selected[s], ancestor = p, inContents = false;
                        while (ancestor) {
                            if (ancestor.matchName === 'ADBE Root Vectors Group') { inContents = true; break; }
                            ancestor = ancestor.parentProperty;
                        }
                        if (inContents) roots.push(p);
                        else skip('Unsupported selected property');
                    }
                } else roots.push(contents);
                var before = targets.length;
                for (var j = 0; j < roots.length; j++) walk(roots[j]);
                if (targets.length === before && !selected.length) skip('No rectangle paths in layer');
            }
            var unique = [];
            for (var t = 0; t < targets.length; t++) {
                var target = targets[t], duplicate = false;
                for (var u = 0; u < unique.length; u++) if (unique[u] === target) duplicate = true;
                if (!duplicate && target) unique.push(target);
            }
            for (var n = 0; n < unique.length; n++) {
                var prop = unique[n];
                if (prop.expressionEnabled || (prop.canSetExpression && prop.expression !== '')) { skip('Expression on roundness'); continue; }
                if (prop.numKeys > 0) { skip('Animated roundness'); continue; }
                try {
                    if (prop.value === value) { skip('Already at requested value'); continue; }
                    if (!undoOpen) { app.beginUndoGroup('MotionKit · Roundness'); undoOpen = true; }
                    prop.setValue(value); r.updated++;
                } catch (writeError) { r.failed++; }
            }
            r.message = r.updated ? 'Roundness applied.' : 'No rectangle paths changed.';
        } catch (error) { r.message = error.message || String(error); }
        finally { if (undoOpen) app.endUndoGroup(); }
        return serialize(r);
    }
    return { applyRoundness: applyRoundness };
}());
