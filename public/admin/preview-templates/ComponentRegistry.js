/* ComponentRegistry.js — Universal component rendering for Hugo CMS Starter Kit */
const { h } = window;

/* ---------- Component Registry ----------------------------------------- */
export const ComponentRegistry = {
  'site-header': renderSiteHeader,
  'hero-section': renderHeroSection,
  'features-grid': renderFeaturesGrid,
  'page-content': renderPageContent,
  'site-footer': renderSiteFooter,
  'enhanced-hero': renderEnhancedHero,
  'enhanced-features': renderEnhancedFeatures,
  'about-section': renderAboutSection,
  'cta-section': renderCTASection,
  'testimonials-section': renderTestimonialsSection
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

/* ---------- Enhanced Content Component Renderers ---------------------- */

/* Enhanced Hero Section */
function renderEnhancedHero(data, theme) {
  if (!data.enabled) return null;

  const bg = data.background || {};
  const bgType = bg.type || 'gradient';
  
  // Generate background styles
  let heroStyle = {};
  let backgroundContent = [];
  
  if (bgType === 'gradient') {
    const gradient = bg.gradient || {};
    const style = gradient.style || 'linear-diagonal';
    const color1 = gradient.color1 || '#667eea';
    const color2 = gradient.color2 || '#764ba2';
    const color3 = gradient.color3;
    
    let gradientCSS = '';
    if (style === 'linear-lr') {
      gradientCSS = `linear-gradient(to right, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    } else if (style === 'linear-tb') {
      gradientCSS = `linear-gradient(to bottom, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    } else if (style === 'linear-diagonal') {
      gradientCSS = `linear-gradient(135deg, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    } else if (style === 'radial-center') {
      gradientCSS = `radial-gradient(circle at center, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    } else if (style === 'radial-corner') {
      gradientCSS = `radial-gradient(circle at top left, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    } else {
      gradientCSS = `linear-gradient(135deg, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    }
    
    heroStyle.background = gradientCSS;
  } else if (bgType === 'image' && bg.image?.src) {
    heroStyle.backgroundImage = `url(${bg.image.src})`;
    heroStyle.backgroundPosition = bg.image.position || 'center center';
    heroStyle.backgroundSize = bg.image.size || 'cover';
    heroStyle.backgroundRepeat = 'no-repeat';
    
    // Add overlay if enabled
    if (bg.image.overlay) {
      backgroundContent.push(
        h("div", { 
          className: "hero-overlay",
          style: { 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, ' + (bg.image.overlay_opacity || 0.5) + ')',
            zIndex: 1
          }
        })
      );
    }
  } else if (bgType === 'video' && bg.video?.src) {
    backgroundContent.push(
      h("div", { 
        className: "hero-video",
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          overflow: 'hidden'
        }
      }, [
        h("video", {
          autoPlay: bg.video.autoplay !== false,
          loop: bg.video.loop !== false,
          muted: true,
          playsInline: true,
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }
        }, [
          h("source", { src: bg.video.src, type: "video/mp4" }),
          bg.video.poster && h("img", { 
            src: bg.video.poster, 
            alt: "Hero background",
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }
          })
        ])
      ])
    );
    
    // Add overlay if enabled
    if (bg.video.overlay) {
      backgroundContent.push(
        h("div", { 
          className: "hero-overlay",
          style: { 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, ' + (bg.video.overlay_opacity || 0.6) + ')',
            zIndex: 1
          }
        })
      );
    }
  } else {
    // Fallback to theme colors
    heroStyle.background = `linear-gradient(135deg, ${theme.primary || '#2563eb'}, ${theme.accent || '#10b981'})`;
  }

  // Base hero styles
  Object.assign(heroStyle, {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    overflow: 'hidden'
  });

  return h("section", { 
    className: `hero hero-${bgType}`, 
    style: heroStyle 
  }, [
    ...backgroundContent,
    h("div", { className: "container" }, [
      h("div", { 
        className: "hero-content",
        style: {
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem'
        }
      }, [
        h("h1", { className: "hero-title" }, data.title),
        data.subtitle && h("h2", { className: "hero-subtitle" }, data.subtitle),
        data.description && h("div", { 
          className: "hero-description",
          dangerouslySetInnerHTML: { __html: data.description }
        }),
        h("div", { className: "hero-buttons" }, [
          data.primary_button.text && h("a", { 
            className: `btn btn-${data.primary_button.style}`,
            href: "#"
          }, data.primary_button.text),
          data.secondary_button.text && h("a", { 
            className: `btn btn-${data.secondary_button.style}`,
            href: "#"
          }, data.secondary_button.text)
        ])
      ])
    ])
  ]);
}

