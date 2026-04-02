/* ═══════════════════════════════════════════════════════
   FAB MENU — Mobile-first sheet open/close + GSAP stagger
   ═══════════════════════════════════════════════════════ */

export function initFabMenu() {
  const fab   = document.getElementById("nhMenuFab");
  const sheet = document.getElementById("nhMenuSheet");
  if (!fab || !sheet) return;

  const items = sheet.querySelectorAll(".nh-sheet-item");

  function open() {
    sheet.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true");
    if (typeof gsap !== "undefined") {
      gsap.fromTo(items,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.3, ease: "power2.out" }
      );
    }
  }

  function close() {
    sheet.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
  }

  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    sheet.classList.contains("is-open") ? close() : open();
  });

  document.addEventListener("click", (e) => {
    if (!fab.contains(e.target) && !sheet.contains(e.target)) close();
  });

  items.forEach((item) => {
    item.addEventListener("click", close);
  });
}
