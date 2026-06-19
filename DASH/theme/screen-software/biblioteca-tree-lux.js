/**
 * biblioteca-tree-lux.js — Luxury-grade tree renderer v3
 * DOM builder: icons, count badges, section headers, folder/playlist rows
 * Depends on: sidebar-tree.css (shared component)
 */
;(function () {
  'use strict';

  var $ = function (s, p) { return (p || document).querySelector(s); };

  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  var DATA = {
    computador: [
      { id: 'downloads',  label: 'Downloads',                  icon: 'ri-download-2-line', count: 8 },
      { id: 'musicas',    label: 'Músicas',                     icon: 'ri-music-2-fill', count: 212 },
      { id: 'coletanea',  label: 'Todas as faixas (Coletânea)', icon: 'ri-folder-music-line', count: 340 }
    ],
    userFolders: [
      { id: 'folder-techno', label: 'Techno Sets', count: 24 },
      { id: 'folder-house',  label: 'Deep House', count: 31 }
    ],
    playlists: [
      { id: 'pl-coletanea', label: 'Coletânea', icon: 'ri-folder-music-line', type: 'special', count: 340 },
      { id: 'pl-favoritas', label: 'Favoritas',  icon: 'ri-star-line',         type: 'special', count: 3 }
    ],
    groups: [
      {
        id: 'grp-sets',
        label: 'Sets Junho',
        playlists: [
          { id: 'pl-warm',    label: 'Warm Up', count: 18 },
          { id: 'pl-peak',    label: 'Peak Time', count: 22 },
          { id: 'pl-closing', label: 'Closing', count: 14 }
        ]
      }
    ],
    pendrives: [
      { id: 'usb-sandisk',  label: 'SanDisk 64GB (E:)' },
      { id: 'usb-kingston', label: 'Kingston 32GB (F:)' }
    ]
  };

  function createSep() {
    var el = document.createElement('div');
    el.className = 'sb-sep';
    return el;
  }

  function createFolderRow(id, label, icon, count) {
    var row = document.createElement('div');
    row.className = 'sb-row';
    row.dataset.id = id;
    row.dataset.type = 'folder';
    row.tabIndex = 0;
    row.innerHTML =
      '<span class="sb-row-icon"><i class="' + esc(icon) + '"></i></span>' +
      '<span class="sb-row-label">' + esc(label) + (count != null ? ' <span class="ct">' + esc(String(count)) + '</span>' : '') + '</span>' +
      '<span class="sb-row-actions">' +
        '<button class="vis-toggle" aria-label="Visibilidade"><i class="ri-eye-line"></i></button>' +
        '<button class="refresh-btn" aria-label="Atualizar"><i class="ri-refresh-fill"></i></button>' +
      '</span>';
    return row;
  }

  function createPlaylistRow(id, label, icon, count, usbState) {
    var isActive = usbState[id] !== false;
    var row = document.createElement('div');
    row.className = 'sb-row';
    row.dataset.id = id;
    row.dataset.type = 'playlist';
    row.tabIndex = 0;
    row.innerHTML =
      '<span class="sb-row-icon"><i class="' + esc(icon) + '"></i></span>' +
      '<span class="sb-row-label">' + esc(label) + (count != null ? ' <span class="ct">' + esc(String(count)) + '</span>' : '') + '</span>' +
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
      '<span class="sb-row-label">' + esc(g.label) + ' <span class="ct">' + g.playlists.length + '</span></span>';
    return hdr;
  }

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
    DATA.computador.forEach(function (f) { sec.appendChild(createFolderRow(f.id, f.label, f.icon, f.count)); });
    DATA.userFolders.forEach(function (f) { sec.appendChild(createFolderRow(f.id, f.label, 'ri-folder-3-line', f.count)); });
    return sec;
  }

  function renderPlaylists(usbState) {
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
    DATA.playlists.forEach(function (p) { sec.appendChild(createPlaylistRow(p.id, p.label, p.icon, p.count, usbState)); });
    DATA.groups.forEach(function (g) {
      sec.appendChild(createGroupHdr(g));
      var children = document.createElement('div');
      children.className = 'sb-group-children';
      g.playlists.forEach(function (p) { children.appendChild(createPlaylistRow(p.id, p.label, 'ri-play-list-fill', p.count, usbState)); });
      sec.appendChild(children);
    });
    return sec;
  }

  function renderPendrive() {
    var sec = document.createElement('div');
    sec.className = 'sb-section';
    sec.dataset.section = 'pendrive';
    var opts = '<option value="" disabled selected>Escolha Pendrive</option>';
    DATA.pendrives.forEach(function (p) {
      opts += '<option value="' + esc(p.id) + '">' + esc(p.label) + '</option>';
    });
    sec.innerHTML =
      '<div class="sb-section-hdr"><span class="sb-section-label">Pendrive</span></div>' +
      '<div class="sb-pendrive-select">' +
        '<span class="sb-row-icon"><i class="ri-usb-line"></i></span>' +
        '<select id="pendrive-select">' + opts + '</select>' +
      '</div>';
    return sec;
  }

  function render(container, usbState) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'sb-tree';
    container.appendChild(renderComputador());
    container.appendChild(createSep());
    container.appendChild(renderPlaylists(usbState));
    container.appendChild(createSep());
    container.appendChild(renderPendrive());
  }

  window.BibliotecaTreeLux = {
    render: render,
    createFolderRow: createFolderRow,
    createPlaylistRow: createPlaylistRow,
    DATA: DATA
  };
})();
