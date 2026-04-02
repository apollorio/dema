/* ═══════════════════════════════════════════════════════
   RENDER GIGS — Ultra-thin agenda rows
   REST: GET apollo/v1/djs/{id}/events
   ═══════════════════════════════════════════════════════ */

/**
 * @param {HTMLElement} container - #dj-gigs element
 * @param {Array} gigs - Array of gig objects { day, month, name, location, url }
 */
export function renderGigs(container, gigs) {
  if (!container || !gigs?.length) return;

  container.innerHTML = gigs.map(g => `
    <a href="${encodeURI(g.url)}" target="_blank" rel="noopener" class="dj-gig-row">
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
