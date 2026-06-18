/**
 * app-btn.navbar.js — Apollo Navbar v8
 * Renderer: builds DOM from ApolloNavData.
 * Handles: Nav links · Apps grid · Profile (Login form).
 *
 * REMOVED: Messages, Notifications (activities panel removed per requirements)
 * ADDED: Login form with user/pass, forgot password, register button
 *
 * Exposes: window.ApolloNavRenderer = { run }
 * Must load AFTER simulated.navbar.data.js and BEFORE navbar.js.
 */
;(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var data = function () { return window.ApolloNavData || {}; };

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER: Navigation Links (aside #pn-nav + desktop .da)
     ═══════════════════════════════════════════════════════════ */
  function renderNav() {
    var links = data().NAV_LINKS;
    if (!links || !links.length) return;

    var html = '';
    links.forEach(function (lk, i) {
      var num = String(i + 1).padStart(2, '0');
      var cat = lk.category ? '<span class="na-cat"><i>/</i>' + esc(lk.category) + '</span>' : '';
      html +=
        '<li class="ni' + (i === 0 ? ' on' : '') + '">' +
          '<a class="na" href="' + esc(lk.href) + '">' +
            '<span class="na-num">' + num + '</span>' +
            '<i class="' + esc(lk.icon) + '"></i>' +
            '<div class="na-body">' +
              '<div class="na-title">' + esc(lk.label) + '</div>' +
              cat +
            '</div>' +
          '</a>' +
        '</li>';
    });

    var navList = $('#nav-list');
    if (navList) navList.innerHTML = html;

    var deskUl = $('.da ul');
    if (deskUl) deskUl.innerHTML = html;
  }


  /* ═══════════════════════════════════════════════════════════
     RENDER: Apps Grid (#pn-apps)
     ═══════════════════════════════════════════════════════════ */
  function renderApps() {
    var apps = data().APPS;
    if (!apps || !apps.length) return;

    var grid = $('#pn-apps .bento-apps');
    if (!grid) return;

    var html = '';
    apps.forEach(function (app) {
      var newBadge = app.isNew ? '<span class="bi-new">NEW</span>' : '';
      html +=
        '<a class="bi" href="' + esc(app.href) + '">' +
          newBadge +
          '<i class="' + esc(app.icon) + '"></i>' +
          '<span class="bl">' + esc(app.label) + '</span>' +
        '</a>';
    });

    grid.innerHTML = html;
  }


  /* ═══════════════════════════════════════════════════════════
     RENDER: Profile / Login (#pn-pf)
     Renders a login form with user, password, forgot pass, register
     ═══════════════════════════════════════════════════════════ */
  function renderProfile() {
    var pf = data().PROFILE;
    var menu = $('#pn-pf .pm');
    if (!menu) return;

    var html = '';

    // Login form
    html +=
      '<div class="login-form pm-sg">' +
        '<div class="lf-field">' +
          '<input type="text" class="lf-input" placeholder=" " id="lf-user" autocomplete="username">' +
          '<label class="lf-label" for="lf-user">User</label>' +
        '</div>' +
        '<div class="lf-field">' +
          '<input type="password" class="lf-input" placeholder=" " id="lf-pass" autocomplete="current-password">' +
          '<label class="lf-label" for="lf-pass">Password</label>' +
        '</div>' +
        '<button class="lf-btn" type="button" id="lf-submit">Login</button>' +
        '<div class="lf-links">' +
          '<a href="#forgot">Forgot password?</a>' +
          '<a href="#register" class="lf-register">Register</a>' +
        '</div>' +
      '</div>';

    // Dark mode toggle
    html +=
      '<div class="sep pm-sg"></div>' +
      '<div class="tg-r pm-sg">' +
        '<div class="tg-l"><i class="ri-moon-line"></i> Dark Mode</div>' +
        '<label class="tw">' +
          '<input type="checkbox" class="ti" id="dm-toggle">' +
          '<span class="tt"></span>' +
        '</label>' +
      '</div>';

    menu.innerHTML = html;
  }


  /* ═══════════════════════════════════════════════════════════
     RENDER: Content Cards (main area)
     ═══════════════════════════════════════════════════════════ */
  function renderCards() {
    var cards = data().CARDS;
    if (!cards) return;

    var grid = $('.cg');
    if (!grid) return;

    var html = '';
    cards.forEach(function (c) {
      var tagCls = c.isPrimary ? ' pri' : '';
      html +=
        '<div class="cc">' +
          '<span class="tp' + tagCls + '">' + esc(c.tag) + '</span>' +
          '<h3>' + esc(c.title) + '</h3>' +
          '<p>' + esc(c.desc) + '</p>' +
        '</div>';
    });

    grid.innerHTML = html;
  }


  /* ═══════════════════════════════════════════════════════════
     APP SEARCH — filter bento grid items
     ═══════════════════════════════════════════════════════════ */
  function initAppSearch() {
    var input = $('#pn-apps .app-search input');
    if (!input) return;

    input.addEventListener('input', function () {
      var q = input.value.toLowerCase().trim();
      var cells = document.querySelectorAll('#pn-apps .bi');
      cells.forEach(function (cell) {
        var label = cell.querySelector('.bl');
        var text = label ? label.textContent.toLowerCase() : '';
        cell.style.display = text.indexOf(q) >= 0 || !q ? '' : 'none';
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     RUN
     ═══════════════════════════════════════════════════════════ */
  function run() {
    renderNav();
    renderApps();
    renderProfile();
    renderCards();
    initAppSearch();
  }

  window.ApolloNavRenderer = {
    run: run,
    renderNav: renderNav,
    renderApps: renderApps,
    renderProfile: renderProfile
  };
})();
