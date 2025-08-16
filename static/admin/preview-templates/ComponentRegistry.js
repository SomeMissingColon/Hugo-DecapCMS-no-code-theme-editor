/* ComponentRegistry.js — Universal component rendering for Hugo CMS Starter Kit */
const { h } = window;

/* ---------- Component Registry ----------------------------------------- */
export const ComponentRegistry = {
  'site-header': renderSiteHeader,
  'hero-section': renderHeroSection,
  'features-grid': renderFeaturesGrid,
  'page-content': renderPageContent,
  'site-footer': renderSiteFooter
};

/* ---------- Site Header Component -------------------------------------- */
function renderSiteHeader(data, theme) {
  return h("header", { className: "site-header" }, [
    h("div", { className: "container" }, [
      h("div", { className: "header-content" }, [
        // Logo and title section
        h("div", { className: "logo-section" }, [
          data.logo && h("img", { 
            className: "logo", 
            src: data.logo, 
            alt: `${data.title} Logo` 
          }),
          h("a", { className: "site-title", href: "#" }, data.title || "Your Site")
        ]),
        
        // Desktop navigation
        h("nav", { className: "main-nav" }, 
          (data.navigation || []).map((item, index) =>
            h("a", { 
              key: index, 
              className: "nav-link", 
              href: "#",
              title: item.name
            }, item.name)
          )
        ),
        
        // Mobile menu button
        data.show_mobile_menu && h("button", { 
          className: "mobile-menu-toggle",
          "aria-label": "Toggle menu"
        }, [
          h("span"),
          h("span"), 
          h("span")
        ])
      ])
    ])
  ]);
}

/* ---------- Hero Section Component ------------------------------------- */
function renderHeroSection(data, theme) {
  if (!data.enabled) return null;
  
  return h("section", { className: "hero" }, [
    h("div", { className: "container" }, [
      h("div", { className: "hero-content" }, [
        h("h1", { className: "hero-title" }, 
          data.title || "Welcome to Your Website"
        ),
        data.subtitle && h("p", { className: "hero-subtitle" }, data.subtitle),
        data.button && data.button.text && h("a", { 
          className: "btn btn-primary", 
          href: "#",
          onClick: (e) => e.preventDefault()
        }, data.button.text)
      ])
    ])
  ]);
}

/* ---------- Features Grid Component ------------------------------------ */
function renderFeaturesGrid(data, theme) {
  if (!data.enabled || !data.items || data.items.length === 0) return null;
  
  return h("section", { className: "features" }, [
    h("div", { className: "container" }, [
      data.title && h("h2", { className: "section-title" }, data.title),
      h("div", { className: "features-grid" }, 
        data.items.map((feature, index) =>
          h("div", { key: index, className: "feature-item" }, [
            feature.icon && h("div", { className: "feature-icon" }, feature.icon),
            h("h3", null, feature.title || `Feature ${index + 1}`),
            feature.description && h("p", null, feature.description)
          ])
        )
      )
    ])
  ]);
}

/* ---------- Page Content Component ------------------------------------- */
function renderPageContent(data, theme) {
  if (!data.content) return null;
  
  return h("section", { className: "content" }, [
    h("div", { className: "container" }, [
      h("div", { 
        className: "page-content",
        dangerouslySetInnerHTML: { __html: data.content }
      })
    ])
  ]);
}

/* ---------- Site Footer Component -------------------------------------- */
function renderSiteFooter(data, theme) {
  return h("footer", { className: "site-footer" }, [
    h("div", { className: "container" }, [
      h("div", { className: "footer-content" }, [
        h("div", { className: "footer-section" }, [
          h("h3", null, data.site_title || "Your Site"),
          data.description && h("p", null, data.description)
        ]),
        
        h("div", { className: "footer-section" }, [
          h("h4", null, "Quick Links"),
          h("ul", null,
            (data.navigation || []).map((item, index) =>
              h("li", { key: index },
                h("a", { href: "#" }, item.name)
              )
            )
          )
        ]),
        
        h("div", { className: "footer-section" }, [
          h("h4", null, "Contact"),
          h("p", null, "Get in touch with us for more information.")
        ])
      ]),
      
      h("div", { className: "footer-bottom" }, [
        h("p", null, `© ${new Date().getFullYear()} ${data.site_title || "Your Site"}. All rights reserved.`)
      ])
    ])
  ]);
}

/* ---------- Mobile Menu Component (Optional) --------------------------- */
export function renderMobileMenu(navigation, theme) {
  return [
    // Mobile menu overlay
    h("div", { 
      className: "mobile-menu-overlay",
      onClick: closeMobileMenu
    }),

    // Mobile menu panel
    h("div", { className: "mobile-menu-panel" }, [
      h("div", { className: "mobile-menu-header" }, [
        h("h2", { className: "mobile-menu-title" }, "Menu"),
        h("button", { 
          className: "mobile-menu-close",
          onClick: closeMobileMenu
        }, "×")
      ]),

      h("nav", { className: "mobile-menu-nav" }, [
        h("ul", { className: "mobile-nav-list" },
          (navigation || []).map((item, index) =>
            h("li", { key: index, className: "mobile-nav-item" },
              h("a", { 
                className: "mobile-nav-link", 
                href: "#",
                onClick: (e) => {
                  e.preventDefault();
                  closeMobileMenu();
                }
              }, item.name)
            )
          )
        )
      ])
    ])
  ];
}

/* ---------- Mobile Menu Utilities -------------------------------------- */
function closeMobileMenu() {
  const overlay = document.querySelector('.mobile-menu-overlay');
  const panel = document.querySelector('.mobile-menu-panel');
  if (overlay && panel) {
    overlay.classList.remove('active');
    panel.classList.remove('active');
    document.body.style.overflow = '';
  }
}