/* Enhanced Features Section */
function renderEnhancedFeatures(data, theme) {
  if (!data.enabled) return null;

  return h("section", { className: "features" }, [
    h("div", { className: "container" }, [
      h("div", { className: "section-header" }, [
        h("h2", { className: "section-title" }, data.title),
        data.subtitle && h("p", { className: "section-subtitle" }, data.subtitle)
      ]),
      h("div", { className: "features-grid" }, 
        data.items.map((item, index) =>
          h("div", { key: index, className: "feature-item" }, [
            h("div", { className: "feature-icon" }, item.icon),
            h("h3", { className: "feature-title" }, item.title),
            h("p", { className: "feature-description" }, item.description),
            item.link && item.link.text && h("a", { 
              className: "feature-link",
              href: "#"
            }, `${item.link.text} →`)
          ])
        )
      )
    ])
  ]);
}

/* About Section */
function renderAboutSection(data, theme) {
  if (!data.enabled) return null;

  return h("section", { className: "about" }, [
    h("div", { className: "container" }, [
      h("div", { className: "about-content" }, [
        h("div", { className: "about-text" }, [
          h("h2", { className: "section-title" }, data.title),
          h("div", { 
            className: "about-description",
            dangerouslySetInnerHTML: { __html: data.content }
          }),
          data.cta.text && h("a", { 
            className: "btn btn-primary",
            href: "#"
          }, data.cta.text)
        ]),
        data.image && h("div", { className: "about-image" }, [
          h("img", { src: data.image, alt: data.title })
        ])
      ])
    ])
  ]);
}

/* CTA Section */
function renderCTASection(data, theme) {
  if (!data.enabled) return null;

  return h("section", { className: `cta-section cta-${data.background}` }, [
    h("div", { className: "container" }, [
      h("div", { className: "cta-content" }, [
        h("h2", { className: "cta-title" }, data.title),
        data.subtitle && h("p", { className: "cta-subtitle" }, data.subtitle),
        h("div", { className: "cta-buttons" }, [
          data.primary_button.text && h("a", { 
            className: "btn btn-primary",
            href: "#"
          }, data.primary_button.text),
          data.secondary_button.text && h("a", { 
            className: "btn btn-secondary",
            href: "#"
          }, data.secondary_button.text)
        ])
      ])
    ])
  ]);
}

/* Testimonials Section */
function renderTestimonialsSection(data, theme) {
  if (!data.enabled) return null;

  return h("section", { className: "testimonials" }, [
    h("div", { className: "container" }, [
      h("h2", { className: "section-title" }, data.title),
      h("div", { className: "testimonials-grid" }, 
        data.items.map((item, index) =>
          h("div", { key: index, className: "testimonial-item" }, [
            h("blockquote", { className: "testimonial-quote" }, `"${item.quote}"`),
            h("div", { className: "testimonial-author" }, [
              item.photo && h("img", { 
                className: "testimonial-photo",
                src: item.photo,
                alt: item.name
              }),
              h("div", { className: "testimonial-info" }, [
                h("strong", { className: "testimonial-name" }, item.name),
                item.title && h("span", { className: "testimonial-title" }, item.title)
              ])
            ])
          ])
        )
      )
    ])
  ]);
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