<?php
/**
 * navbar.php — Apollo Navbar v8 · Reusable PHP Include
 *
 * USAGE: <?php include 'navbar.php'; ?>
 * Place this in your <body> tag of any Apollo page.
 *
 * REQUIREMENTS:
 * - CDN core.js loaded in <head>: <script src="https://cdn.apollo.rio.br/v1.0.0/core.js" fetchpriority="high"></script>
 * - navbar.css + app-btn.navbar.css loaded in <head>
 * - simulated.navbar.data.js + app-btn.navbar.js + navbar.js loaded before </body>
 *
 * PANELS (3 total — all start CLOSED):
 * 1. Nav (#pn-nav) — left slide, 290px desktop, burger #bm
 * 2. Apps (#pn-apps) — drop down, min(568px,92vw) desktop, button #ic-apps
 * 3. Profile/Login (#pn-pf) — right slide, 290px desktop, button #ic-pf
 *
 * TOPBAR: No background, no border, no backdrop-filter
 */

$navbar_base = isset($navbar_base_url) ? rtrim($navbar_base_url, '/') : 'https://lib.apollo.rio.br/layout/navbar';
?>

<!-- PRELOADER -->
<div id="preloader">
  <div class="preloader-bar"></div>
  <span class="preloader-label">apollo::rio</span>
</div>

<div class="ov" id="ov" aria-hidden="true"></div>

<!-- PANEL 1: NAV — Left slide (290px desktop | 100vw mobile) -->
<nav class="pn pn-l" id="pn-nav" aria-label="Navegação" role="dialog" aria-modal="true">
  <div class="ph">
    <span class="pt">Navegação</span>
    <button class="px" data-x aria-label="Fechar"><i class="ri-close-line"></i></button>
  </div>
  <div class="pb">
    <ul id="nav-list"></ul>
  </div>
</nav>

<!-- PANEL 2: APPS — Drop down (min(568px,92vw) desktop | 100vw mobile) -->
<div class="pn pn-d pp" id="pn-apps" role="dialog" aria-modal="true" aria-label="Aplicativos">
  <div class="pn-in">
    <div class="pb">
      <button class="px" data-x aria-label="Fechar"><i class="ri-arrow-up-line"></i></button>
      <span class="pt">Aplicativos</span>
      <div class="bento-apps" id="bento-apps"></div>
    </div>
  </div>
</div>

<!-- PANEL 3: PROFILE / LOGIN — Right slide (290px desktop | 100vw mobile) -->
<div class="pn pn-r" id="pn-pf" role="dialog" aria-modal="true" aria-label="Login">
  <div class="pb">
    <span class="pt">Login</span>
    <button class="px" data-x aria-label="Fechar"><i class="ri-arrow-right-line"></i></button>
    <div class="pm" id="pf-menu"></div>
  </div>
</div>

<!-- TOPBAR — NO background, NO border, NO backdrop-filter -->
<header class="tb" role="banner">
  <div class="tl">
    <a href="#" class="ab" id="bm" data-p="pn-nav" aria-label="Abrir navegação" aria-expanded="false" role="button">
      <b></b>
    </a>
    <div class="brand" aria-label="Apollo Rio">
      <i class="apollo" aria-hidden="true"></i>
      <span>apollo::rio</span>
    </div>
  </div>
  <div class="tr">
    <span class="clk" id="clk" aria-live="off">--:--</span>

    <button class="ic ic-svg" id="ic-apps" data-p="pn-apps" aria-label="Aplicativos" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="19" height="19">
        <path d="M21 17C21 19.2091 19.2091 21 17 21C14.7909 21 13 19.2091 13 17C13 14.7909 14.7909 13 17 13C19.2091 13 21 14.7909 21 17ZM11 7C11 9.20914 9.20914 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3C9.20914 3 11 4.79086 11 7ZM21 7C21 9.20914 19.2091 11 17 11C16.2584 11 15.5634 10.7972 14.9678 10.4453L10.4453 14.9678C10.7972 15.5634 11 16.2584 11 17C11 19.2091 9.20914 21 7 21C4.79086 21 3 19.2091 3 17C3 14.7909 4.79086 13 7 13C7.74116 13 8.43593 13.2022 9.03125 13.5537L13.5537 9.03125C13.2022 8.43593 13 7.74116 13 7C13 4.79086 14.7909 3 17 3C19.2091 3 21 4.79086 21 7Z"></path>
      </svg>
    </button>

    <button class="ic ic-svg" id="ic-pf" data-p="pn-pf" aria-label="Login" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="19" height="19">
        <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
      </svg>
    </button>
  </div>
</header>
