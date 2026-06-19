/**
 * biblioteca-tree-ext.js — Tree extensions v3
 * Events: selection, USB toggle, visibility, group collapse, add/create
 * Depends on: biblioteca-tree-lux.js (renderer)
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

  function initUsbState(DATA) {
    DATA.playlists.forEach(function (p) { state.usbExport[p.id] = true; });
    DATA.groups.forEach(function (g) {
      g.playlists.forEach(function (p) { state.usbExport[p.id] = true; });
    });
  }

  function selectItem(container, row) {
    $$('.sb-row.is-active', container).forEach(function (r) { r.classList.remove('is-active'); });
    row.classList.add('is-active');
    state.activeItem = row.dataset.id;
    document.dispatchEvent(new CustomEvent('sidebar-select', {
      detail: { id: row.dataset.id, type: row.dataset.type }
    }));
  }

  function toggleUsb(btn, id) {
    var isExcluded = btn.classList.toggle('is-excluded');
    state.usbExport[id] = !isExcluded;
    var icon = btn.querySelector('i');
    if (icon) icon.className = isExcluded ? 'ri-usb-2-s' : 'ri-usb-2-v';
  }

  function toggleVisibility(btn) {
    var isHidden = btn.classList.toggle('is-hidden');
    var icon = btn.querySelector('i');
    if (icon) icon.className = isHidden ? 'ri-eye-off-line' : 'ri-eye-line';
  }

  function toggleSectionVisibility(btn) {
    var sec = btn.closest('.sb-section');
    if (!sec) return;
    var isHidden = btn.classList.toggle('is-hidden');
    var icon = btn.querySelector('i');
    if (icon) icon.className = isHidden ? 'ri-eye-off-line' : 'ri-eye-line';
    $$('.sb-row', sec).forEach(function (row) { row.style.display = isHidden ? 'none' : ''; });
    $$('.sb-group-hdr', sec).forEach(function (hdr) { hdr.style.display = isHidden ? 'none' : ''; });
    $$('.sb-group-children', sec).forEach(function (ch) { ch.style.display = isHidden ? 'none' : ''; });
  }

  function bindEvents(container) {
    var Lux = window.BibliotecaTreeLux;

    container.addEventListener('click', function (e) {
      var row = e.target.closest('.sb-row');
      var btn = e.target.closest('button');

      if (btn && row) {
        e.stopPropagation();
        if (btn.classList.contains('usb-toggle')) { toggleUsb(btn, row.dataset.id); return; }
        if (btn.classList.contains('vis-toggle')) { toggleVisibility(btn); return; }
        if (btn.classList.contains('refresh-btn')) {
          btn.querySelector('i').style.transition = 'transform .4s';
          btn.querySelector('i').style.transform = 'rotate(360deg)';
          setTimeout(function () { btn.querySelector('i').style.transform = ''; }, 500);
          return;
        }
      }

      if (row) { selectItem(container, row); return; }

      var grpHdr = e.target.closest('.sb-group-hdr');
      if (grpHdr) { grpHdr.classList.toggle('is-open'); return; }

      if (btn) {
        if (btn.classList.contains('sec-vis-toggle')) { toggleSectionVisibility(btn); return; }
        if (btn.classList.contains('sec-add-folder')) {
          var name = prompt('Nome da pasta:');
          if (name && name.trim()) {
            var sec = btn.closest('.sb-section');
            sec.appendChild(Lux.createFolderRow('folder-' + Date.now(), name.trim(), 'ri-folder-3-line'));
          }
          return;
        }
        if (btn.classList.contains('sec-add-pl')) {
          var drop = $('#pl-add-drop');
          if (drop) drop.classList.toggle('is-open');
          return;
        }
        if (btn.dataset.create) {
          var drop2 = $('#pl-add-drop');
          if (drop2) drop2.classList.remove('is-open');
          var cname = prompt(btn.dataset.create === 'group' ? 'Nome do grupo:' : 'Nome da playlist:');
          if (cname && cname.trim()) {
            var plSec = container.querySelector('[data-section="playlists"]');
            if (btn.dataset.create === 'playlist') {
              var newId = 'pl-' + Date.now();
              state.usbExport[newId] = true;
              plSec.appendChild(Lux.createPlaylistRow(newId, cname.trim(), 'ri-play-list-fill', null, state.usbExport));
            }
          }
          return;
        }
      }
    });

    document.addEventListener('click', function (e) {
      var drop = $('#pl-add-drop');
      if (drop && drop.classList.contains('is-open') && !e.target.closest('.sec-add-pl') && !e.target.closest('.sb-add-drop')) {
        drop.classList.remove('is-open');
      }
    });

    var sel = container.querySelector('#pendrive-select');
    if (sel) sel.addEventListener('change', function () { state.pendrive = sel.value; });
  }

  function getEnabledExportPlaylists() {
    var result = [];
    for (var id in state.usbExport) {
      if (state.usbExport[id]) result.push(id);
    }
    return result;
  }

  function init(selector) {
    var Lux = window.BibliotecaTreeLux;
    if (!Lux) return;
    initUsbState(Lux.DATA);
    var container = typeof selector === 'string' ? $(selector) : selector;
    if (!container) return;
    Lux.render(container, state.usbExport);
    bindEvents(container);
  }

  window.BibliotecaTreeExt = {
    init: init,
    getEnabledExportPlaylists: getEnabledExportPlaylists,
    getActiveItem: function () { return state.activeItem; },
    getSelectedPendrive: function () { return state.pendrive; },
    getState: function () { return state; }
  };
})();
