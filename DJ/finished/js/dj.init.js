/* ═══════════════════════════════════════════════════════
   DJ INIT — Main entry point, orchestrates all modules
   CPT: dj | REST: apollo/v1/djs | Taxonomy: sound
   ═══════════════════════════════════════════════════════ */

import { initAnimations } from "./dj.animations.js";
import { depoimentosData, gigsData, tracksData } from "./dj.data.js";
import { initFabMenu } from "./dj.fab-menu.js";
import { initMarquee } from "./dj.marquee.js";
import { initNavbar } from "./dj.navbar.js";
import { renderDepoimentos } from "./dj.render-depoimentos.js";
import { renderGigs } from "./dj.render-gigs.js";
import { renderTracks } from "./dj.render-tracks.js";
import { initScrollProgress } from "./dj.scroll-progress.js";

document.addEventListener("DOMContentLoaded", () => {
  /* Copyright year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Render dynamic sections */
  renderGigs(document.getElementById("dj-gigs"), gigsData);
  renderTracks(document.getElementById("dj-tracks"), tracksData);
  renderDepoimentos(document.getElementById("dj-depoimentos"), depoimentosData);

  /* Initialize behaviors */
  initScrollProgress();
  initNavbar();
  initMarquee();
  initFabMenu();

  /* GSAP animations (last — requires DOM to be populated) */
  initAnimations();
});
