/*
 * networkViewer.runtime.js
 *
 * Inlined verbatim into the exported network HTML file (see
 * networkHtmlExport.js) — never imported by the app, only read as a string via
 * Vite's ?raw. It lives here as real source so it stays lintable and
 * formattable instead of a template literal.
 *
 * Constraints: no imports, no build step, no network access. It reads the
 * payload the exporter embedded and drives the pre-rendered SVG.
 */

(function () {
  var payload = JSON.parse(
    document.getElementById('network-payload').textContent,
  );
  var svg = document.querySelector('svg.graph');
  var panel = document.querySelector('aside');
  var nodeEls = new Map();
  var edgeEls = [];
  var pinned = null;
  var drag = null;
  var panned = false;

  svg.querySelectorAll('.node').forEach(function (el) {
    nodeEls.set(el.dataset.id, el);
  });
  svg.querySelectorAll('.edge').forEach(function (el) {
    edgeEls.push(el);
  });

  var nodesById = new Map();
  payload.nodes.forEach(function (n) {
    nodesById.set(String(n.id), n);
  });

  var neighbors = new Map();
  function link(a, b) {
    if (!neighbors.has(a)) neighbors.set(a, new Set());
    neighbors.get(a).add(b);
  }
  payload.links.forEach(function (pair) {
    link(pair[0], pair[1]);
    link(pair[1], pair[0]);
  });

  /* Highlights a node and its direct neighbors, dimming the rest — the same
     neighborhood filter the live graph applies through its Sigma reducers. */
  function focusNode(id) {
    clearFocus();
    if (!id) return;

    var near = neighbors.get(id) || new Set();
    svg.classList.add('focus');

    var active = nodeEls.get(id);
    if (active) active.classList.add('hl');
    near.forEach(function (other) {
      var el = nodeEls.get(other);
      if (el) el.classList.add('hl');
    });

    edgeEls.forEach(function (el) {
      if (el.dataset.source === id || el.dataset.target === id) {
        el.classList.add('hl');
      }
    });
  }

  function clearFocus() {
    svg.classList.remove('focus');
    nodeEls.forEach(function (el) {
      el.classList.remove('hl');
    });
    edgeEls.forEach(function (el) {
      el.classList.remove('hl');
    });
  }

  function text(value) {
    return value === null || value === undefined || value === ''
      ? 'N/A'
      : String(value);
  }

  function row(term, value) {
    var dt = document.createElement('dt');
    dt.textContent = term;
    var dd = document.createElement('dd');
    dd.textContent = text(value);
    return [dt, dd];
  }

  /* Built with DOM calls rather than innerHTML: owner names are third-party
     data and this file gets opened straight from a downloads folder. */
  function showPanel(id) {
    var node = nodesById.get(id);
    if (!node) return;
    var meta = node.meta || {};

    panel.textContent = '';

    var close = document.createElement('button');
    close.className = 'close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Close details');
    close.textContent = '×';
    close.addEventListener('click', function () {
      setPinned(null);
    });
    panel.appendChild(close);

    var name = document.createElement('p');
    name.className = 'name';
    name.textContent = node.label;
    panel.appendChild(name);

    var type = document.createElement('p');
    type.className = 'type';
    type.textContent =
      (node.isHub ? 'Hub owner' : 'Connected owner') +
      (meta.cms_ownership_type ? ' · ' + meta.cms_ownership_type : '');
    panel.appendChild(type);

    var dl = document.createElement('dl');
    [
      ['Total facilities', meta.total_facilities],
      ['Shared facilities', node.sharedCount],
      ['Star rating', meta.star_rating],
      ['Operating margin', meta.cms_owner_avg_operating_margin],
      ['Related party expense ratio', meta.cms_owner_avg_related_to_total_exp],
    ].forEach(function (pair) {
      row(pair[0], pair[1]).forEach(function (el) {
        dl.appendChild(el);
      });
    });
    panel.appendChild(dl);

    var shared = meta.sharedFacilities || [];
    if (shared.length) {
      var heading = document.createElement('h2');
      heading.textContent = 'Shares facilities with';
      panel.appendChild(heading);

      var list = document.createElement('ul');
      shared.forEach(function (entry) {
        var li = document.createElement('li');
        var who = document.createElement('span');
        who.textContent = entry.ownerName || String(entry.ownerId);
        var count = document.createElement('span');
        count.textContent =
          entry.count === 1 ? '1 facility' : entry.count + ' facilities';
        li.appendChild(who);
        li.appendChild(count);
        list.appendChild(li);
      });
      panel.appendChild(list);
    }

    if (meta.slug && payload.profileBase) {
      var link = document.createElement('a');
      link.className = 'profile';
      link.href = payload.profileBase + meta.slug;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open owner profile ↗';
      panel.appendChild(link);
    }

    panel.hidden = false;
  }

  /* Click toggles the pin, matching pinNode in the live graph. */
  function setPinned(id) {
    if (pinned) {
      var previous = nodeEls.get(pinned);
      if (previous) previous.classList.remove('pinned');
    }

    pinned = pinned === id ? null : id;

    if (pinned) {
      var el = nodeEls.get(pinned);
      if (el) el.classList.add('pinned');
      focusNode(pinned);
      showPanel(pinned);
    } else {
      clearFocus();
      panel.hidden = true;
    }
  }

  /* One delegated listener rather than handlers per node — a dense depth-2
     network runs to thousands of elements. */
  function nodeIdFrom(event) {
    var el = event.target.closest ? event.target.closest('.node') : null;
    return el ? el.dataset.id : null;
  }

  svg.addEventListener('mouseover', function (event) {
    if (pinned) return;
    var id = nodeIdFrom(event);
    if (id) focusNode(id);
  });

  svg.addEventListener('mouseout', function (event) {
    if (pinned) return;
    if (nodeIdFrom(event)) clearFocus();
  });

  svg.addEventListener('click', function (event) {
    /* A pan ends with a click, which would otherwise toggle whatever the
       pointer happened to land on. */
    if (panned) return;
    setPinned(nodeIdFrom(event));
  });

  var view = payload.viewBox.slice();

  function applyView() {
    svg.setAttribute('viewBox', view.join(' '));
  }

  svg.addEventListener(
    'wheel',
    function (event) {
      event.preventDefault();

      var rect = svg.getBoundingClientRect();
      var fx = (event.clientX - rect.left) / rect.width;
      var fy = (event.clientY - rect.top) / rect.height;
      var factor = event.deltaY < 0 ? 0.85 : 1 / 0.85;

      /* Anchor the zoom on the cursor: the graph point under it has to stay
         under it, so the origin shifts by the share of the size change that
         falls to its left and above. */
      var width = view[2] * factor;
      var height = view[3] * factor;
      view[0] += (view[2] - width) * fx;
      view[1] += (view[3] - height) * fy;
      view[2] = width;
      view[3] = height;

      applyView();
    },
    { passive: false },
  );

  svg.addEventListener('pointerdown', function (event) {
    drag = { x: event.clientX, y: event.clientY };
    panned = false;
    svg.classList.add('panning');
    svg.setPointerCapture(event.pointerId);
  });

  svg.addEventListener('pointermove', function (event) {
    if (!drag) return;

    var dx = event.clientX - drag.x;
    var dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) panned = true;

    var rect = svg.getBoundingClientRect();
    view[0] -= (dx * view[2]) / rect.width;
    view[1] -= (dy * view[3]) / rect.height;
    drag = { x: event.clientX, y: event.clientY };

    applyView();
  });

  function endDrag(event) {
    if (!drag) return;
    drag = null;
    svg.classList.remove('panning');
    if (svg.hasPointerCapture(event.pointerId)) {
      svg.releasePointerCapture(event.pointerId);
    }
  }

  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setPinned(null);
  });
})();
