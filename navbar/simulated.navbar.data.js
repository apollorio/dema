/**
 * simulated.navbar.data.js — Apollo Navbar v8
 * Mock data layer — injected into window.ApolloNavData.
 * Production replaces with REST API calls to apollo/v1.
 *
 * REMOVED: MESSAGES, NOTIFICATIONS (activities panel removed)
 * Profile is now login-only (no user data needed for unauthenticated state)
 */
(function () {
  'use strict';

  window.ApolloNavData = {

    /* ─── Navigation Links (aside + desktop sidebar) ─── */
    NAV_LINKS: [
      { label: 'Discover',     icon: 'ri-compass-3-line',     href: '#',            category: 'Explorar'        },
      { label: 'Events',       icon: 'ri-calendar-event-line',href: '#events',      category: 'Agenda & Shows'  },
      { label: 'DJs',          icon: 'ri-disc-line',          href: '#djs',         category: 'Artistas'        },
      { label: 'Locals',       icon: 'ri-map-pin-2-line',     href: '#local',       category: 'Casas Noturnas'  },
      { label: 'Classifieds',  icon: 'ri-price-tag-3-line',   href: '#classifieds', category: 'Anúncios'        },
      { label: 'Groups',       icon: 'ri-team-line',          href: '#groups',      category: 'Comunidades'     },
      { label: 'Statistics',   icon: 'ri-bar-chart-2-line',   href: '#statistics',  category: 'Métricas'        },
      { label: 'Journal',      icon: 'ri-quill-pen-line',     href: '#journal',     category: 'Editorial'       }
    ],

    /* ─── Apps ─── */
    APPS: [
      { label: 'Events',       icon: 'ri-calendar-event-line', href: '#events'                  },
      { label: 'DJs',          icon: 'ri-disc-line',           href: '#djs'                     },
      { label: 'Locals',       icon: 'ri-map-pin-2-line',      href: '#local'                   },
      { label: 'Groups',       icon: 'ri-team-line',           href: '#groups'                  },
      { label: 'Chat',         icon: 'ri-chat-3-line',         href: '#chat'                    },
      { label: 'Classifieds',  icon: 'ri-price-tag-3-line',    href: '#classifieds'             },
      { label: 'Favorites',    icon: 'ri-heart-3-line',        href: '#fav'                     },
      { label: 'Statistics',   icon: 'ri-bar-chart-2-line',    href: '#statistics'              },
      { label: 'Journal',      icon: 'ri-quill-pen-line',      href: '#journal'                 },
      { label: 'Maps',         icon: 'ri-road-map-line',       href: '#maps'                    },
      { label: 'Radio',        icon: 'ri-radio-line',          href: '#radio'                   },
      { label: 'Hub',          icon: 'ri-layout-grid-line',    href: '#hub'                     },
      { label: 'Suppliers',    icon: 'ri-store-2-line',        href: '#suppliers'               },
      { label: 'Documents',    icon: 'ri-file-text-line',      href: '#docs'                    },
      { label: 'Membership',   icon: 'ri-vip-crown-line',      href: '#membership'              },
      { label: 'Settings',     icon: 'ri-settings-3-line',     href: '#settings'                },
      { label: 'Dashboard',    icon: 'ri-dashboard-line',      href: '#dashboard', isNew: true  }
    ],

    /* ─── Profile (login state - no user data) ─── */
    PROFILE: {
      isLoggedIn: false
    },

    /* ─── Content Cards (simulated main content) ─── */
    CARDS: [
      { tag: 'Swiss Style',  title: 'Black + White + Orange', desc: 'Luxury grade design system following International Typographic Style principles.', isPrimary: true },
      { tag: 'Mobile First', title: 'Responsive by Default',  desc: 'Every component scales from 320px to 2560px with calculated breakpoints.'                        },
      { tag: 'Dark Mode',    title: 'Automatic Theme Switch',  desc: 'System-aware dark mode with orange+violet ambient gradients.'                                      },
      { tag: 'Panels',       title: '3 Burger Menus',          desc: 'Navigation, Apps, and Login — each with calculated desktop widths.'                                },
      { tag: 'Typography',   title: 'Space Grotesk + Mono',    desc: 'Swiss-inspired type stack with Syne for display headings.'                                         },
      { tag: 'Components',   title: 'Bento Grid System',       desc: 'Glassmorphic cards, liquid glass buttons, and staggered animations.'                               }
    ]
  };
})();
