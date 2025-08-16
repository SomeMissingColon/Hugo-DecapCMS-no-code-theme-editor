/* UniversalPreview.js — Universal preview template for Hugo CMS Starter Kit */
import { ComponentRegistry, renderMobileMenu } from './ComponentRegistry.js';

const { createClass, h } = window;

/* ---------- Google Fonts helpers ------------------------------------ */
const urlV2 = (f) =>
  `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@300;400;500;600;700&display=swap`;
const urlV1 = (f) =>
  `https://fonts.googleapis.com/css?family=${encodeURIComponent(f)}:300,400,500,600,700&display=swap`;

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
    onError: (e) => {
      e.target.onerror = null;
      e.target.href = urlV1(fam);
    },
  });

/* ---------- Universal Preview Component -------------------------------- */
export default createClass({
  getInitialState() {
    return { 
      layoutData: null, 
      loading: true,
      error: null
    };
  },

  async componentDidMount() {
    await this.fetchLayoutData();
  },

  async componentDidUpdate(prevProps) {
    // Re-fetch when entry changes
    if (this.props.entry !== prevProps.entry) {
      await this.fetchLayoutData();
    }
  },

  async fetchLayoutData() {
    try {
      this.setState({ loading: true, error: null });
      
      // Fetch the Hugo-generated layout data
      const response = await fetch('/cms-data.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const layoutData = await response.json();
      
      // Validate the data structure
      if (!layoutData.layout || !layoutData.layout.sections) {
        throw new Error('Invalid layout data structure');
      }
      
      this.setState({ layoutData, loading: false });
      console.log('Successfully loaded universal layout data:', layoutData);
    } catch (error) {
      console.error('UNIVERSAL PREVIEW ERROR - Failed to load layout data:', error);
      this.setState({ 
        error: error.message, 
        loading: false,
        layoutData: null
      });
    }
  },

  getThemeData() {
    const e = this.props.entry;
    const layoutTheme = this.state.layoutData?.theme || {};
    
    // Extract nested color/typography data from CMS structure
    const colors = e?.getIn(['data', 'colors']) || {};
    const typography = e?.getIn(['data', 'typography']) || {};
    const branding = e?.getIn(['data', 'branding']) || {};
    
    return {
      bg: colors.bg || layoutTheme.bg || '#ffffff',
      text: colors.text || layoutTheme.text || '#333333',
      primary: colors.primary || layoutTheme.primary || '#2563eb',
      accent: colors.accent || layoutTheme.accent || '#10b981',
      font: typography.font || layoutTheme.font || 'Inter',
      site_title: branding.site_title || layoutTheme.site_title || 'Your Site',
      logo: this.getLogo()
    };
  },

  getLogo() {
    const e = this.props.entry;
    const branding = e?.getIn(['data', 'branding']) || {};
    const logo = branding.logo;
    return logo ? this.props.getAsset(logo) : null;
  },

  generateThemeCSS(theme) {
    const { bg, text, primary, accent, font } = theme || {};
    
    // Ensure all theme values are defined
    const safeBg = bg || '#ffffff';
    const safeText = text || '#333333';
    const safePrimary = primary || '#2563eb';
    const safeAccent = accent || '#10b981';
    const safeFont = font || 'Inter';
    
    return `
      /* Hugo CMS Starter Kit - Dynamic Theme Styles */
      :root {
        --bg: ${safeBg};
        --text: ${safeText};
        --primary: ${safePrimary};
        --accent: ${safeAccent};
        --font-family: '${safeFont}', sans-serif;
        --bg-secondary: ${safeBg}f0;
        --border: ${safePrimary}20;
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
      
      /* Load main CSS styles */
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
        h("div", { style: { marginBottom: '1rem', fontSize: '2rem' } }, "⚡"),
        h("div", null, "Loading preview...")
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
        h("div", { style: { marginBottom: '0.5rem', fontWeight: '600' } }, "Failed to load preview"),
        h("div", { style: { fontSize: '0.875rem', opacity: 0.7 } }, 
          "Error: " + this.state.error
        ),
        h("div", { style: { fontSize: '0.875rem', marginTop: '1rem' } }, 
          "Make sure Hugo server is running and cms-data.json exists"
        )
      ])
    ]);
  },

  render() {
    if (this.state.loading) {
      return this.renderLoadingState();
    }

    if (!this.state.layoutData) {
      return this.renderErrorState();
    }

    const { layoutData } = this.state;
    const theme = this.getThemeData();
    const navigation = layoutData.navigation || [];

    const links = [
      ...preconnect,
      gsheet(theme.font),
    ];

    const css = this.generateThemeCSS(theme);

    // Render sections dynamically based on layout data
    const sections = (layoutData.layout?.sections || []).map((sectionKey, index) => {
      const originalSectionData = layoutData.layout[sectionKey];
      if (!originalSectionData || !originalSectionData.type) return null;

      const renderer = ComponentRegistry[originalSectionData.type];
      if (!renderer) {
        console.warn(`No renderer found for section type: ${originalSectionData.type}`);
        return null;
      }

      // Merge navigation data for header component
      let sectionData = originalSectionData;
      if (originalSectionData.type === 'site-header') {
        sectionData = {
          ...originalSectionData,
          navigation: navigation,
          logo: theme.logo,
          title: theme.site_title
        };
      }

      return h("div", { key: `section-${sectionKey}-${index}` }, 
        renderer(sectionData, theme)
      );
    });

    return h(
      "div",
      null,
      [
        ...links,
        h("style", null, css),

        h("div", { className: "preview-container" }, [
          ...sections,
          
          // Add mobile menu (optional)
          ...renderMobileMenu(navigation, theme)
        ])
      ]
    );
  },
});