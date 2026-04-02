/* ═══════════════════════════════════════════════════════════
   sign-overlay.js — Overlay Card (GSAP)
   Open / dismiss the instruction overlay with spring anim.
   Depends: sign-config.js (SignEngine)
   ═══════════════════════════════════════════════════════════ */
;(function (SE) {
  'use strict';

  function dismissOverlay (cb) {
    var d = SE.dom;
    if (typeof gsap !== 'undefined') {
      var tl = gsap.timeline({
        onComplete: function () { d.overlay.style.display = 'none'; if (cb) cb(); }
      });
      tl.to(d.ovCard, { scale: .86, opacity: 0, duration: .2, ease: 'power2.in' })
        .to(d.ovBg,   { opacity: 0, duration: .28 }, 0.06)
        .to(d.overlay, { opacity: 0, duration: .14 }, 0.24);
    } else {
      d.overlay.style.display = 'none';
      if (cb) cb();
    }
  }

  function openOverlay () {
    var d = SE.dom;
    d.overlay.style.cssText = 'display:flex; opacity:1;';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(d.ovCard, { scale: .82, opacity: 0 },
        { scale: 1, opacity: 1, duration: .34, ease: 'back.out(2.4)', overwrite: 'auto' });
      gsap.fromTo(d.ovBg, { opacity: 0 },
        { opacity: 1, duration: .22, overwrite: 'auto' });
    }
  }

  /* register */
  SE.modules.overlay = { open: openOverlay, dismiss: dismissOverlay };

})(window.SignEngine);
