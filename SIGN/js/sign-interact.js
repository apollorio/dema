/* ═══════════════════════════════════════════════════════════
   sign-interact.js — interact.js Drag & Resize
   Initialise/reinit drag+resize on #sign-rect, sync state,
   keyboard nudge, ± buttons.
   Depends: sign-config.js (SignEngine), sign-placer.js
   ═══════════════════════════════════════════════════════════ */
;(function (SE) {
  'use strict';

  var st = SE.state;
  var warnTm;

  function showWarn () {
    clearTimeout(warnTm);
    SE.dom.minWarn.classList.add('vis');
    warnTm = setTimeout(function () { SE.dom.minWarn.classList.remove('vis'); }, 2200);
  }

  function syncRectData (el) {
    var bx = parseFloat(el.style.left) || 0, by = parseFloat(el.style.top) || 0;
    var tx = parseFloat(el.dataset.x) || 0, ty = parseFloat(el.dataset.y) || 0;
    st.currentRect = { x: bx + tx, y: by + ty, w: parseFloat(el.style.width), h: parseFloat(el.style.height) };
    SE.modules.placer.updateDim(st.currentRect.w, st.currentRect.h);
  }

  function reInit () {
    if (st.interactInst) { st.interactInst.unset(); st.interactInst = null; }
    if (typeof interact === 'undefined') return;
    st.interactInst = interact('#sign-rect')
      .draggable({
        listeners: {
          move: function (ev) {
            var el = ev.target;
            var x = (parseFloat(el.dataset.x) || 0) + ev.dx;
            var y = (parseFloat(el.dataset.y) || 0) + ev.dy;
            el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            el.dataset.x = x; el.dataset.y = y;
            syncRectData(el);
          }
        },
        modifiers: [interact.modifiers.restrictRect({ restriction: '#pdf-p2', endOnly: true })]
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: function (ev) {
            var el = ev.target;
            if (ev.rect.width < SE.MIN_W || ev.rect.height < SE.MIN_H) { showWarn(); return; }
            el.style.width  = ev.rect.width  + 'px';
            el.style.height = ev.rect.height + 'px';
            var x = (parseFloat(el.dataset.x) || 0) + ev.deltaRect.left;
            var y = (parseFloat(el.dataset.y) || 0) + ev.deltaRect.top;
            el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            el.dataset.x = x; el.dataset.y = y;
            syncRectData(el);
          }
        },
        modifiers: [interact.modifiers.restrictSize({ min: { width: SE.MIN_W, height: SE.MIN_H } })]
      });
  }

  /* ── keyboard / button nudge ── */
  function nudge (dw, dh) {
    var d = SE.dom;
    if (!st.rectPlaced) {
      if (window.innerWidth < 861) return;
      st.docZoom = Math.max(.6, Math.min(1.6, st.docZoom + dw * .007));
      d.pdfC.style.transform = 'scale(' + st.docZoom + ')';
      return;
    }
    var nw = (parseFloat(d.signRect.style.width)  || st.currentRect.w) + dw;
    var nh = (parseFloat(d.signRect.style.height) || st.currentRect.h) + dh;
    if (nw < SE.MIN_W || nh < SE.MIN_H) { showWarn(); return; }
    d.signRect.style.width  = nw + 'px';
    d.signRect.style.height = nh + 'px';
    st.currentRect.w = nw; st.currentRect.h = nh;
    SE.modules.placer.updateDim(nw, nh);
  }

  /* ── bind ± buttons ── */
  function bind () {
    var d = SE.dom;
    if (d.btnPlus)  d.btnPlus.addEventListener('click',  function (e) { e.stopPropagation(); nudge(16, 7); });
    if (d.btnMinus) d.btnMinus.addEventListener('click', function (e) { e.stopPropagation(); nudge(-16, -7); });
    if (d.btnRestartPos) {
      d.btnRestartPos.addEventListener('click', function (e) {
        e.stopPropagation();
        SE.modules.bottomBar.resetSig();
        SE.modules.overlay.open();
      });
    }
  }

  /* register */
  SE.modules.interact = { reInit: reInit, syncRectData: syncRectData, nudge: nudge, bind: bind };

})(window.SignEngine);
