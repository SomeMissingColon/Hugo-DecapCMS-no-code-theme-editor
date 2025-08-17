/* BlogPreview.js — Preview template for Hugo blog posts */
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

/* ---------- Blog Preview Component -------------------------------- */
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
      console.error('BLOG PREVIEW ERROR - Failed to load theme data:', error);
      this.setState({ 
        error: error.message, 
        loading: false,
        themeData: null
      });
    }
  },

  getBlogPostData() {
    const e = this.props.entry;
    const title = e?.getIn(['data', 'title']) || 'Blog Post Title';
    const description = e?.getIn(['data', 'description']) || '';
    const content = e?.getIn(['data', 'body']) || '';
    const date = e?.getIn(['data', 'date']) || new Date().toISOString();
    const image = e?.getIn(['data', 'image']);
    const tags = e?.getIn(['data', 'tags'])?.toJS?.() || e?.getIn(['data', 'tags']) || [];
    const categories = e?.getIn(['data', 'categories'])?.toJS?.() || e?.getIn(['data', 'categories']) || [];
    const draft = e?.getIn(['data', 'draft']) || false;
    
    return {
      title,
      description, 
      content,
      date,
      image: image ? this.props.getAsset?.(image) : null,
      tags: Array.isArray(tags) ? tags : [],
      categories: Array.isArray(categories) ? categories : [],
      draft
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
      
      .blog-featured-image {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
        border-radius: 0.5rem;
        margin-bottom: 2rem;
      }
      
      .blog-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        font-size: 0.875rem;
        color: var(--text);
        opacity: 0.7;
      }
      
      .blog-date {
        font-weight: 500;
      }
      
      .draft-indicator {
        background: #f59e0b;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
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
        h("div", { style: { marginBottom: '1rem', fontSize: '2rem' } }, "📝"),
        h("div", null, "Loading blog preview...")
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
        h("div", { style: { marginBottom: '0.5rem', fontWeight: '600' } }, "Failed to load blog preview"),
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
    const post = this.getBlogPostData();
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
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
                  h("h1", { className: "page-title" }, post.title),
                  post.description && h("p", { className: "page-description" }, post.description),
                  
                  // Blog meta info
                  h("div", { className: "blog-meta" }, [
                    h("span", { className: "blog-date" }, formattedDate),
                    post.draft && h("span", { className: "draft-indicator" }, "Draft")
                  ])
                ]),
                
                h("div", { className: "page-content" }, [
                  // Featured image
                  post.image && h("img", {
                    src: post.image,
                    alt: post.title,
                    className: "blog-featured-image"
                  }),
                  
                  // Blog content
                  h("div", { 
                    dangerouslySetInnerHTML: { 
                      __html: this.renderMarkdown(post.content) 
                    } 
                  })
                ]),
                
                // Tags and categories
                (post.tags.length > 0 || post.categories.length > 0) && h("div", { className: "page-tags" }, [
                  post.categories.length > 0 && h("div", { style: { marginBottom: '1rem' } }, [
                    h("strong", null, "Categories: "),
                    ...post.categories.map((cat, i) => 
                      h("span", { key: i, className: "tag" }, cat)
                    )
                  ]),
                  post.tags.length > 0 && h("div", null, [
                    h("strong", null, "Tags: "),
                    ...post.tags.map((tag, i) => 
                      h("span", { key: i, className: "tag" }, tag)
                    )
                  ])
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
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(?!<[h|p|c])/gim, '<p>')
      .replace(/(?!>)$/gim, '</p>');
  }
});