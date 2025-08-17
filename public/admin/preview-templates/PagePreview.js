/* PagePreview.js — Preview template for Hugo pages (About, Services, Contact) */
import { ComponentRegistry } from './ComponentRegistry.js';

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

/* ---------- Page Preview Component -------------------------------- */
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
      console.error('PAGE PREVIEW ERROR - Failed to load theme data:', error);
      this.setState({ 
        error: error.message, 
        loading: false,
        themeData: null
      });
    }
  },

  getPageData() {
    const e = this.props.entry;
    const title = e?.getIn(['data', 'title']) || 'Page Title';
    const description = e?.getIn(['data', 'description']) || '';
    const content = e?.getIn(['data', 'body']) || '';
    
    return {
      title,
      description, 
      content
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
        h("div", { style: { marginBottom: '1rem', fontSize: '2rem' } }, "📄"),
        h("div", null, "Loading page preview...")
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
        h("div", { style: { marginBottom: '0.5rem', fontWeight: '600' } }, "Failed to load page preview"),
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
    const page = this.getPageData();
    
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
          // Site Header
          h("header", { className: "site-header" }, [
            h("div", { className: "container" }, [
              h("div", { className: "header-content" }, [
                h("div", { className: "logo-section" }, [
                  h("a", { href: "/", className: "site-title" }, theme.site_title || "Your Site Name")
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
          
          // Main Content
          h("main", null, [
            h("div", { className: "single-page" }, [
              h("div", { className: "container" }, [
                h("div", { className: "page-header" }, [
                  h("h1", { className: "page-title" }, page.title),
                  page.description && h("p", { className: "page-description" }, page.description)
                ]),
                h("div", { className: "page-content" }, [
                  h("div", { 
                    dangerouslySetInnerHTML: { 
                      __html: this.renderMarkdown(page.content) 
                    } 
                  })
                ])
              ])
            ])
          ]),
          
          // Footer
          h("footer", { className: "site-footer" }, [
            h("div", { className: "container" }, [
              h("div", { className: "footer-content" }, [
                h("div", { className: "footer-section" }, [
                  h("h3", null, theme.site_title || "Your Site"),
                  h("p", null, "A professional website powered by Hugo CMS")
                ])
              ]),
              h("div", { className: "footer-bottom" }, [
                h("p", null, `© 2025 ${theme.site_title || "Your Site"}. All rights reserved.`)
              ])
            ])
          ])
        ])
      ]
    );
  },

  renderMarkdown(content) {
    if (!content) return '';
    
    // Simple markdown to HTML conversion for preview
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(?!<[h|p])/gim, '<p>')
      .replace(/(?!>)$/gim, '</p>');
  }
});