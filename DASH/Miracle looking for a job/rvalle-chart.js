/**
 * rvalle-chart.js
 * Biblioteca de graficos canvas para apollo::rio — Painel de Vagas
 * Rafael Valle — apollo.rio.br
 * @version 1.0.0
 */

(function (global) {
  'use strict';

  var RValleChart = {

    _resolveVar: function(val) {
      if (typeof val === 'string' && val.indexOf('var(') === 0) {
        var name = val.match(/var\((--[^,)]+)/);
        if (name) {
          var resolved = getComputedStyle(document.documentElement).getPropertyValue(name[1]).trim();
          return resolved || '#f45f00';
        }
      }
      return val;
    },

    _setup: function(id) {
      var canvas = document.getElementById(id);
      if (!canvas) { console.warn('[rvalle-chart] Canvas nao encontrado: #' + id); return null; }
      var dpr = window.devicePixelRatio || 1;
      var parent = canvas.parentElement;
      var W = parent.clientWidth || 400;
      var H = parseInt(canvas.getAttribute('height') || 250);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      var ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      return { ctx: ctx, W: W, H: H };
    },

    _roundRect: function(ctx, x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      if (r < 0) r = 0;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    },

    /* ---------------------------------------------------------------
       BARRAS VERTICAIS — candidaturas por mes
       colorFn(d) retorna cor baseada no status de emprego
    --------------------------------------------------------------- */
    bar: function(id, data, opts) {
      opts = opts || {};
      var c = this._setup(id);
      if (!c) return;
      var ctx = c.ctx, W = c.W, H = c.H;

      var labelKey = opts.labelKey || 'label';
      var valueKey = opts.valueKey || 'count';
      var colorFn  = opts.colorFn  || function() { return '#f45f00'; };
      var pad = { top: 28, right: 12, bottom: 46, left: 34 };

      var maxVal = Math.max.apply(null, data.map(function(d){ return d[valueKey]; }).concat([1]));
      var chartW = W - pad.left - pad.right;
      var chartH = H - pad.top  - pad.bottom;
      var barW   = chartW / data.length;
      var gap    = barW * 0.3;
      var self   = this;

      ctx.clearRect(0, 0, W, H);

      /* Grid + eixo Y */
      var gridCount = Math.min(maxVal, 4);
      for (var gi = 0; gi <= gridCount; gi++) {
        var gY = pad.top + (chartH / gridCount) * gi;
        ctx.strokeStyle = 'rgba(19,21,23,0.07)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(pad.left, gY);
        ctx.lineTo(W - pad.right, gY);
        ctx.stroke();
        ctx.setLineDash([]);

        var yVal = Math.round(maxVal - (maxVal / gridCount) * gi);
        ctx.fillStyle = 'rgba(19,21,23,0.28)';
        ctx.font = '400 9px system-ui,sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(yVal, pad.left - 5, gY + 3);
      }

      /* Barras */
      data.forEach(function(d, i) {
        var val = d[valueKey];
        var rawColor = colorFn(d);
        var color = self._resolveVar(rawColor);
        var x  = pad.left + i * barW + gap / 2;
        var bw = barW - gap;
        var bh = val > 0 ? (chartH * val) / maxVal : 3;
        var by = H - pad.bottom - bh;
        var r  = Math.min(5, bw / 2);

        /* Track de fundo */
        ctx.fillStyle = 'rgba(19,21,23,0.04)';
        self._roundRect(ctx, x, pad.top, bw, chartH, r);
        ctx.fill();

        /* Barra */
        ctx.fillStyle = val === 0 ? 'rgba(19,21,23,0.07)' : color;
        self._roundRect(ctx, x, by, bw, bh, r);
        ctx.fill();

        /* Valor */
        if (val > 0) {
          ctx.fillStyle = 'rgba(19,21,23,0.48)';
          ctx.font = '600 10px system-ui,sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(val, x + bw / 2, by - 6);
        }

        /* Label X */
        ctx.fillStyle = 'rgba(19,21,23,0.38)';
        ctx.font = '400 10px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d[labelKey], x + bw / 2, H - pad.bottom + 14);

        /* Bolinha indicadora status */
        var dotColor = d.status === 'empregado'
          ? (val > 0 ? '#22c55e' : 'rgba(34,197,94,0.22)')
          : (val > 0 ? '#eab308' : 'rgba(234,179,8,0.22)');
        ctx.beginPath();
        ctx.arc(x + bw / 2, H - pad.bottom + 28, 3, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });
    },

    /* ---------------------------------------------------------------
       BARRAS HORIZONTAIS — frequencia por empresa
    --------------------------------------------------------------- */
    horizontal: function(id, data, opts) {
      opts = opts || {};
      var c = this._setup(id);
      if (!c) return;
      var ctx = c.ctx, W = c.W, H = c.H;

      var labelKey = opts.labelKey || 'empresa';
      var valueKey = opts.valueKey || 'count';
      var color = this._resolveVar(opts.color || '#f45f00');
      var maxVal = Math.max.apply(null, data.map(function(d){ return d[valueKey]; }).concat([1]));
      var self = this;

      ctx.clearRect(0, 0, W, H);

      /* Largura max do label */
      ctx.font = '400 11px system-ui,sans-serif';
      var maxLW = 0;
      data.forEach(function(d) {
        var m = ctx.measureText(d[labelKey]).width;
        if (m > maxLW) maxLW = m;
      });
      maxLW += 14;

      var pad = { top: 8, right: 44, bottom: 8, left: maxLW };
      var chartW = W - pad.left - pad.right;
      var rowH   = (H - pad.top - pad.bottom) / data.length;
      var barH   = Math.max(10, rowH * 0.44);

      data.forEach(function(d, i) {
        var val = d[valueKey];
        var y   = pad.top + i * rowH + (rowH - barH) / 2;
        var bw  = (chartW * val) / maxVal;
        var r   = barH / 2;

        /* Label */
        ctx.fillStyle = 'rgba(19,21,23,0.5)';
        ctx.font = '400 11px system-ui,sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(d[labelKey], pad.left - 8, y + barH / 2 + 4);

        /* Track */
        ctx.fillStyle = 'rgba(19,21,23,0.05)';
        self._roundRect(ctx, pad.left, y, chartW, barH, r);
        ctx.fill();

        /* Barra */
        if (bw >= r * 2) {
          ctx.fillStyle = color;
          self._roundRect(ctx, pad.left, y, bw, barH, r);
          ctx.fill();
        } else if (bw > 0) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(pad.left + r, y + barH / 2, barH / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        /* Contagem */
        ctx.fillStyle = 'rgba(19,21,23,0.45)';
        ctx.font = '600 11px system-ui,sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(val + 'x', pad.left + chartW + 8, y + barH / 2 + 4);
      });
    },

    /* ---------------------------------------------------------------
       ROSCA — distribuicao de status
    --------------------------------------------------------------- */
    donut: function(id, segments, opts) {
      opts = opts || {};
      var c = this._setup(id);
      if (!c) return;
      var ctx = c.ctx, W = c.W, H = c.H;

      var total = segments.reduce(function(s, d){ return s + d.value; }, 0);
      var cx = W / 2, cy = H / 2;
      var outerR = Math.min(cx, cy) - 14;
      var innerR = outerR * 0.64;
      var startAngle = -Math.PI / 2;
      var self = this;

      ctx.clearRect(0, 0, W, H);

      segments.forEach(function(seg) {
        var slice = (seg.value / total) * (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fillStyle = self._resolveVar(seg.color);
        ctx.fill();
        startAngle += slice;
      });

      /* Furo central */
      var bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fillStyle = bgColor;
      ctx.fill();

      /* Total */
      ctx.fillStyle = 'rgba(19,21,23,0.7)';
      ctx.font = '600 20px system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(total, cx, cy + 6);
      ctx.fillStyle = 'rgba(19,21,23,0.32)';
      ctx.font = '400 9px system-ui,sans-serif';
      ctx.fillText('total', cx, cy + 19);

      /* Legenda */
      if (opts.legend !== false) {
        var legY = H - 14;
        var legX = W / 2 - ((segments.length * 80) / 2);
        segments.forEach(function(seg, i) {
          var lx = legX + i * 80;
          ctx.fillStyle = self._resolveVar(seg.color);
          ctx.beginPath();
          ctx.arc(lx + 5, legY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(19,21,23,0.38)';
          ctx.font = '400 9px system-ui,sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(seg.label, lx + 12, legY + 3);
        });
      }
    },

    /* Responsivo: re-renderiza canvases marcados */
    init: function() {
      var timer;
      window.addEventListener('resize', function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          document.querySelectorAll('[data-rv-render]').forEach(function(el) {
            var fn = el.dataset.rvRender;
            if (fn && typeof window[fn] === 'function') window[fn]();
          });
        }, 220);
      });
    }
  };

  global.RValleChart = RValleChart;
  RValleChart.init();

}(window));
