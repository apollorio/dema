/**
 * sidebar-tree.js — Apollo DJ Sidebar Tree v1
 * Sections: COMPUTADOR, PLAYLISTS, PENDRIVE
 * Single active selection across all sections
 * USB export toggle per playlist
 */
;(function () {
  'use strict';

  var $ = function (s, p) { return (p || document).querySelector(s); };
  var $$ = function (s, p) { return (p || document).querySelectorAll(s); };

  var state = {
    activeItem: null,
    usbExport: {},
    visibility: {},
    pendrive: null
  };

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  /* ═══════════════════════════════════════════════════════════
     DATA
     ═══════════════════════════════════════════════════════════ */
  var DATA = {
    computador: [
      { id: 'downloads',  label: 'Downloads',                icon: 'ri-download-2-line' },
      { id: 'musicas',    label: 'Músicas',                   icon: 'ri-music-2-fill' },
      { id: 'coletanea',  label: 'Todas as faixas (Coletânea)', icon: 'ri-folder-music-line' }
    ],
    userFolders: [
      { id: 'folder-techno',  label: 'Techno Sets' },
      { id: 'folder-house',   label: 'Deep House' }
    ],
    playlists: [
      { id: 'pl-coletanea', label: 'Coletânea',  icon: 'ri-folder-music-line', type: 'special' },
      { id: 'pl-favoritas', label: 'Favoritas',   icon: 'ri-star-line',         type: 'special' }
    ],
    groups: [
      {
        id: 'grp-sets',
        label: 'Sets Junho',
        playlists: [
          { id: 'pl-warm',    label: 'Warm Up' },
          { id: 'pl-peak',    label: 'Peak Time' },
          { id: 'pl-closing', label: 'Closing' }
        ]
      }
    ],
    pendrives: [
      { id: 'usb-sandisk', label: 'SanDisk 64GB (E:)' },
      { id: 'usb-kingston', label: 'Kingston 32GB (F:)' }
    ]
  };

  // Init USB export state — all active by default
  DATA.playlists.forEach(function (p) { state.usbExport[p.id] = true; });
  DATA.groups.forEach(function (g) {
    g.playlists.forEach(function (p) { state.usbExport[p.id] = true; });
  });

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  function render(container) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'sb-tree';

    container.appendChild(renderComputador());
    container.appendChild(createSep());
    container.appendChild(renderPlaylists());
    container.appendChild(createSep());
    container.appendChild(renderPendrive());

    bindEvents(container);
  }

  function createSep() {
    var el = document.createElement('div');
    el.className = 'sb-sep';
    return el;
  }

  /* ── COMPUTADOR ── */
  function renderComputador() {
    var sec = document.createElement('div');
    sec.className = 'sb-section';
    sec.dataset.section = 'computador';

    sec.innerHTML =
      '<div class="sb-section-hdr">' +
        '<span class="sb-section-label">Computador</span>' +
        '<div class="sb-section-actions">' +
          '<button class="sec-vis-toggle" aria-label="Esconder tudo"><i class="ri-eye-line"></i></button>' +
          '<button class="sec-add-folder" aria-label="Adicionar pasta"><i class="ri-add-line"></i></button>' +
        '</div>' +
      '</div>';

    // Built-in folders
    DATA.computador.forEach(function (f) {
      sec.appendChild(createFolderRow(f.id, f.label, f.icon));
    });

    // User-added folders
    DATA.userFolders.forEach(function (f) {
      sec.appendChild(createFolderRow(f.id, f.label, 'ri-folder-3-line'));
    });

    return sec;
  }

  function createFolderRow(id, label, icon) {
    var row = document.createElement('div');
    row.className = 'sb-row';
    row.dataset.id = id;
    row.dataset.type = 'folder';
    row.tabIndex = 0;
    row.innerHTML =
      '<span class="sb-row-icon"><i class="' + esc(icon) + '"></i></span>' +
      '<span class="sb-row-label">' + esc(label) + '</span>' +
      '<span class="sb-row-actions">' +
        '<button class="vis-toggle" aria-label="Visibilidade"><i class="ri-eye-line"></i></button>' +
        '<button class="refresh-btn" aria-label="Atualizar"><i class="ri-refresh-fill"></i></button>' +
      '</span>';
    return row;
  }

  /* ── PLAYLISTS ── */
  function renderPlaylists() {
    var sec = document.createElement('div');
    sec.className = 'sb-section';
    sec.dataset.section = 'playlists';

    sec.innerHTML =
      '<div class="sb-section-hdr">' +
        '<span class="sb-section-label">Playlists</span>' +
        '<div class="sb-section-actions" style="position:relative">' +
          '<button class="sec-vis-toggle" aria-label="Esconder tudo"><i class="ri-eye-line"></i></button>' +
          '<button class="sec-add-pl" aria-label="Adicionar"><i class="ri-add-line"></i></button>' +
          '<div class="sb-add-drop" id="pl-add-drop">' +
            '<button data-create="group"><i class="ri-album-fill"></i> Grupo de Playlists</button>' +
            '<button data-create="playlist"><i class="ri-play-list-fill"></i> Playlist</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Special playlists
    DATA.playlists.forEach(function (p) {
      sec.appendChild(createPlaylistRow(p.id, p.label, p.icon));
    });

    // Groups
    DATA.groups.forEach(function (g) {
      sec.appendChild(createGroupHdr(g));
      var children = document.createElement('div');
      children.className = 'sb-group-children';
      g.playlists.forEach(function (p) {
        children.appendChild(createPlaylistRow(p.id, p.label, 'ri-play-list-fill'));
      });
      sec.appendChild(children);
    });

    return sec;
  }

  function createPlaylistRow(id, label, icon) {
    var isActive = state.usbExport[id] !== false;
    var row = document.createElement('div');
    row.className = 'sb-row';
    row.dataset.id = id;
    row.dataset.type = 'playlist';
    row.tabIndex = 0;
    row.innerHTML =
      '<span class="sb-row-icon"><i class="' + esc(icon) + '"></i></span>' +
      '<span class="sb-row-label">' + esc(label) + '</span>' +
      '<span class="sb-row-actions">' +
        '<button class="vis-toggle" aria-label="Visibilidade"><i class="ri-eye-line"></i></button>' +
        '<button class="usb-toggle' + (isActive ? '' : ' is-excluded') + '" aria-label="Exportar USB">' +
          '<i class="' + (isActive ? 'ri-usb-2-v' : 'ri-usb-2-s') + '"></i>' +
        '</button>' +
      '</span>';
    return row;
  }

  function createGroupHdr(g) {
    var hdr = document.createElement('div');
    hdr.className = 'sb-group-hdr is-open';
    hdr.dataset.groupId = g.id;
    hdr.innerHTML =
      '<span class="sb-group-chevron"><i class="ri-arrow-right-s-line"></i></span>' +
      '<span class="sb-row-icon"><i class="ri-album-fill"></i></span>' +
      '<span class="sb-row-label">' + esc(g.label) + '</span>';
    return hdr;
  }

  /* ── PENDRIVE ── */
  function renderPendrive() {
    var sec = document.createElement('div');
    sec.className = 'sb-section';
    sec.dataset.section = 'pendrive';

    var opts = '<option value="" disabled selected>Escolha Pendrive</option>';
    DATA.pendrives.forEach(function (p) {
      opts += '<option value="' + esc(p.id) + '">' + esc(p.label) + '</option>';
    });

    sec.innerHTML =
      '<div class="sb-section-hdr">' +
        '<span class="sb-section-label">Pendrive</span>' +
      '</div>' +
      '<div class="sb-pendrive-select">' +
        '<span class="sb-row-icon"><i class="ri-usb-line"></i></span>' +
        '<select id="pendrive-select">' + opts + '</select>' +
      '</div>';

    return sec;
  }

  /* ═══════════════════════════════════════════════════════════
     EVENTS
     ═══════════════════════════════════════════════════════════ */
  function bindEvents(container) {
    // Row click — single active selection
    container.addEventListener('click', function (e) {
      var row = e.target.closest('.sb-row');
      var btn = e.target.closest('button');

      // Handle button clicks inside rows
      if (btn && row) {
        e.stopPropagation();

        // USB toggle
        if (btn.classList.contains('usb-toggle')) {
          toggleUsb(btn, row.dataset.id);
          return;
        }

        // Visibility toggle
        if (btn.classList.contains('vis-toggle')) {
          toggleVisibility(btn);
          return;
        }

        // Refresh
        if (btn.classList.contains('refresh-btn')) {
          btn.querySelector('i').style.transition = 'transform .4s';
          btn.querySelector('i').style.transform = 'rotate(360deg)';
          setTimeout(function () {
            btn.querySelector('i').style.transform = '';
          }, 500);
          return;
        }
      }

      // Row selection — single active
      if (row) {
        selectItem(container, row);
        return;
      }

      // Group header toggle
      var grpHdr = e.target.closest('.sb-group-hdr');
      if (grpHdr) {
        grpHdr.classList.toggle('is-open');
        return;
      }

      // Section header buttons
      if (btn) {
        // Section visibility toggle
        if (btn.classList.contains('sec-vis-toggle')) {
          toggleSectionVisibility(btn);
          return;
        }

        // Add folder
        if (btn.classList.contains('sec-add-folder')) {
          var name = prompt('Nome da pasta:');
          if (name && name.trim()) {
            var sec = btn.closest('.sb-section');
            var newRow = createFolderRow('folder-' + Date.now(), name.trim(), 'ri-folder-3-line');
            sec.appendChild(newRow);
          }
          return;
        }

        // Add playlist dropdown
        if (btn.classList.contains('sec-add-pl')) {
          var drop = $('#pl-add-drop');
          if (drop) drop.classList.toggle('is-open');
          return;
        }

        // Create from dropdown
        if (btn.dataset.create) {
          var drop2 = $('#pl-add-drop');
          if (drop2) drop2.classList.remove('is-open');

          var cname = prompt(btn.dataset.create === 'group' ? 'Nome do grupo:' : 'Nome da playlist:');
          if (cname && cname.trim()) {
            var plSec = container.querySelector('[data-section="playlists"]');
            if (btn.dataset.create === 'playlist') {
              var newPl = createPlaylistRow('pl-' + Date.now(), cname.trim(), 'ri-play-list-fill');
              state.usbExport['pl-' + Date.now()] = true;
              plSec.appendChild(newPl);
            }
          }
          return;
        }
      }
    });

    // Close add dropdown on outside click
    document.addEventListener('click', function (e) {
      var drop = $('#pl-add-drop');
      if (drop && drop.classList.contains('is-open') && !e.target.closest('.sec-add-pl') && !e.target.closest('.sb-add-drop')) {
        drop.classList.remove('is-open');
      }
    });

    // Pendrive select
    var sel = container.querySelector('#pendrive-select');
    if (sel) {
      sel.addEventListener('change', function () {
        state.pendrive = sel.value;
      });
    }
  }

  function selectItem(container, row) {
    $$('.sb-row.is-active', container).forEach(function (r) {
      r.classList.remove('is-active');
    });
    row.classList.add('is-active');
    state.activeItem = row.dataset.id;

    // Dispatch event for main content area
    var evt = new CustomEvent('sidebar-select', {
      detail: { id: row.dataset.id, type: row.dataset.type }
    });
    document.dispatchEvent(evt);
  }

  function toggleUsb(btn, id) {
    var isExcluded = btn.classList.toggle('is-excluded');
    state.usbExport[id] = !isExcluded;
    var icon = btn.querySelector('i');
    if (icon) {
      icon.className = isExcluded ? 'ri-usb-2-s' : 'ri-usb-2-v';
    }
  }

  function toggleVisibility(btn) {
    var isHidden = btn.classList.toggle('is-hidden');
    var icon = btn.querySelector('i');
    if (icon) {
      icon.className = isHidden ? 'ri-eye-off-line' : 'ri-eye-line';
    }
  }

  function toggleSectionVisibility(btn) {
    var sec = btn.closest('.sb-section');
    if (!sec) return;
    var isHidden = btn.classList.toggle('is-hidden');
    var icon = btn.querySelector('i');
    if (icon) icon.className = isHidden ? 'ri-eye-off-line' : 'ri-eye-line';

    $$('.sb-row', sec).forEach(function (row) {
      row.style.display = isHidden ? 'none' : '';
    });
    $$('.sb-group-hdr', sec).forEach(function (hdr) {
      hdr.style.display = isHidden ? 'none' : '';
    });
    $$('.sb-group-children', sec).forEach(function (ch) {
      ch.style.display = isHidden ? 'none' : '';
    });
  }

  /* ═══════════════════════════════════════════════════════════
     PUBLIC API
     ═══════════════════════════════════════════════════════════ */
  function getEnabledExportPlaylists() {
    var result = [];
    for (var id in state.usbExport) {
      if (state.usbExport[id]) {
        result.push(id);
      }
    }
    return result;
  }

  function init(selector) {
    var container = typeof selector === 'string' ? $(selector) : selector;
    if (container) render(container);
  }

  window.ApolloSidebarTree = {
    init: init,
    getEnabledExportPlaylists: getEnabledExportPlaylists,
    getActiveItem: function () { return state.activeItem; },
    getSelectedPendrive: function () { return state.pendrive; },
    getState: function () { return state; }
  };
})();
