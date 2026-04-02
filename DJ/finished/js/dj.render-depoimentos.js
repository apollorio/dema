/* ═══════════════════════════════════════════════════════
   RENDER DEPOIMENTOS — Testimonial cards
   Apollo term: depoimento (NEVER comment/review)
   ═══════════════════════════════════════════════════════ */

/**
 * @param {HTMLElement} container - #dj-depoimentos element
 * @param {Array} items - Array of depoimento objects { text, name, role, source, stars }
 */
export function renderDepoimentos(container, items) {
  if (!container || !items?.length) return;

  container.innerHTML = items.map(d => `
    <div class="dj-depoimento">
      <span class="dj-depoimento-source">${d.source}</span>
      <div class="dj-stars">${"\u2605".repeat(d.stars)}${"\u2606".repeat(5 - d.stars)}</div>
      <p>\u201C${d.text}\u201D</p>
      <div class="dj-depoimento-author">
        <div class="dj-depoimento-author-info">
          <span class="dj-depoimento-author-name">${d.name}</span>
          <span class="dj-depoimento-author-role">${d.role}</span>
        </div>
      </div>
    </div>
  `).join("");
}
