/* ═══════════════════════════════════════════════════════
   RENDER TRACKS — Spotify-style horizontal card grid
   Taxonomy: sound (slug: som)
   Meta: _dj_soundcloud, _dj_spotify, _dj_beatport, etc.
   ═══════════════════════════════════════════════════════ */

/**
 * @param {HTMLElement} container - #dj-tracks element
 * @param {Array} tracks - Array of track objects { title, artist, img, bpm, year }
 */
export function renderTracks(container, tracks) {
  if (!container || !tracks?.length) return;

  container.innerHTML = tracks.map(t => `
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
