/* ═══════════════════════════════════════════════════════════
   sign-confetti.js — Canvas Confetti Celebration
   180 rects/circles/strips with gravity, wobble, and fade.
   Respects prefers-reduced-motion.
   Depends: (standalone — no SignEngine dependency)
   ═══════════════════════════════════════════════════════════ */
;(function (SE) {
  'use strict';

  var COLORS   = ['#f45f00', '#16a34a', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff'];
  var SHAPES   = ['rect', 'circle', 'strip'];
  var COUNT    = 180;
  var DURATION = 4200;

  function fire () {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

    var canvas = document.createElement('canvas');
    canvas.id     = 'confetti-canvas';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var pieces = [];
    for (var i = 0; i < COUNT; i++) {
      pieces.push({
        x : Math.random() * canvas.width,
        y : -20 - Math.random() * canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 4 + 2,
        rot: Math.random() * Math.PI * 2,
        rv: (Math.random() - 0.5) * 0.22,
        c : COLORS[i % COLORS.length],
        s : SHAPES[Math.floor(Math.random() * SHAPES.length)],
        w : Math.random() * 10 + 5,
        h : Math.random() * 6  + 3,
        r : Math.random() * 5  + 3,
        g : 0.12 + Math.random() * 0.12,
        wo: (Math.random() - 0.5) * 0.8,
        t : 0
      });
    }

    var start = performance.now();

    function draw (now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / DURATION, 1);
      if (progress >= 1) { canvas.remove(); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var fadeStart = 0.65;
      var alpha = progress < fadeStart ? 1 : 1 - (progress - fadeStart) / (1 - fadeStart);

      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        p.t  += 1;
        p.x  += p.vx + Math.sin(p.t * 0.04) * p.wo;
        p.y  += p.vy;
        p.vy += p.g;
        p.rot += p.rv;

        ctx.save();
        ctx.globalAlpha = alpha * Math.max(0, 1 - p.y / (canvas.height * 1.1));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;

        if (p.s === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.s === 'strip') {
          ctx.fillRect(-p.w * 0.5, -1.5, p.w, 3);
        } else {
          ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
        }
        ctx.restore();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* register */
  SE.modules.confetti = { fire: fire };

})(window.SignEngine);
