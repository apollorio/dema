/**
 * APOLLO::RIO — Simulated Dashboard Data
 *
 * Provides realistic mock data for the dashboard charts.
 * Consumed by dashboard.apollo.js ChartManager via window.ApolloSimData.
 *
 * Chart library: amCharts 5 (Apollo production standard).
 * Color palette: sunset coral/amber (#FF9820, #FF7A33) + grayscale (#121214→#e4e4e7).
 * All gradient fills fade to 100% transparent at the tail edge.
 *
 * @package Apollo\Designs\Dashboard
 */
;(function(W) {
    'use strict';

    W.ApolloSimData = {

        /* ═══ Main line chart — "Top Active Jobs" (12 months) ═══
         * Sunset amber stroke, gradient fill → transparent end.
         */
        mainChart: [
            { month: 'Jan', v: 62 },
            { month: 'Fev', v: 48 },
            { month: 'Mar', v: 84 },
            { month: 'Abr', v: 33 },
            { month: 'Mai', v: 39 },
            { month: 'Jun', v: 58 },
            { month: 'Jul', v: 27 },
            { month: 'Ago', v: 82 },
            { month: 'Set', v: 44 },
            { month: 'Out', v: 53 },
            { month: 'Nov', v: 78 },
            { month: 'Dez', v: 55 }
        ],

        /* ═══ SVG donut stats (rendered via inline SVG, not amCharts) ═══ */
        donutStats: {
            applications: { value: '20.5K', pct: 80 },
            shortlisted:  { value: '5.5K',  pct: 40 },
            onHold:       { value: '1.2K',  pct: 15 }
        },

        /* ═══ Acquisitions stacked bar breakdown ═══
         * Colors: sunset coral (applications), black (shortlisted),
         * gray (on-hold), red-alert (rejected).
         */
        acquisitions: {
            applications: 64,
            shortlisted:  18,
            onHold:       10,
            rejected:      8
        },

        /* ═══ New Applicants list ═══ */
        applicants: [
            { name: 'Emma Ray',     role: 'Product Designer', img: 'https://images.unsplash.com/photo-1587628604439-3b9a0aa7a163?auto=format&fit=crop&w=150&q=80' },
            { name: 'Ricky James',  role: 'IOS Developer',    img: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?auto=format&fit=crop&w=150&q=80' },
            { name: 'Julia Wilson', role: 'UI Developer',     img: 'https://images.unsplash.com/photo-1450297350677-623de575f31c?auto=format&fit=crop&w=150&q=80' }
        ],

        /* ═══ Messages sidebar ═══ */
        messages: [
            { name: 'Eric Clampton', text: 'Have you planned any deadline for this?',                img: 'https://images.unsplash.com/photo-1562159278-1253a58da141?auto=format&fit=crop&w=150&q=80' },
            { name: 'Jess Flax',     text: 'Can we schedule another meeting for next thursday?',     img: 'https://images.unsplash.com/photo-1604004555489-723a93d6ce74?auto=format&fit=crop&w=150&q=80' },
            { name: 'Pam Halpert',   text: 'The candidate has been shortlisted.',                     img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' }
        ],

        /* ═══ Activity feed ═══ */
        activity: [
            { icon: 'ri-error-warning-line', color: 'var(--alert-red)', html: 'Your plan expires in <strong>3 days.</strong>',                                          link: 'Renew Now' },
            { icon: 'ri-file-add-line',      color: 'var(--primary)',   html: 'There are <strong>3 new applications</strong> for <strong>UI Developer</strong>',         link: null },
            { icon: 'ri-close-circle-line',   color: 'var(--muted)',     html: 'Your teammate, Wade Wilson closed the job post of <strong>IOS Developer</strong>',        link: null },
            { icon: 'ri-draft-line',          color: 'var(--txt-heading)', html: 'You have drafted a job post for <strong>HR Specialist</strong>',                        link: 'Complete Now' }
        ]
    };

})(window);
