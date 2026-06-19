/**
 * biblioteca-dnd.js — Drag-and-Drop for library tree v3
 * Reorder playlists, drag tracks between lists, drag to pendrive export
 * Depends on: biblioteca-tree-ext.js (state), biblioteca-tree-lux.js (DOM)
 */
;(function () {
  'use strict';

  var dragSrc = null;
  var dragGhost = null;

  function enableDnd(container) {
    if (!container) return;

    container.addEventListener('dragstart', function (e) {
      var row = e.target.closest('.sb-row');
      if (!row) return;
      dragSrc = row;
      row.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.dataset.id);

      dragGhost = row.cloneNode(true);
      dragGhost.style.position = 'fixed';
      dragGhost.style.pointerEvents = 'none';
      dragGhost.style.opacity = '0.6';
      dragGhost.style.zIndex = '99999';
      dragGhost.style.width = row.offsetWidth + 'px';
      document.body.appendChild(dragGhost);
      e.dataTransfer.setDragImage(dragGhost, 20, 14);
    });

    container.addEventListener('dragover', function (e) {
      var row = e.target.closest('.sb-row');
      if (!row || row === dragSrc) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      row.classList.add('drop-target');
    });

    container.addEventListener('dragleave', function (e) {
      var row = e.target.closest('.sb-row');
      if (row) row.classList.remove('drop-target');
    });

    container.addEventListener('drop', function (e) {
      e.preventDefault();
      var target = e.target.closest('.sb-row');
      if (!target || !dragSrc || target === dragSrc) return;

      if (dragSrc.dataset.type === target.dataset.type) {
        target.parentNode.insertBefore(dragSrc, target);
      }
      target.classList.remove('drop-target');
    });

    container.addEventListener('dragend', function () {
      if (dragSrc) dragSrc.classList.remove('is-dragging');
      if (dragGhost && dragGhost.parentNode) dragGhost.parentNode.removeChild(dragGhost);
      dragSrc = null;
      dragGhost = null;
      var targets = container.querySelectorAll('.drop-target');
      for (var i = 0; i < targets.length; i++) targets[i].classList.remove('drop-target');
    });

    var rows = container.querySelectorAll('.sb-row[data-type="playlist"]');
    for (var i = 0; i < rows.length; i++) {
      rows[i].setAttribute('draggable', 'true');
    }
  }

  window.BibliotecaDnd = { enableDnd: enableDnd };
})();
