/* ConfigPreview.js — Preview template for Hugo site configuration */
const { createClass, h } = window;

/* ---------- Google Fonts helpers ------------------------------------ */
const urlV2 = (f) =>
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@300;400;500;600;700&display=swap`;

const preconnect = [
  h("link", { key: "pc1", rel: "preconnect", href: "https://fonts.googleapis.com" }),
  h("link", {
    key: "pc2",
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  }),
];

const gsheet = (fam) =>
  h("link", {
    key: fam,
    rel: "stylesheet",
    href: urlV2(fam),
  });

/* ---------- Config Preview Component -------------------------------- */
export default createClass({
  getInitialState() {
    return { 
      themeData: null, 
      loading: true,
      error: null
    };
  },

  async componentDidMount() {
    await this.fetchThemeData();
  },

  async componentDidUpdate(prevProps) {
    if (this.props.entry !== prevProps.entry) {
      this.forceUpdate();
    }
  },

  async fetchThemeData() {
    try {
      this.setState({ loading: true, error: null });
      
      const cacheBuster = Date.now();
      const response = await fetch(`/cms-data.json?v=${cacheBuster}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.setState({ themeData: data.theme, loading: false });
    } catch (error) {
      console.error('CONFIG PREVIEW ERROR - Failed to load theme data:', error);
      this.setState({ 
        error: error.message, 
        loading: false,
        themeData: null
      });
    }
  },

  getConfigData() {
    const e = this.props.entry;
    const title = e?.getIn(['data', 'title']) || 'Hugo CMS Starter Kit';
    const baseURL = e?.getIn(['data', 'baseURL']) || 'https://yoursite.com';
    const languageCode = e?.getIn(['data', 'languageCode']) || 'en-us';
    const params = e?.getIn(['data', 'params'])?.toJS?.() || e?.getIn(['data', 'params']) || {};
    
    return {
      title,
      baseURL,
      languageCode,
      params: {
        description: params.description || 'A modern, customizable website template',
        author: params.author || 'Your Name',
        keywords: params.keywords || 'hugo, cms, website, template'
      }
    };
  },

  generateThemeCSS(theme) {
    if (!theme) return '';
    
    const { bg, text, primary, accent, font } = theme;
    
    return `
      :root {
        --bg: ${bg || '#ffffff'};
        --text: ${text || '#333333'};
        --primary: ${primary || '#2563eb'};
        --accent: ${accent || '#10b981'};
        --font-family: '${font || 'Inter'}', sans-serif;
        --bg-secondary: ${bg || '#ffffff'}f0;
        --border: ${primary || '#2563eb'}20;
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      
      body {
        font-family: var(--font-family);
        background-color: var(--bg);
        color: var(--text);
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      
      .preview-container {
        min-height: 100vh;
        background-color: var(--bg);
      }
      
      .config-info {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 2rem;
      }
      
      .config-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
      }
      
      .config-item:last-child {
        border-bottom: none;
      }
      
      .config-label {
        font-weight: 600;
        color: var(--primary);
      }
      
      .config-value {
        color: var(--text);
        opacity: 0.8;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.875rem;
      }
      
      @import url('/css/main.css');
    `;
  },

  renderLoadingState() {
    return h("div", { 
      style: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px',
        fontFamily: 'Inter, sans-serif',
        color: '#666'
      } 
    }, [
      h("div", { style: { textAlign: 'center' } }, [
        h("div", { style: { marginBottom: '1rem', fontSize: '2rem' } }, "⚙️"),
        h("div", null, "Loading config preview...")
      ])
    ]);
  },

  renderErrorState() {
    return h("div", { 
      style: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px',
        fontFamily: 'Inter, sans-serif',
        color: '#dc2626',
        textAlign: 'center',
        padding: '2rem'
      } 
    }, [
      h("div", null, [
        h("div", { style: { marginBottom: '1rem', fontSize: '2rem' } }, "⚠️"),
        h("div", { style: { marginBottom: '0.5rem', fontWeight: '600' } }, "Failed to load config preview"),
        h("div", { style: { fontSize: '0.875rem', opacity: 0.7 } }, 
          "Error: " + this.state.error
        )
      ])
    ]);
  },

  render() {
    if (this.state.loading) {
      return this.renderLoadingState();
    }

    if (this.state.error) {
      return this.renderErrorState();
    }

    const theme = this.state.themeData || {};
    const config = this.getConfigData();
    
    const links = [
      ...preconnect,
      gsheet(theme.font || 'Inter'),
    ];

    const css = this.generateThemeCSS(theme);
    
    return h(
      "div",
      null,
      [
        ...links,
        h("style", null, css),

        h("div", { 
          className: "preview-container" 
        }, [
          // Site Header - showing how config affects title
          h("header", { className: "site-header" }, [
            h("div", { className: "container" }, [
              h("div", { className: "header-content" }, [
                h("div", { className: "logo-section" }, [
                  h("a", { href: "/", className: "site-title" }, config.title)
                ]),
                h("nav", { className: "main-nav" }, 
                  (theme.nav || []).map((item, i) => 
                    h("a", { 
                      key: i, 
                      href: item.url, 
                      className: "nav-link" 
                    }, item.name)
                  )
                )
              ])
            ])
          ]),
          
          // Main Content - showing config preview
          h("main", null, [
            h("div", { className: "single-page" }, [
              h("div", { className: "container" }, [
                h("div", { className: "page-header" }, [
                  h("h1", { className: "page-title" }, "⚙️ Site Configuration Preview"),
                  h("p", { className: "page-description" }, "See how your site configuration affects the website appearance")
                ]),
                
                h("div", { className: "page-content" }, [
                  h("div", { className: "config-info" }, [
                    h("h2", null, "Site Settings"),
                    
                    h("div", { className: "config-item" }, [
                      h("span", { className: "config-label" }, "Site Title"),
                      h("span", { className: "config-value" }, config.title)
                    ]),
                    
                    h("div", { className: "config-item" }, [
                      h("span", { className: "config-label" }, "Base URL"),
                      h("span", { className: "config-value" }, config.baseURL)
                    ]),
                    
                    h("div", { className: "config-item" }, [
                      h("span", { className: "config-label" }, "Language"),
                      h("span", { className: "config-value" }, config.languageCode)
                    ]),
                    
                    h("div", { className: "config-item" }, [
                      h("span", { className: "config-label" }, "Description"),
                      h("span", { className: "config-value" }, config.params.description)
                    ]),
                    
                    h("div", { className: "config-item" }, [
                      h("span", { className: "config-label" }, "Author"),
                      h("span", { className: "config-value" }, config.params.author)
                    ]),
                    
                    h("div", { className: "config-item" }, [
                      h("span", { className: "config-label" }, "Keywords"),
                      h("span", { className: "config-value" }, config.params.keywords)
                    ])
                  ]),
                  
                  h("div", { style: { marginTop: '2rem' } }, [
                    h("h3", null, "What This Affects"),
                    h("ul", null, [
                      h("li", null, `The site title "${config.title}" appears in the header and page titles`),
                      h("li", null, `The base URL "${config.baseURL}" is used for canonical URLs and sitemaps`),
                      h("li", null, `The description "${config.params.description}" appears in search engine results`),
                      h("li", null, `The author "${config.params.author}" appears in meta tags and RSS feeds`),
                      h("li", null, `The keywords "${config.params.keywords}" help with SEO optimization`)
                    ])
                  ])
                ])
              ])
            ])
          ]),
          
          // Footer - showing how config affects footer
          h("footer", { className: "site-footer" }, [
            h("div", { className: "container" }, [
              h("div", { className: "footer-content" }, [
                h("div", { className: "footer-section" }, [
                  h("h3", null, config.title),
                  h("p", null, config.params.description)
                ]),
                h("div", { className: "footer-section" }, [
                  h("h4", null, "Contact"),
                  h("p", null, `Created by ${config.params.author}`)
                ])
              ]),
              h("div", { className: "footer-bottom" }, [
                h("p", null, `© 2025 ${config.title}. All rights reserved.`)
              ])
            ])
          ])
        ])
      ]
    );
  }
});