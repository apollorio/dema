/* ═══════════════════════════════════════════════════════
   GSAP ANIMATIONS — ScrollTrigger reveals
   Depends on: GSAP + ScrollTrigger (from Apollo CDN)
   ═══════════════════════════════════════════════════════ */

export function initAnimations() {
  if (typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero elements — stagger fade-in ── */
  gsap.to(".dj-hero .ai", {
    opacity: 1, y: 0,
    duration: 0.9, stagger: 0.18,
    ease: "power3.out", delay: 0.3
  });

  /* ── Hero background parallax zoom ── */
  gsap.to(".dj-hero-bg img", {
    scale: 1, duration: 2.5, ease: "power2.out"
  });

  /* ── Hero BG text parallax ── */
  gsap.to("#bgText", {
    x: -200, ease: "none",
    scrollTrigger: { trigger: ".dj-hero", start: "top top", end: "bottom top", scrub: 1 }
  });

  /* ── Gig rows reveal ── */
  gsap.from(".dj-gig-row", {
    scrollTrigger: { trigger: "#dj-gigs", start: "top 80%" },
    x: -20, opacity: 0,
    duration: 0.5, stagger: 0.08, ease: "power2.out"
  });

  /* ── Track cards slide in ── */
  gsap.from(".nh-track-card", {
    scrollTrigger: { trigger: "#dj-tracks", start: "top 80%" },
    x: 40, opacity: 0,
    duration: 0.6, stagger: 0.06, ease: "power2.out"
  });

  /* ── Timeline nodes ── */
  gsap.from(".dj-timeline-node", {
    scrollTrigger: { trigger: ".dj-timeline", start: "top 75%" },
    y: 30, opacity: 0,
    duration: 0.7, stagger: 0.2, ease: "power3.out"
  });

  /* ── Gallery stagger ── */
  gsap.from(".dj-gallery-item", {
    scrollTrigger: { trigger: ".dj-gallery-grid", start: "top 75%" },
    y: 40, opacity: 0,
    duration: 0.8, stagger: 0.15, ease: "power2.out"
  });

  /* ── Depoimentos ── */
  gsap.from(".dj-depoimento", {
    scrollTrigger: { trigger: "#dj-depoimentos", start: "top 80%" },
    y: 30, opacity: 0,
    duration: 0.6, stagger: 0.1, ease: "power2.out"
  });

  /* ── Metrics bar ── */
  gsap.from(".dj-metrics-grid > div", {
    scrollTrigger: { trigger: ".dj-metrics", start: "top 85%" },
    y: 20, opacity: 0,
    duration: 0.6, stagger: 0.08, ease: "power2.out"
  });
}
