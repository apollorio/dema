/* ═══════════════════════════════════════════════════════════
   sign-config.js — SignEngine Core
   Shared namespace, constants, DOM refs, mutable state.
   MUST load first — every other module reads from SignEngine.
   ═══════════════════════════════════════════════════════════ */
;(function (root) {
  'use strict';

  /* ── constants ── */
  var STAMP_NW  = 380;           /* natural stamp width (px, by design) */
  var STAMP_MIN = 0.70;          /* 70 % floor */
  var MIN_W     = Math.round(STAMP_NW * STAMP_MIN); /* 266 */
  var MIN_H     = 112;           /* updated after first stamp render    */

  /* ── mutable state ── */
  var state = {
    STATUS      : 'IDLE',        /* IDLE | V1 | DONE */
    P1          : null,
    currentRect : { x: 0, y: 0, w: MIN_W, h: MIN_H },
    rectPlaced  : false,
    interactInst: null,
    docZoom     : 1,
    stampNatH   : 0,
    sbOpen      : true
  };

  /* ── DOM cache (populated on DOMContentLoaded) ── */
  var dom = {};

  function cacheDom () {
    var id = document.getElementById.bind(document);
    dom.pdfC      = id('pdf-p2');
    dom.overlay   = id('sign-overlay');
    dom.ovBg      = id('ov-bg');
    dom.ovCard    = id('ov-card');
    dom.touchOv   = id('touch-ov');
    dom.ghostSvg  = id('ghost-svg');
    dom.signRect  = id('sign-rect');
    dom.rectLbl   = id('rect-lbl');
    dom.rectDim   = id('rect-dim');
    dom.btnPos    = id('btn-pos');
    dom.btnPosLbl = id('btn-pos-lbl');
    dom.chkAg     = id('chk-agree');
    dom.btnSign   = id('btn-assinar');
    dom.minWarn   = id('min-warn');
    dom.sbBottom  = id('sign-bottom');
    dom.sbToggle  = id('sbottom-toggle');
    dom.btnResetSig   = id('btn-reset-sig');
    dom.btnPlus       = id('btn-plus');
    dom.btnMinus      = id('btn-minus');
    dom.btnRestartPos = id('btn-restart-pos');
    dom.btnDownload   = id('btn-download');
  }

  /* ── public API ── */
  root.SignEngine = {
    /* constants */
    STAMP_NW  : STAMP_NW,
    STAMP_MIN : STAMP_MIN,
    MIN_W     : MIN_W,
    MIN_H     : MIN_H,
    /* runtime */
    state     : state,
    dom       : dom,
    cacheDom  : cacheDom,
    /* module registry — other modules register here */
    modules   : {}
  };

})(window);
