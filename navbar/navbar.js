/**
 * navbar.js — Apollo Navbar v8 · Core Engine
 * Boots: Panel system, Overlay, Clock, BurgerArrow, DarkMode
 *
 * Panels: 3 panels (Nav, Apps, Profile/Login)
 * - Nav (#pn-nav) — left slide, burger #bm
 * - Apps (#pn-apps) — drop down, button #ic-apps
 * - Profile (#pn-pf) — right slide, button #ic-pf
 *
 * ALL panels start CLOSED. Only one open at a time.
 */
;(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return document.querySelectorAll(s); };

  /* ═══════════════════════════════════════════════════════════
     PANEL SYSTEM
     ═══════════════════════════════════════════════════════════ */
  var activePanel = null;
  var ov = $('#ov');

  function openPanel(id) {
    var pn = $('#' + id);
    if (!pn) return;

    if (activePanel && activePanel !== id) {
      closePanel(activePanel);
    }

    pn.classList.add('on');
    if (ov) ov.classList.add('on');
    document.body.classList.add('lk');

    var trigger = document.querySelector('[data-p="' + id + '"]');
    if (trigger) {
      trigger.classList.add('on');
      trigger.setAttribute('aria-expanded', 'true');
    }

    activePanel = id;
  }

  function closePanel(id) {
    if (!id) id = activePanel;
    if (!id) return;

    var pn = $('#' + id);
    if (pn) pn.classList.remove('on');
    if (ov) ov.classList.remove('on');
    document.body.classList.remove('lk');

    var trigger = document.querySelector('[data-p="' + id + '"]');
    if (trigger) {
      trigger.classList.remove('on');
      trigger.setAttribute('aria-expanded', 'false');
    }

    activePanel = null;
  }

  function togglePanel(id) {
    if (activePanel === id) {
      closePanel(id);
    } else {
      openPanel(id);
    }
  }

  /* ── Bind panel triggers ── */
  function initPanels() {
    var triggers = $$('[data-p]');
    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        togglePanel(el.getAttribute('data-p'));
      });
    });

    // Close buttons inside panels
    $$('.px[data-x]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closePanel();
      });
    });

    // Overlay click closes active panel
    if (ov) {
      ov.addEventListener('click', function () {
        closePanel();
      });
    }

    // Escape key closes active panel
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activePanel) {
        closePanel();
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     CLOCK
     ═══════════════════════════════════════════════════════════ */
  function initClock() {
    var clk = $('#clk');
    if (!clk) return;

    function tick() {
      var now = new Date();
      var h = String(now.getHours()).padStart(2, '0');
      var m = String(now.getMinutes()).padStart(2, '0');
      clk.textContent = h + ':' + m;
    }

    tick();
    setInterval(tick, 10000);
  }

  /* ═══════════════════════════════════════════════════════════
     DARK MODE TOGGLE
     ═══════════════════════════════════════════════════════════ */
  function initDarkMode() {
    var toggle = $('#dm-toggle');
    if (!toggle) return;

    var isDark = document.documentElement.classList.contains('dark-mode');
    toggle.checked = isDark;

    toggle.addEventListener('change', function () {
      document.documentElement.classList.toggle('dark-mode', toggle.checked);
      try {
        localStorage.setItem('apollo-dm', toggle.checked ? '1' : '0');
      } catch (e) {}
    });
  }

  /* ═══════════════════════════════════════════════════════════
     PRELOADER
     ═══════════════════════════════════════════════════════════ */
  function initPreloader() {
    var pre = $('#preloader');
    if (!pre) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        pre.classList.add('out');
        setTimeout(function () {
          pre.style.display = 'none';
        }, 600);
      }, 400);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════════ */
  function boot() {
    if (window.ApolloNavRenderer && window.ApolloNavRenderer.run) {
      window.ApolloNavRenderer.run();
    }
    initPanels();
    initClock();
    initDarkMode();
    initPreloader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.ApolloNavbar = {
    open: openPanel,
    close: closePanel,
    toggle: togglePanel
  };
})();
