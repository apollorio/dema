/* ═══════════════════════════════════════════════════════════
   sign-placer.js — Manual & Auto Placement
   Two-point touch/mouse placement and auto-place shortcut.
   Depends: sign-config.js, sign-overlay.js,
            sign-svg-ghosts.js, sign-interact.js (lazy)
   ═══════════════════════════════════════════════════════════ */
;(function (SE) {
  'use strict';

  var st = SE.state;
  var ghosts, interactMod, bottomBar;

  function late () {
    ghosts     = SE.modules.ghosts;
    interactMod = SE.modules.interact;
    bottomBar  = SE.modules.bottomBar;
  }

  /* ── coord helper ── */
  function getPt (e) {
    var d = SE.dom, r = d.pdfC.getBoundingClientRect();
    var scaleX = r.width  / (d.pdfC.offsetWidth  || 794);
    var scaleY = r.height / (d.pdfC.offsetHeight || 1123);
    var cx = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    var cy = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return {
      x: Math.max(0, Math.min((cx - r.left) / scaleX, d.pdfC.offsetWidth)),
      y: Math.max(0, Math.min((cy - r.top)  / scaleY, d.pdfC.offsetHeight))
    };
  }

  /* ── build rect from two corner points ── */
  function buildRect (p1, p2) {
    var cw = SE.dom.pdfC.offsetWidth, ch = SE.dom.pdfC.offsetHeight;
    var x = Math.min(p1.x, p2.x), y = Math.min(p1.y, p2.y);
    var w = Math.max(Math.abs(p2.x - p1.x), SE.MIN_W);
    var h = Math.max(Math.abs(p2.y - p1.y), SE.MIN_H);
    return { x: x, y: y, w: Math.min(w, cw - x), h: Math.min(h, ch - y) };
  }

  /* ── commit rect to DOM ── */
  function commitRect (r) {
    var d = SE.dom;
    st.currentRect = { x: r.x, y: r.y, w: r.w, h: r.h };
    Object.assign(d.signRect.style, {
      display: 'block', left: r.x + 'px', top: r.y + 'px',
      width: r.w + 'px', height: r.h + 'px', transform: 'none'
    });
    d.signRect.dataset.x = 0;
    d.signRect.dataset.y = 0;
    updateDim(r.w, r.h);
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(d.signRect,
        { opacity: 0, scale: .82 },
        { opacity: 1, scale: 1, duration: .28, ease: 'back.out(2)', overwrite: 'auto', clearProps: 'transform' });
    }
  }

  function updateDim (w, h) {
    if (SE.dom.rectDim) SE.dom.rectDim.textContent = Math.round(w) + '\u00d7' + Math.round(h) + 'px';
  }

  /* ── mark rect as placed ── */
  function markPlaced () {
    var d = SE.dom;
    st.rectPlaced = true;
    d.btnPos.classList.remove('placing'); d.btnPos.classList.add('placed');
    d.btnPosLbl.textContent = '\u2726 Posicionado';
    if (d.rectDim) d.rectDim.textContent = 'arraste \u00b7 resize';
    if (d.btnResetSig) d.btnResetSig.classList.add('visible');
    checkState();
  }

  function checkState () {
    SE.dom.btnSign.disabled = !(SE.dom.chkAg.checked && st.rectPlaced);
  }

  /* ── start manual 2-point flow ── */
  function startManual () {
    late();
    var d = SE.dom;
    st.STATUS = 'IDLE'; st.P1 = null;
    d.ghostSvg.innerHTML = '';
    d.signRect.style.display = 'none';
    d.touchOv.classList.add('active');
    d.btnPos.classList.remove('placed'); d.btnPos.classList.add('placing');
    d.btnPosLbl.textContent = '1\u00ba ponto\u2026';
    if (d.btnResetSig) d.btnResetSig.classList.add('visible');
    var h = document.getElementById('place-hint');
    if (h) { h.style.display = 'block'; h.innerHTML = 'Toque no 1\u00ba ponto<br/><span style="font-size:9px;opacity:.6;">depois no 2\u00ba para definir a \u00e1rea</span>'; }
    if (st.sbOpen) { st.sbOpen = false; if (bottomBar) bottomBar.setSbHeight(); }
  }

  /* ── auto-place at bottom-right ── */
  function autoPlace () {
    late();
    var cw = SE.dom.pdfC.offsetWidth, ch = SE.dom.pdfC.offsetHeight;
    var w = Math.min(380, cw * .48), h = SE.MIN_H * 2;
    commitRect({ x: cw - w - 80, y: ch - h - 90, w: w, h: h });
    st.STATUS = 'DONE';
    interactMod.reInit();
    markPlaced();
  }

  /* ── tap handler (touch + click) ── */
  function onTap (e) {
    late();
    var d = SE.dom;
    if (!d.touchOv.classList.contains('active')) return;
    if (e.cancelable) e.preventDefault();
    var h = document.getElementById('place-hint');
    var p = getPt(e);

    if (st.STATUS === 'IDLE') {
      st.P1 = p; st.STATUS = 'V1';
      ghosts.drawP1(p);
      d.btnPosLbl.textContent = '2\u00ba ponto\u2026';
    } else if (st.STATUS === 'V1') {
      if (h) h.style.display = 'none';
      var dist = Math.hypot(p.x - st.P1.x, p.y - st.P1.y);
      var P2   = dist < 20 ? { x: st.P1.x + SE.MIN_W, y: st.P1.y + SE.MIN_H } : p;
      d.ghostSvg.innerHTML = '';
      commitRect(buildRect(st.P1, P2));
      st.STATUS = 'DONE'; d.touchOv.classList.remove('active');
      interactMod.reInit(); markPlaced();
      if (!st.sbOpen) { st.sbOpen = true; if (bottomBar) bottomBar.setSbHeight(); }
    }
  }

  /* ── bind events ── */
  function bind () {
    late();
    var d = SE.dom;
    d.touchOv.addEventListener('touchstart', onTap, { passive: false });
    d.touchOv.addEventListener('click', onTap);
    d.touchOv.addEventListener('touchmove', function (e) {
      if (st.STATUS !== 'V1' || !st.P1) return;
      if (e.cancelable) e.preventDefault();
      ghosts.drawLive(st.P1, getPt(e));
    }, { passive: false });
    d.touchOv.addEventListener('mousemove', function (e) {
      if (st.STATUS === 'IDLE' && d.touchOv.classList.contains('active')) { ghosts.drawCross(getPt(e)); return; }
      if (st.STATUS === 'V1' && st.P1) ghosts.drawLive(st.P1, getPt(e));
    });
    d.touchOv.addEventListener('mouseleave', function () { if (st.STATUS === 'IDLE') d.ghostSvg.innerHTML = ''; });
    d.chkAg.addEventListener('change', checkState);
  }

  /* register */
  SE.modules.placer = {
    bind: bind, startManual: startManual, autoPlace: autoPlace,
    commitRect: commitRect, updateDim: updateDim, markPlaced: markPlaced,
    checkState: checkState, getPt: getPt, buildRect: buildRect
  };

})(window.SignEngine);
