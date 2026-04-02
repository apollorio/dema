/* ═══════════════════════════════════════════════════════
   SCROLL PROGRESS — Top bar that fills on scroll
   ═══════════════════════════════════════════════════════ */

export function initScrollProgress() {
  const bar = document.getElementById("dj-progress");
  if (!bar) return;

  const update = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (height > 0) {
      bar.style.width = (scrolled / height) * 100 + "%";
    }
  };

  window.addEventListener("scroll", update, { passive: true });
}
