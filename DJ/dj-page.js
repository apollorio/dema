/* ═══════════════════════════════════════════════════════════════════════
   DJ ARTIST PAGE — dj-page.js
   apollo.rio.br/dj/{slug}
   Depends on: GSAP + ScrollTrigger (loaded before this file)
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  /* ─── Copyright year ─── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════════════════════════
     DATA
     ══════════════════════════════════════════════════════════ */

  const gigsData = [
    { day: "14", month: "OUT", name: "Time Warp Brasil", location: "São Paulo, BR", url: "https://apollo.rio.br/evento/time-warp" },
    { day: "02", month: "NOV", name: "Berghain / Panorama Bar", location: "Berlin, DE", url: "https://apollo.rio.br/evento/berghain" },
    { day: "15", month: "NOV", name: "D-Edge Warehouse", location: "São Paulo, BR", url: "https://apollo.rio.br/evento/d-edge-warehouse" },
    { day: "31", month: "DEZ", name: "Réveillon Cocada Music", location: "Rio de Janeiro, BR", url: "https://apollo.rio.br/evento/reveillon-cocada" },
    { day: "18", month: "JAN", name: "Fabric London", location: "London, UK", url: "https://apollo.rio.br/evento/fabric" },
  ];

  const tracksData = [
    { title: "Synaptic Void", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop", bpm: "132", year: "2024" },
    { title: "Kinetic Protocol", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop", bpm: "135", year: "2024" },
    { title: "Dark Matter", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop", bpm: "130", year: "2023" },
    { title: "Neon Collapse", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=400&auto=format&fit=crop", bpm: "128", year: "2023" },
    { title: "Warehouse Code", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop", bpm: "134", year: "2022" },
    { title: "Acid Meridian", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=400&auto=format&fit=crop", bpm: "138", year: "2022" },
    { title: "Sub:Tropical", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop", bpm: "126", year: "2021" },
    { title: "Phase Drift", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop", bpm: "131", year: "2021" },
    { title: "Rio Rave Tape", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop", bpm: "140", year: "2020" },
    { title: "Modular Dreams", artist: "Marta Supernova", img: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=400&auto=format&fit=crop", bpm: "125", year: "2020" },
  ];

  const depoimentosData = [
    {
      text: "Uma das artistas mais impactantes que já trouxemos para o festival. Energia incomparável.",
      name: "Carlos Motta",
      role: "Diretor artístico · D-Edge",
      source: "Festival",
      stars: 5
    },
    {
      text: "Marta transformou completamente a pista. O set dela no Panorama Bar foi histórico.",
      name: "Lena Müller",
      role: "Booker · Berghain",
      source: "Booking",
      stars: 5
    },
    {
      text: "A produção dela tem uma profundidade rara. Cada track conta uma história única.",
      name: "DJ Renato Ratier",
      role: "Produtor · Warung",
      source: "Collab",
      stars: 5
    },
    {
      text: "Profissionalismo impecável do briefing ao after. Sempre voltamos a trabalhar juntos.",
      name: "Ana Luiza Prates",
      role: "Produção · Cocada Music",
      source: "Produção",
      stars: 5
    },
    {
      text: "Redefining the architecture of modern techno. Uma das vozes mais originais da cena.",
      name: "Resident Advisor",
      role: "Publicação",
      source: "Press",
      stars: 5
    },
    {
      text: "O som da Marta é Rio de Janeiro traduzido em frequências. Único e inconfundível.",
      name: "Felipe Vassão",
      role: "Jornalista · Noize",
      source: "Press",
      stars: 4
    },
  ];


  /* ══════════════════════════════════════════════════════════
     RENDER: GIG ROWS — ultra-thin, one line each
     ══════════════════════════════════════════════════════════ */
  const gigsEl = document.getElementById("dj-gigs");
  if (gigsEl) {
    gigsEl.innerHTML = gigsData.map(g => `
      <a href="${g.url}" target="_blank" class="dj-gig-row">
        <div class="dj-gig-date">
          <span class="dj-gig-date-day">${g.day}</span>
          <span class="dj-gig-date-month">${g.month}</span>
        </div>
        <div class="dj-gig-info">
          <h4>${g.name}</h4>
          <div class="dj-gig-location">
            <i class="ri-map-pin-2-line"></i> ${g.location}
          </div>
        </div>
        <span class="dj-gig-btn">
          Ver evento <i class="ri-arrow-right-up-line"></i>
        </span>
      </a>
    `).join("");
  }


  /* ══════════════════════════════════════════════════════════
     RENDER: SPOTIFY-STYLE TRACK CARDS (small, horizontal scroll)
     ══════════════════════════════════════════════════════════ */
  const tracksEl = document.getElementById("dj-tracks");
  if (tracksEl) {
    tracksEl.innerHTML = tracksData.map(t => `
      <div class="nh-track-card">
        <div class="nh-track-artwork">
          <img src="${t.img}" alt="${t.title}" loading="lazy">
          <div class="nh-track-play-overlay">
            <button class="nh-track-play-btn" aria-label="Play ${t.title}">
              <i class="ri-play-fill"></i>
            </button>
          </div>
        </div>
        <div class="nh-track-info">
          <h4>${t.title}</h4>
          <p class="nh-track-artist">${t.artist}</p>
          <div class="nh-track-meta">
            <span><i class="ri-speed-line"></i> ${t.bpm}</span>
            <span>${t.year}</span>
          </div>
        </div>
      </div>
    `).join("");
  }


  /* ══════════════════════════════════════════════════════════
     RENDER: DEPOIMENTOS
     ══════════════════════════════════════════════════════════ */
  const depoEl = document.getElementById("dj-depoimentos");
  if (depoEl) {
    depoEl.innerHTML = depoimentosData.map(d => `
      <div class="dj-depoimento">
        <span class="dj-depoimento-source">${d.source}</span>
        <div class="dj-stars">${"★".repeat(d.stars)}${"☆".repeat(5 - d.stars)}</div>
        <p>"${d.text}"</p>
        <div class="dj-depoimento-author">
          <div class="dj-depoimento-author-info">
            <span class="dj-depoimento-author-name">${d.name}</span>
            <span class="dj-depoimento-author-role">${d.role}</span>
          </div>
        </div>
      </div>
    `).join("");
  }


  /* ══════════════════════════════════════════════════════════
     SCROLL PROGRESS BAR
     ══════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById("dj-progress");
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && height > 0) {
      progressBar.style.width = (scrolled / height) * 100 + "%";
    }
  }, { passive: true });


  /* ══════════════════════════════════════════════════════════
     NAVBAR: add .scrolled class
     ══════════════════════════════════════════════════════════ */
  const nav = document.getElementById("dj-nav");
  window.addEventListener("scroll", () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });


  /* ══════════════════════════════════════════════════════════
     MARQUEE: CSS-only infinite scroll (no GSAP needed)
     ══════════════════════════════════════════════════════════ */
  const marqueeTrack = document.getElementById("dj-marquee");
  if (marqueeTrack) {
    // Measure one content block width and set animation
    requestAnimationFrame(() => {
      const contentBlock = marqueeTrack.querySelector(".dj-marquee-content");
      if (!contentBlock) return;
      const w = contentBlock.offsetWidth;

      // Inject keyframes dynamically based on actual width
      const style = document.createElement("style");
      style.textContent = `
        @keyframes djMarqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${w}px); }
        }
      `;
      document.head.appendChild(style);
      marqueeTrack.style.animation = `djMarqueeScroll ${w / 50}s linear infinite`;
    });
  }


  /* ══════════════════════════════════════════════════════════
     GSAP ANIMATIONS
     ══════════════════════════════════════════════════════════ */
  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Hero elements — stagger fade-in
    gsap.to(".dj-hero .ai", {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: "power3.out",
      delay: 0.3
    });

    // Hero background parallax zoom
    gsap.to(".dj-hero-bg img", {
      scale: 1,
      duration: 2.5,
      ease: "power2.out"
    });

    // Gig rows reveal
    gsap.from(".dj-gig-row", {
      scrollTrigger: { trigger: "#dj-gigs", start: "top 80%" },
      x: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out"
    });

    // Track cards slide in
    gsap.from(".nh-track-card", {
      scrollTrigger: { trigger: "#dj-tracks", start: "top 80%" },
      x: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out"
    });

    // Timeline nodes
    gsap.from(".dj-timeline-node", {
      scrollTrigger: { trigger: ".dj-timeline", start: "top 75%" },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: "power3.out"
    });

    // Gallery stagger
    gsap.from(".dj-gallery-item", {
      scrollTrigger: { trigger: ".dj-gallery-grid", start: "top 75%" },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });

    // Depoimentos
    gsap.from(".dj-depoimento", {
      scrollTrigger: { trigger: "#dj-depoimentos", start: "top 80%" },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Metrics bar
    gsap.from(".dj-metrics-grid > div", {
      scrollTrigger: { trigger: ".dj-metrics", start: "top 85%" },
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out"
    });
  }

});