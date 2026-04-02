 /**
 * @fileoverview Apollo Ecosystem - Ultra Pro Core Runtime
 * High performance CDN loader with lazy loading, error handling, and security.
 * Loads jQuery, GSAP, icons, and app scripts with parallelization and SRI.
 */
(function(w, d) {
  'use strict';

  const VERSION = "1.0.0";

  if (w.Apollo && w.Apollo.version) {
    if (w.Apollo.version !== VERSION) {
      console.error(`[Apollo] Version conflict detected: ${w.Apollo.version} != ${VERSION}`);
    }
    return;
  }

  // URL Sanitization Helper
  /**
   * Sanitizes and validates URLs
   * @param {string} u - URL to sanitize
   * @returns {string} Sanitized URL or empty string
   */
  function sanitizeUrl(u) {
    try {
      return new URL(u, location.origin).href;
    } catch {
      return '';
    }
  }

  // Minified CSS Content (compressed)
  const cssContent = `:root{block-size:100%;inline-size:100%;--ff-main:"Space Grotesk",system-ui,-apple-system,sans-serif;--font-main:var(--ff-main);--ff-mono:"Space Mono",monospace;--font-heading:var(--ff-mono);--ff-fun:Syne,sans-serif;--font:400 var(--fs-p)/1.5 var(--ff-main);--fs-h1:clamp(2.25rem,1.957rem+1.46vi,3rem);--fs-h2:clamp(1.75rem,1.555rem+0.98vi,2.25rem);--fs-h3:clamp(1.5rem,1.354rem+0.73vi,1.875rem);--fs-h4:clamp(1.25rem,1.153rem+0.49vi,1.5rem);--fs-h5:clamp(1rem,0.951rem+0.24vi,1.125rem);--fs-h6:clamp(0.625rem,0.625rem+0vi,0.625rem);--fs-p:clamp(0.875rem,0.826rem+0.24vi,1rem);--primary:#f45f00;--color-main:var(--primary);--accent-violet:#651FFF;--accent:var(--accent-acid);--accent-acid:#D7FF00;--txt-rgb:19,21,23;--txt-color:rgba(var(--txt-rgb),0.77);--txt-color-hover:rgba(var(--txt-rgb),0.9);--txt-color-heading:var(--txt-color-hover);--muted:rgba(var(--txt-rgb),0.45);--muted-txt:rgba(var(--txt-rgb),0.3);--txt-muted:var(--muted-txt);--muted-bg:rgba(var(--txt-rgb),0.21);--bg:var(--white-1);--bg-neutral:var(--white-2);--glass:var(--white-3);--surface:var(--white-2);--card:var(--white-3);--surface-hover:var(--white-4);--card-hover:var(--white-5);--border:var(--white-10)!important;--border-hover:var(--white-13)!important;--radius-xs:5px;--radius-sm:10px;--radius:20px;--radius-lg:28px;--space-1:4px;--space-2:8px;--space-3:16px;--space-4:24px;--space-5:32px;--space-6:48px;--ease-default:cubic-bezier(.16,1,.3,1);--ease-smooth:cubic-bezier(.25,1,.5,1);--ease-snappy:cubic-bezier(.2,.9,.3,1);--transition-ui:.25s var(--ease-default);--z-ui:10;--z-popover:100;--z-modal:1000;--rgb-theme:255,255,255;--rgb-diff:0,0,0;--white-1:#ffffff;--white-2:#00000005;--white-3:#0000000a;--white-4:#0000000f;--white-5:#00000014;--white-6:#0000001a;--white-7:#0000001f;--white-8:#00000024;--white-9:#00000029;--white-10:#0000002e;--white-11:#0003;--white-12:#00000038;--white-13:#0000003d;--white-14:#00000042;--white-15:#00000047;--white-16:#0000004d;--white-17:#00000052;--white-18:#00000057;--white-19:#0000005c;--white-20:#00000061;--gray-1:#0006;--gray-2:#0000006b;--gray-3:#00000070;--gray-4:#00000075;--gray-5:#0000007a;--gray-6:#00000080;--gray-7:#00000085;--gray-8:#0000008a;--gray-9:#0000008f;--gray-10:#00000094;--gray-11:#0009;--gray-12:#0000009e;--gray-13:#000000a3;--gray-14:#000000a8;--gray-15:#000000ad;--gray-16:#000000b3;--gray-17:#000000b8;--gray-18:#000000bd;--gray-19:#000000c2;--gray-20:#000000c7;--black-1:#121214;--black-2:#0f0f11;--black-3:#0c0c0d;--black-4:#0a0a0a;--black-5:#090909;--black-6:#070707;--black-7:#060606;--black-8:#050505;--black-9:#030303;--black-10:#000}html.dark-mode{--rgb-theme:0,0,0;--rgb-diff:255,255,255;--white-1:#000f;--white-2:#ffffff05;--white-3:#ffffff0a;--white-4:#ffffff0f;--white-5:#ffffff14;--white-6:#ffffff1a;--white-7:#ffffff1f;--white-8:#ffffff24;--white-9:#ffffff29;--white-10:#ffffff2e;--white-11:#fff3;--white-12:#ffffff38;--white-13:#ffffff3d;--white-14:#ffffff42;--white-15:#ffffff47;--white-16:#ffffff4d;--white-17:#ffffff52;--white-18:#ffffff57;--white-19:#ffffff5c;--white-20:#ffffff61;--gray-1:#fff6;--gray-2:#ffffff6b;--gray-3:#ffffff70;--gray-4:#ffffff75;--gray-5:#ffffff7a;--gray-6:#ffffff80;--gray-7:#ffffff85;--gray-8:#ffffff8a;--gray-9:#ffffff8f;--gray-10:#ffffff94;--gray-11:#fff9;--gray-12:#ffffff9e;--gray-13:#ffffffa3;--gray-14:#ffffffa8;--gray-15:#ffffffad;--gray-16:#ffffffb3;--gray-17:#ffffffb8;--gray-18:#ffffffbd;--gray-19:#ffffffc2;--gray-20:#ffffffc7;--black-1:#ededeb;--black-2:#f0f0ee;--black-3:#f3f3f2;--black-4:#f5f5f5;--black-5:#f6f6f6;--black-6:#f8f8f8;--black-7:#f9f9f9;--black-8:#fafafa;--black-9:#fcfcfc;--black-10:#fff}*{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;padding:0;margin:0}::after{box-sizing:border-box}::before{box-sizing:border-box}::selection{background-color:#FF8640;color:#fff}html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-size:var(--fs-p);line-height:1.5;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;text-size-adjust:100%;touch-action:pan-x pan-y;scroll-behavior:smooth}html,body{max-width:100%;max-height:100%;width:100dvw;height:100dvh;background-color:var(--bg);background:var(--bg);font-family:var(--ff-main);font:var(--font);line-height:1.5;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;text-shadow:#00000003 0 0 1px;text-wrap:balance}button,hr,input{overflow:visible}audio,canvas,progress,video{display:inline-block}progress,sub,sup{vertical-align:baseline}mark{background-color:#ff0;color:#000}.center{justify-content:center;text-align:center;place-items:center;margin-left:auto;margin-right:auto;width:fit-content}.baseline{align-items:baseline;align-self:baseline;vertical-align:baseline}`;

  // CSP Recommendation: style-src 'unsafe-inline' https://fonts.googleapis.com; script-src https://cdn.apollo.rio.br https://assets.apollo.rio.br; font-src https://fonts.gstatic.com

  w.Apollo = {
    version: VERSION,
    config: {
      debug: false,
      timeout: 8000,
      base: "",
      assets: {
        js_high: [
          { u: `https://cdn.apollo.rio.br/v${VERSION}/js/jquery.v4.min.js`, p: "high", signal: "jquery", critical: true },
          { u: `https://cdn.apollo.rio.br/v${VERSION}/js/tracker.min.js`, p: "high" },
          { u: `https://cdn.apollo.rio.br/v${VERSION}/js/translate.min.js`, p: "high" },
          { u: `https://cdn.apollo.rio.br/v${VERSION}/js/icon.min.js`, p: "high", signal: "icons" },
          { u: `https://cdn.apollo.rio.br/v${VERSION}/js/gsap.v3.14.2.min.js`, p: "auto", critical: true, integrity: "sha512-7eHRwcbYkK4d9g/6tD/mhkf++eoTHwpNM9woBxtPUBWm67zeAfFC+HrdoE2GanKeocly/VxeLvIqwvCdk7qScg==", crossorigin: "anonymous" }
        ],
        js_app: [
          `https://cdn.apollo.rio.br/v${VERSION}/js/morphism.min.js`,
          `https://cdn.apollo.rio.br/v${VERSION}/js/popper.v2.11.8.min.js`,
          `https://cdn.apollo.rio.br/v${VERSION}/js/reveal-up.js`,
          `https://cdn.apollo.rio.br/v${VERSION}/js/forms.js`,
          `https://cdn.apollo.rio.br/v${VERSION}/js/script.js`
        ]
      }
    },

    /**
     * Loads a JavaScript file
     * @param {string} src - Script URL
     * @param {Function} cb - Callback on load
     * @param {boolean} ordered - If true, load synchronously
     * @param {string} signal - Custom event signal
     * @param {string} integrity - SRI hash
     * @param {string} crossorigin - Crossorigin attribute
     * @returns {HTMLScriptElement|null}
     */
    loadJS: function(src, cb, ordered, signal, integrity, crossorigin, onError) {
      const sanitizedSrc = sanitizeUrl(src);
      if (!sanitizedSrc) {
        if (cb) cb();
        return null;
      }
      const script = d.createElement("script");
      script.src = sanitizedSrc;
      script.async = !ordered;
      script.defer = !!ordered;
      if (integrity) script.integrity = integrity;
      if (crossorigin) script.crossOrigin = crossorigin;
      const head = d.head || d.getElementsByTagName('head')[0] || d.documentElement;
      let done = false;
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        try { script.remove(); } catch (e) {}
        if (typeof onError === 'function') onError(new Error(`Timeout loading ${sanitizedSrc}`));
      }, w.Apollo.config.timeout);
      head.appendChild(script);
      if (cb) {
        script.onload = () => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          if (signal === 'jquery' && (w.jQuery || w.$)) {
            w.dispatchEvent(new CustomEvent('apollo:jquery-ready'));
          }
          if (signal === 'icons') {
            w.dispatchEvent(new CustomEvent('apollo:icons-loaded'));
          }
          cb();
        };
        script.onerror = () => {
          if (done) return;
          done = true;
          clearTimeout(timer);
          if (typeof onError === 'function') {
            onError(new Error(`Failed to load ${sanitizedSrc}`));
            return;
          }
          cb();
        };
      }
      return script;
    },

    /**
     * Logs messages if debug is enabled
     * @param {...*} args - Arguments to log
     */
    log: function(...args) {
      if (w.Apollo.config.debug) console.log("[Apollo]", ...args);
    },

    /**
     * Resolves relative URLs
     * @param {string} u - URL to resolve
     * @returns {string} Resolved URL
     */
    resolve: function(u) {
      if (u.match(/^(http|\/|[a-zA-Z]:)/)) return u;
      return (w.Apollo.config.base || '/') + u;
    },

    /**
     * Loads a script as a Promise
     * @param {string|object} entry - Script entry
     * @param {boolean} isOrdered - If ordered load
     * @returns {Promise}
     */
    loadPromise: function(entry, isOrdered) {
      return new Promise((resolve, reject) => {
        const url = w.Apollo.resolve(typeof entry === 'string' ? entry : entry.u);
        if (!url) return resolve();
        if (w.Apollo.loadedSet.has(url)) return resolve();
        const critical = !!(typeof entry === 'object' && entry.critical);
        const priority = (typeof entry === 'object' && entry.p) ? entry.p : 'auto';
        const signal = (typeof entry === 'object' && entry.signal) ? entry.signal : null;
        const integrity = (typeof entry === 'object' && entry.integrity) ? entry.integrity : null;
        const crossorigin = (typeof entry === 'object' && entry.crossorigin) ? entry.crossorigin : null;
        const script = w.Apollo.loadJS(url, () => {
          w.Apollo.loadedSet.add(url);
          resolve();
        }, isOrdered, signal, integrity, crossorigin, (loadErr) => {
          if (critical) {
            reject(loadErr);
          } else {
            if (w.Apollo.config.debug) console.warn('[Apollo] Non-critical script failed:', url);
            resolve();
          }
        });
        if (script && priority === 'high') script.setAttribute("fetchpriority", "high");
      });
    },

    /**
     * Forces autoplay on videos
     */
    forcePlay: function() {
      try {
        d.querySelectorAll('video[autoplay]').forEach(v => {
          if (v.paused) {
            const p = v.play();
            if (p && p.catch) p.catch(() => {});
          }
        });
      } catch (e) {
        w.Apollo.log(e);
      }
    },

    /**
     * Finishes up the initialization
     */
    finishUp: function() {
      try {
        if (w.Apollo.isReady) return;
        w.Apollo.isReady = true;
        d.body.style.opacity = "1";
        w.dispatchEvent(new CustomEvent("apollo:ready", { detail: { time: Date.now() - w.Apollo.startTime } }));
        w.Apollo.log("Boot starting");
        w.Apollo.forcePlay();
        d.addEventListener('visibilitychange', () => {
          if (!d.hidden) w.Apollo.forcePlay();
        });
      } catch (e) {
        w.Apollo.log(e);
      } finally {
        // Ensure opacity reset
        if (d.body.style.opacity === "0") d.body.style.opacity = "1";
      }
    },

    /**
     * Initializes the Apollo CDN
     */
    init: async function() {
      if (w.Apollo.isReady) return;
      w.Apollo.startTime = Date.now();
      if (!d.body) {
        await new Promise(r => d.addEventListener('DOMContentLoaded', r, { once: true }));
      }
      d.body.style.opacity = "0";
      d.body.style.transition = "opacity 0.5s var(--ease-default, cubic-bezier(.16, 1, .3, 1))";
      w.Apollo.log("Boot starting Apollo CDN v" + VERSION);

      const safeTimer = setTimeout(() => {
        if (!w.Apollo.isReady) {
          d.body.style.opacity = "1";
          console.warn("[Apollo] Timeout reached. Forcing safe finish.");
          w.Apollo.finishUp();
        }
      }, w.Apollo.config.timeout);

      try {
        const high = w.Apollo.config.assets.js_high || [];
        const jqueryEntry = high.find((e) => e.signal === 'jquery');
        const gsapEntry = high.find((e) => String(e.u || '').indexOf('gsap') > -1);
        const parallelEntries = high.filter((e) => e !== jqueryEntry && e !== gsapEntry);

        if (jqueryEntry) {
          await w.Apollo.loadPromise(jqueryEntry, true);
        }
        if (parallelEntries.length) {
          await Promise.allSettled(parallelEntries.map((entry) => w.Apollo.loadPromise(entry, false)));
        }
        if (gsapEntry) {
          await w.Apollo.loadPromise(gsapEntry, true);
        }

        const appPromises = w.Apollo.config.assets.js_app.map(u => w.Apollo.loadPromise(u, false));
        await Promise.allSettled(appPromises);
        clearTimeout(safeTimer);
        w.Apollo.finishUp();
      } catch (err) {
        console.error("[Apollo] Critical load failure:", err);
        w.Apollo.finishUp();
      }
    },

    loadedSet: new Set(),
    isReady: false,
    startTime: 0
  };

  // Inject preconnects
  const head = d.head || d.getElementsByTagName('head')[0] || d.documentElement;
  const preconnectOrigins = [
    'https://cdn.apollo.rio.br',
    'https://assets.apollo.rio.br',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  preconnectOrigins.forEach(origin => {
    const pc = d.createElement('link');
    pc.rel = 'preconnect';
    pc.href = origin;
    if (origin.includes('gstatic')) pc.crossOrigin = 'anonymous';
    head.appendChild(pc);
  });

  // Inject CSS
  if (!d.getElementById('cdn-apollo')) {
    const style = d.createElement('style');
    style.id = 'cdn-apollo';
    style.textContent = cssContent;
    if ("requestIdleCallback" in w) {
      w.requestIdleCallback(() => head.appendChild(style));
    } else {
      head.appendChild(style);
    }
  }

  // Inject font link (removed duplicate @import)
  if (!d.getElementById('apollo-fonts-css')) {
    const fontLink = d.createElement('link');
    fontLink.id = 'apollo-fonts-css';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Syne:wght@400..800&display=swap';
    fontLink.media = 'all';
    head.appendChild(fontLink);
  }

  // Set icon config
  w.apolloIconConfig = Object.assign({ cacheVersion: `v${VERSION}`, cdn: 'https://assets.apollo.rio.br' }, w.apolloIconConfig || {});

  // Start initialization
  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", () => w.Apollo.init(), { once: true });
  } else if (d.readyState === "complete") {
    w.Apollo.log("Late initialization detected");
    w.Apollo.init();
  } else {
    w.Apollo.init();
  }

})(window, document);


  // --- GSAP ANIMATIONS ---
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.reveal-up').forEach(elem => {
            gsap.fromTo(elem, 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 90%" } }
            );
        });

        // --- HORIZONTAL CRAZY CAROUSEL LOGIC ---
        // Progress 50 aligns it precisely in the middle on load!
        let progress = 50; 
        let startX = 0;
        let isDown = false;
        let isCarouselActive = true;

        const speedWheel = 0.05;
        const speedDrag = -0.15;

        const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)));

        const $items = document.querySelectorAll('.carousel-item');
        const $carousel = document.getElementById('ticketCarousel');

        // Initial setup for Carousel
        const animateCarousel = () => {
            progress = Math.max(0, Math.min(progress, 100));
            const activeFloat = (progress / 100) * Math.max(1, $items.length - 1);
            const activeIndex = Math.round(activeFloat);
            
            $items.forEach((item, index) => {
                const zIndex = getZindex([...$items], activeIndex)[index];
                item.style.setProperty('--zIndex', zIndex);
                item.style.setProperty('--active', index - activeFloat);
                item.style.setProperty('--abs-active', Math.abs(index - activeFloat));
            });
        };
        
        if ($items.length > 0) animateCarousel();

        // Carousel Click Events
        $items.forEach((item, i) => {
            item.addEventListener('click', (e) => {
                if(!isCarouselActive) return;
                // Prevent snapping if clicked on a button/interactive element inside the card
                if(e.target.closest('button') || e.target.closest('a')) return;
                
                progress = (i / Math.max(1, $items.length - 1)) * 100;
                animateCarousel();
            });
        });

        const handleWheel = e => {
            if (!isCarouselActive) return;
            if (!e.target.closest('.carousel')) return;
            e.preventDefault(); 
            const wheelProgress = e.deltaY * speedWheel;
            progress = progress + wheelProgress;
            animateCarousel();
        };

        const handleMouseMove = (e) => {
            if (!isCarouselActive || !isDown) return;
            const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
            const mouseProgress = (x - startX) * speedDrag;
            progress = progress + mouseProgress;
            startX = x;
            animateCarousel();
        };

        const handleMouseDown = e => {
            if (!isCarouselActive) return;
            if (!e.target.closest('.carousel')) return;
            isDown = true;
            startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        };

        const handleMouseUp = () => {
            isDown = false;
        };

        // Attach physics listeners
        $carousel.addEventListener('wheel', handleWheel, { passive: false });
        $carousel.addEventListener('mousedown', handleMouseDown);
        $carousel.addEventListener('touchstart', handleMouseDown, {passive: true});
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleMouseMove, {passive: true});
        window.addEventListener('touchend', handleMouseUp);

        // --- FILTER CHIP LOGIC ---
        const filterPills = document.querySelectorAll('#filterPills .filter-pill');
        
        filterPills.forEach((pill, idx) => {
            pill.addEventListener('click', () => {
                // Toggle active chip UI
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                // If "Todos" (Index 0) is selected: Turn ON Carousel
                if (idx === 0) {
                    isCarouselActive = true;
                    $carousel.classList.remove('grid-view');
                    $carousel.classList.add('carousel');
                    animateCarousel(); // Restore math transforms
                } 
                // Any other filter: Turn OFF Carousel, switch to Grid
                else {
                    isCarouselActive = false;
                    $carousel.classList.add('grid-view');
                    $carousel.classList.remove('carousel');
                    
                    // Nuke all inline styles so CSS grid takes full control
                    $items.forEach(item => {
                        item.style.transform = '';
                        item.style.opacity = '';
                        item.style.zIndex = '';
                        item.style.setProperty('--active', '');
                        item.style.setProperty('--abs-active', '');
                        item.style.setProperty('--zIndex', '');
                    });
                }
            });
        });

        // --- MODAL LOGIC ---
        const modal = document.getElementById('modal');
        const btns = document.querySelectorAll('.btn-open-modal');
        const consentCheck = document.getElementById('modal-consent-check');
        const proceedBtn = document.getElementById('btn-proceed-chat');
        
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                consentCheck.checked = false;
                proceedBtn.classList.remove('active');
                modal.classList.add('open');
            });
        });

        consentCheck.addEventListener('change', function() {
            if(this.checked) proceedBtn.classList.add('active');
            else proceedBtn.classList.remove('active');
        });

        function closeModal() {
            modal.classList.remove('open');
        }

        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeModal();
        });

        proceedBtn.addEventListener('click', () => {
            if(proceedBtn.classList.contains('active')) {
                proceedBtn.innerText = "Conectando...";
                setTimeout(() => {
                    closeModal();
                    proceedBtn.innerText = "INICIAR CHAT";
                }, 1000);
            }
        });