/* ═══════════════════════════════════════════════════════════
   sign-boot.js — Bootstrap / Entry Point
   Wires all SignEngine modules on DOMContentLoaded.
   Load LAST, after every other sign-*.js module.
   Depends: sign-config, sign-overlay, sign-svg-ghosts,
            sign-placer, sign-interact, sign-bottom-bar,
            sign-stamp, sign-submit, sign-scaler, sign-confetti
   ═══════════════════════════════════════════════════════════ */
;(function (SE) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* 1 — cache all DOM refs */
    SE.cacheDom();

    /* 2 — bind every module */
    SE.modules.placer.bind();
    SE.modules.interact.bind();
    SE.modules.bottomBar.bind();
    SE.modules.submit.bind();
    SE.modules.scaler.bind();

    /* 3 — wire overlay buttons → placer */
    var btnIniciar = document.getElementById('btn-iniciar');
    var btnAuto    = document.getElementById('btn-auto');
    if (btnIniciar) btnIniciar.addEventListener('click', function () {
      SE.modules.overlay.dismiss(SE.modules.placer.startManual);
    });
    if (btnAuto) btnAuto.addEventListener('click', function () {
      SE.modules.overlay.dismiss(SE.modules.placer.autoPlace);
    });

    /* 4 — wire position button → overlay */
    SE.dom.btnPos.addEventListener('click', function () {
      if (!SE.state.rectPlaced) SE.modules.overlay.open();
    });
  });

})(window.SignEngine);
