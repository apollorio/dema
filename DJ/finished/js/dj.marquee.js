/* ═══════════════════════════════════════════════════════
   MARQUEE — CSS-only infinite horizontal scroll
   Measures content width, injects dynamic keyframes
   ═══════════════════════════════════════════════════════ */

export function initMarquee() {
  const track = document.getElementById("dj-marquee");
  if (!track) return;

  requestAnimationFrame(() => {
    const block = track.querySelector(".dj-marquee-content");
    if (!block) return;

    const w = block.offsetWidth;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes djMarqueeScroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-${w}px); }
      }
    `;
    document.head.appendChild(style);
    track.style.animation = `djMarqueeScroll ${w / 50}s linear infinite`;
  });
}
