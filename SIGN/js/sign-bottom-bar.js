/* ═══════════════════════════════════════════════════════════
   sign-bottom-bar.js — Collapsible Bottom Bar & Reset
   Toggle collapsed state, reset all signing state.
   Depends: sign-config.js, sign-placer.js (lazy),
            sign-scaler.js (lazy)
   ═══════════════════════════════════════════════════════════ */
;(function (SE) {
  'use strict';

  var st = SE.state;

  function setSbHeight () {
    var d = SE.dom;
    if (!st.sbOpen) {
      d.sbBottom.classList.add('collapsed');
      d.sbToggle.classList.add('collapsed-indicator');
    } else {
      d.sbBottom.classList.remove('collapsed');
      d.sbToggle.classList.remove('collapsed-indicator');
    }
  }

  function resetSig () {
    var d = SE.dom;
    if (st.interactInst) { st.interactInst.unset(); st.interactInst = null; }
    d.signRect.style.display = 'none';
    d.signRect.classList.remove('confirmed');
    d.rectLbl.classList.remove('ok'); d.rectDim.classList.remove('ok');
    d.ghostSvg.innerHTML = '';
    d.touchOv.classList.remove('active');
    st.STATUS = 'IDLE'; st.P1 = null; st.rectPlaced = false; st.docZoom = 1;
    d.pdfC.style.transform = '';
    if (SE.modules.scaler) SE.modules.scaler.scale();
    d.btnPos.classList.remove('placed', 'placing');
    d.btnPosLbl.textContent = 'Posicionar';
    if (d.btnResetSig) d.btnResetSig.classList.remove('visible');
    var h = document.getElementById('place-hint');
    if (h) h.style.display = 'none';
    if (!st.sbOpen) { st.sbOpen = true; setSbHeight(); }
    SE.modules.placer.checkState();
  }

  function bind () {
    var d = SE.dom;
    if (d.sbToggle) {
      d.sbToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        st.sbOpen = !st.sbOpen;
        setSbHeight();
      });
    }
    if (d.btnResetSig) d.btnResetSig.addEventListener('click', resetSig);
  }

  /* register */
  SE.modules.bottomBar = { setSbHeight: setSbHeight, resetSig: resetSig, bind: bind };

})(window.SignEngine);
