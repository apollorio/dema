/* ═══════════════════════════════════════════════════════
   NAVBAR — Adds .scrolled class on scroll
   ═══════════════════════════════════════════════════════ */

export function initNavbar() {
  const nav = document.getElementById("dj-nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}
