
/**
 * APOLLO::RIO DASHBOARD KERNEL
 * ═══════════════════════════════════════════════════════════════
 *   ⛔  DESIGN THEME REFERENCE — ALL CHARTS MUST COMPLY
 * ═══════════════════════════════════════════════════════════════
 *
 * amCharts 5 — Apollo production standard
 * (used by apollo-statistics, apollo-events, apollo-gestor)
 *
 * ✓ ALLOWED: Amber #FF9820, Coral #FF7A33, Sunset #FFA066,
 *            Gold #FFBF00, Grayscale #121214→#e4e4e7,
 *            Alert-red #e53935, Black, White
 * ✗ FORBIDDEN: Blue, Cyan, Sky, Indigo, Teal, Green, Purple
 *
 * Gradient fills: orange 100% at top → 0% transparent at X-axis
 *   (top: full primary opacity → bottom: fully transparent)
 *
 * Tooltips: dark card + white text + mix-blend-mode:difference
 * Bullets: peaks (▲ large), valleys (▼ inverted), regular (small)
 *
 * This file IS the reference implementation. Copy the pattern.
 */
const ApolloDashboard = (function() {
    'use strict';

    /* ═══════════════════════════════════════════════
       1. THEME MANAGER
       ═══════════════════════════════════════════════ */
    class ThemeManager {
        constructor() {
            this.DM_KEY = 'apollo-dark-mode';
            this.html = document.documentElement;
            this.dmToggle = document.getElementById('dm-toggle');
            this.init();
        }
        init() {
            let saved = null;
            try { saved = localStorage.getItem(this.DM_KEY); } catch(e) {}
            if (saved === null) {
                saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? '1' : '0';
            }
            this.apply(saved === '1', false);
            if (this.dmToggle) {
                this.dmToggle.addEventListener('change', (e) => this.apply(e.target.checked));
            }
        }
        apply(isDark, persist = true) {
            this.html.classList.toggle('dark-mode', isDark);
            if (this.dmToggle) this.dmToggle.checked = isDark;
            if (persist) {
                try { localStorage.setItem(this.DM_KEY, isDark ? '1' : '0'); } catch(e) {}
            }
            window.dispatchEvent(new CustomEvent('apolloThemeChanged', { detail: { isDark } }));
        }
    }

    /* ═══════════════════════════════════════════════
       2. CLOCK MANAGER
       ═══════════════════════════════════════════════ */
    class ClockManager {
        constructor(elId) {
            this.el = document.getElementById(elId);
            if (this.el) this.start();
        }
        start() {
            const tick = () => {
                this.el.textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
            };
            tick();
            setInterval(tick, 1000);
        }
    }

    /* ═══════════════════════════════════════════════
       3. INTERACTION MANAGER
       Off-canvas panels + dropdown menus.
       Panels start off-screen (CSS left:-100% / right:-100%).
       .show class slides them in. Click outside or
       overlay → close. Button icon morphs to ✕.
       ═══════════════════════════════════════════════ */
    class InteractionManager {
        constructor() {
            /* Icon pairs: default → active (morphed to close/X) */
            this.iconMap = {
                'btn-mobile-menu': { open: 'ri-menu-line',     close: 'ri-close-line' },
                'btn-activity':    { open: null, /* svg icon */ close: null }
            };
            this.toggles = [
                { btn: 'btn-apps',        menu: 'menu-app',        type: 'dropdown' },
                { btn: 'btn-profile',     menu: 'menu-profile',    type: 'dropdown' },
                { btn: 'btn-activity',    menu: 'activity-panel',  type: 'panel' },
                { btn: 'btn-mobile-menu', menu: 'sidebar',         type: 'panel' }
            ];
            this.overlay = document.getElementById('panel-overlay');
            this.init();
        }
        init() {
            document.addEventListener('click', (e) => this.handleGlobalClick(e));
            if (this.overlay) {
                this.overlay.addEventListener('click', () => this.closeAll());
            }
            /* Stop propagation inside menus/panels so clicks don't close them */
            this.toggles.forEach(t => {
                const menu = document.getElementById(t.menu);
                if (menu) menu.addEventListener('click', e => e.stopPropagation());
            });
        }
        closeAll() {
            this.toggles.forEach(t => {
                const menu = document.getElementById(t.menu);
                const btn  = document.getElementById(t.btn);
                if (menu) {
                    if (t.type === 'dropdown') menu.classList.remove('active');
                    if (t.type === 'panel')    menu.classList.remove('show');
                }
                if (btn) {
                    btn.classList.remove('active');
                    this._morphIcon(t.btn, false);
                }
            });
            if (this.overlay) this.overlay.classList.remove('show');
        }
        handleGlobalClick(e) {
            const toggle = this.toggles.find(t => {
                const btn = document.getElementById(t.btn);
                return btn && (btn.contains(e.target) || btn === e.target);
            });

            if (toggle) {
                const btn  = document.getElementById(toggle.btn);
                const menu = document.getElementById(toggle.menu);
                const isActive = menu.classList.contains('active') || menu.classList.contains('show');

                this.closeAll();

                if (!isActive) {
                    if (toggle.type === 'dropdown') menu.classList.add('active');
                    if (toggle.type === 'panel') {
                        menu.classList.add('show');
                        if (this.overlay) this.overlay.classList.add('show');
                    }
                    btn.classList.add('active');
                    this._morphIcon(toggle.btn, true);
                }
                e.stopPropagation();
            } else if (
                !e.target.closest('.theme-toggle-row') &&
                !e.target.closest('.dm-toggle') &&
                !e.target.closest('.tab-list')
            ) {
                this.closeAll();
            }
        }
        /** Swap RemixIcon class for open/close morph */
        _morphIcon(btnId, toClose) {
            const map = this.iconMap[btnId];
            if (!map || !map.open) return;
            const btn = document.getElementById(btnId);
            if (!btn) return;
            const icon = btn.querySelector('i');
            if (!icon) return;
            icon.classList.remove(toClose ? map.open : map.close);
            icon.classList.add(toClose ? map.close : map.open);
        }
    }

    /* ═══════════════════════════════════════════════
       4. CHART MANAGER — amCharts 5
       ═══════════════════════════════════════════════
       ⛔ BLUE IS FORBIDDEN — ZERO TOLERANCE.
       All series, fills, strokes, tooltips → amber/orange/grayscale ONLY.
       Custom Apollo theme injected AFTER Animated to kill blue defaults.

       Gradient: orange @0.35 opacity → 0 @99% height (last 1% = dead).
       Peaks: ▲ large filled dot (r:5.5)
       Valleys: ▼ inverted ring (r:4.5, white fill, orange stroke)
       Regular: small dot (r:3)
       Tooltip: black card, white text, mix-blend-mode:difference via CSS.
       ═══════════════════════════════════════════════ */
    class ChartManager {
        constructor(containerId) {
            this.containerId = containerId;
            this.root = null;
            if (document.getElementById(containerId)) {
                this._waitAndInit();
                window.addEventListener('apolloThemeChanged', () => this._rebuild());
            }
        }
        _waitAndInit() {
            const check = () => {
                if (typeof am5 !== 'undefined' && typeof am5xy !== 'undefined') {
                    this.init();
                } else {
                    setTimeout(check, 150);
                }
            };
            check();
        }
        init() {
            if (this.root) { this.root.dispose(); this.root = null; }

            const el = document.getElementById(this.containerId);
            if (!el) return;

            /* Convert <canvas> to <div> — canvas is Chart.js legacy */
            if (el.tagName === 'CANVAS') {
                const div = document.createElement('div');
                div.id = this.containerId;
                div.style.width = '100%';
                div.style.height = '100%';
                el.parentNode.replaceChild(div, el);
            }

            var root = am5.Root.new(this.containerId);
            this.root = root;

            var isDark = document.documentElement.classList.contains('dark-mode');

            /* ═══ CUSTOM THEME: KILL BLUE — force amber/orange/grayscale ═══
             * This theme is applied AFTER Animated so it OVERRIDES the
             * default blue ColorSet. Every series auto-picks from this list.
             */
            var apolloTheme = am5.Theme.new(root);
            apolloTheme.rule('ColorSet').setAll({
                colors: [
                    am5.color(0xFF9820),  /* Primary amber */
                    am5.color(0xFF7A33),  /* Coral */
                    am5.color(0xFFA066),  /* Sunset light */
                    am5.color(0xFFBF00),  /* Gold */
                    am5.color(0xe53935),  /* Alert red — matches :root --alert-red:#e53935 */
                    am5.color(0x121214),  /* Black */
                    am5.color(0x777777),  /* Mid gray */
                    am5.color(0xDDDDDD)   /* Light gray */
                ],
                reuse: true
            });

            /* Apply Animated FIRST, then Apollo override on top → no blue leaks */
            root.setThemes([
                am5themes_Animated.new(root),
                apolloTheme
            ]);

            /* Hide watermark (dev mode) */
            if (root._logo) { try { root._logo.dispose(); } catch(e) {} }

            /* ── XY Chart ── */
            var chart = root.container.children.push(am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: 'none',
                wheelY: 'none',
                paddingLeft: 0,
                paddingRight: 0
            }));

            /* Cursor: amber dashed crosshair, Y hidden */
            var cursor = chart.set('cursor', am5xy.XYCursor.new(root, {
                behavior: 'none'
            }));
            cursor.lineX.setAll({
                stroke: am5.color(0xFF9820),
                strokeOpacity: 0.3,
                strokeDasharray: [4, 4]
            });
            cursor.lineY.set('visible', false);

            /* ── Data ── */
            var chartData = (typeof ApolloSimData !== 'undefined' && ApolloSimData.mainChart)
                ? ApolloSimData.mainChart
                : [
                    {month:'Jan',v:62},{month:'Fev',v:48},{month:'Mar',v:84},{month:'Abr',v:33},
                    {month:'Mai',v:39},{month:'Jun',v:58},{month:'Jul',v:27},{month:'Ago',v:82},
                    {month:'Set',v:44},{month:'Out',v:53},{month:'Nov',v:78},{month:'Dez',v:55}
                ];

            /* ── Detect PEAKS (▲) and VALLEYS (▼) for marked bullets ──
             * Peaks: local max (curr > both neighbors)
             * Valleys: local min (curr < both neighbors)
             * First/last points: included if they are extremes vs their single neighbor
             */
            var peakValleys = {};
            for (var i = 0; i < chartData.length; i++) {
                var prev = i > 0 ? chartData[i - 1].v : Infinity;
                var curr = chartData[i].v;
                var next = i < chartData.length - 1 ? chartData[i + 1].v : Infinity;

                if (curr >= prev && curr >= next && (curr > prev || curr > next)) {
                    peakValleys[chartData[i].month] = 'peak';
                }

                prev = i > 0 ? chartData[i - 1].v : -Infinity;
                next = i < chartData.length - 1 ? chartData[i + 1].v : -Infinity;

                if (curr <= prev && curr <= next && (curr < prev || curr < next)) {
                    peakValleys[chartData[i].month] = 'valley';
                }
            }

            /* ── Axes ── */
            var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 40 });
            xRenderer.labels.template.setAll({
                fontFamily: 'Space Mono, monospace',
                fontSize: 11,
                fill: am5.color(isDark ? 0xFFFFFF : 0x121214),
                fillOpacity: 0.45
            });
            /* X-axis grid lines for measurement reference */
            xRenderer.grid.template.setAll({
                visible: true,
                stroke: am5.color(isDark ? 0xFFFFFF : 0x000000),
                strokeOpacity: isDark ? 0.06 : 0.05,
                strokeDasharray: [2, 4]
            });

            var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: 'month',
                renderer: xRenderer
            }));
            xAxis.data.setAll(chartData);

            var yRenderer = am5xy.AxisRendererY.new(root, {});
            yRenderer.labels.template.setAll({
                fontFamily: 'Space Mono, monospace',
                fontSize: 11,
                fill: am5.color(isDark ? 0xFFFFFF : 0x121214),
                fillOpacity: 0.45
            });
            /* ── Grid lines inside painted area for precise measurement ── */
            yRenderer.grid.template.setAll({
                stroke: am5.color(isDark ? 0xFFFFFF : 0x000000),
                strokeOpacity: isDark ? 0.12 : 0.10,
                strokeDasharray: [3, 3]
            });

            var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: yRenderer,
                min: 0
            }));

            /* Bind cursor to X axis */
            cursor.set('xAxis', xAxis);

            /* ── Series: SmoothedXLineSeries ──
             * FORCE stroke + fill to amber. No auto-color from theme
             * (theme ColorSet is fallback safety, explicit is primary).
             */
            var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
                name: 'Applications',
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: 'v',
                categoryXField: 'month',
                stroke: am5.color(0xFF9820),
                fill: am5.color(0xFF9820),
                tooltip: am5.Tooltip.new(root, {
                    labelText: '{categoryX}: {valueY}',
                    getFillFromSprite: false,
                    autoTextColor: false
                })
            }));

            /* Stroke: sunset amber — explicit, no blue */
            series.strokes.template.setAll({
                strokeWidth: 2.5,
                stroke: am5.color(0xFF9820)
            });

            /* ── Fill gradient: primary 100% at top → 0% transparent at X-axis ──
             * Linear gradient (rotation:90 = top→bottom):
             *   top:    orange @ 100% opacity (full primary)
             *   bottom: orange @   0% opacity (fully transparent at X-axis)
             */
            series.fills.template.setAll({
                visible: true,
                fillOpacity: 1,
                fill: am5.LinearGradient.new(root, {
                    stops: [
                        { color: am5.color(0xFF9820), opacity: 1,    offset: 0 },
                        { color: am5.color(0xFF9820), opacity: 0.55, offset: 0.35 },
                        { color: am5.color(0xFF9820), opacity: 0.2,  offset: 0.65 },
                        { color: am5.color(0xFF9820), opacity: 0,    offset: 1 }
                    ],
                    rotation: 90
                })
            });

            /* ── Bullets: marked peaks & valleys ──
             * Peak (▲): large filled amber circle (r:5.5, white stroke)
             * Valley (▼): inverted ring (r:4.5, white fill, amber stroke)
             * Regular: subtle small dot (r:3)
             */
            series.bullets.push(function(root, _series, dataItem) {
                var cat = dataItem.get('categoryX');
                var type = peakValleys[cat] || 'normal';
                var bgColor = isDark ? 0x121214 : 0xFFFFFF;

                var radius, fillColor, strokeColor, strokeW;

                if (type === 'peak') {
                    radius = 5.5;
                    fillColor = am5.color(0xFF9820);
                    strokeColor = am5.color(bgColor);
                    strokeW = 2.5;
                } else if (type === 'valley') {
                    radius = 4.5;
                    fillColor = am5.color(bgColor);
                    strokeColor = am5.color(0xFF9820);
                    strokeW = 2;
                } else {
                    radius = 3;
                    fillColor = am5.color(0xFF9820);
                    strokeColor = am5.color(bgColor);
                    strokeW = 1.5;
                }

                return am5.Bullet.new(root, {
                    sprite: am5.Circle.new(root, {
                        radius: radius,
                        fill: fillColor,
                        stroke: strokeColor,
                        strokeWidth: strokeW
                    })
                });
            });

            /* ── Tooltip: dark card, white text ──
             * CSS handles mix-blend-mode:difference on .am5-tooltip-container
             * API handles canvas-rendered tooltip colors as fallback.
             */
            var tooltip = series.get('tooltip');
            if (tooltip) {
                tooltip.get('background').setAll({
                    fill: am5.color(0x121214),
                    fillOpacity: 0.92,
                    cornerRadius: 8,
                    strokeOpacity: 0
                });
                tooltip.label.setAll({
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 12,
                    fontWeight: '700',
                    fill: am5.color(0xFFFFFF)
                });
            }

            series.data.setAll(chartData);

            /* ── Scrollbar / Minimap — collapsed on load ──
             * Shows a minimap preview of the series data.
             * Starts with range fully collapsed (narrow selection)
             * so all bars appear "closed". User can drag to expand.
             */
            var scrollbar = chart.set('scrollbarX', am5.Scrollbar.new(root, {
                orientation: 'horizontal',
                height: 40
            }));

            /* Style scrollbar grips & background to match Apollo theme */
            scrollbar.get('background').setAll({
                fill: am5.color(isDark ? 0x222222 : 0xF0F0F0),
                fillOpacity: 0.6,
                cornerRadiusTR: 4,
                cornerRadiusTL: 4,
                cornerRadiusBR: 4,
                cornerRadiusBL: 4
            });

            var startGrip = scrollbar.startGrip;
            var endGrip = scrollbar.endGrip;
            [startGrip, endGrip].forEach(function(grip) {
                grip.get('icon').set('visible', false);
                grip.get('background').setAll({
                    fill: am5.color(0xFF9820),
                    fillOpacity: 0.7,
                    width: 14,
                    height: 24,
                    cornerRadiusTR: 4,
                    cornerRadiusTL: 4,
                    cornerRadiusBR: 4,
                    cornerRadiusBL: 4
                });
            });

            /* Thumb (selected range area) */
            scrollbar.thumb.setAll({
                fill: am5.color(0xFF9820),
                fillOpacity: 0.12
            });

            /* ── Minimap series inside scrollbar ── */
            var sbChart = scrollbar.chart;
            var sbXAxis = sbChart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: 'month',
                renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 })
            }));
            sbXAxis.get('renderer').labels.template.set('visible', false);
            sbXAxis.get('renderer').grid.template.set('visible', false);
            sbXAxis.data.setAll(chartData);

            var sbYAxis = sbChart.yAxes.push(am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
                min: 0
            }));
            sbYAxis.get('renderer').labels.template.set('visible', false);
            sbYAxis.get('renderer').grid.template.set('visible', false);

            var sbSeries = sbChart.series.push(am5xy.SmoothedXLineSeries.new(root, {
                xAxis: sbXAxis,
                yAxis: sbYAxis,
                valueYField: 'v',
                categoryXField: 'month',
                stroke: am5.color(0xFF9820),
                fill: am5.color(0xFF9820)
            }));
            sbSeries.fills.template.setAll({
                visible: true,
                fillOpacity: 0.15,
                fill: am5.color(0xFF9820)
            });
            sbSeries.strokes.template.setAll({
                strokeWidth: 1,
                stroke: am5.color(0xFF9820),
                strokeOpacity: 0.5
            });
            sbSeries.data.setAll(chartData);

            /* ── Collapse minimap on load: start scrollbar fully closed ──
             * Both grips at the left edge → user must drag to reveal data range.
             * This makes all minimap bars appear "closed/collapsed" on page load.
             */
            series.events.on('datavalidated', function() {
                scrollbar.set('start', 0);
                scrollbar.set('end', 0.35);
            });

            /* Animate in */
            chart.appear(800, 100);
            series.appear(800);
        }
        _rebuild() {
            this.init();
        }
    }

    /* ═══════════════════════════════════════════════
       BOOT CONTROLLER
       ═══════════════════════════════════════════════ */
    return {
        boot: function() {
            try {
                new ThemeManager();
                new ClockManager('digital-clock');
                new InteractionManager();
                new ChartManager('mainChart');
            } catch(e) {
                console.error('Apollo Kernel Boot Error:', e);
            }
        }
    };
})();

/* Launch on DOM ready */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ApolloDashboard.boot);
} else {
    ApolloDashboard.boot();
}