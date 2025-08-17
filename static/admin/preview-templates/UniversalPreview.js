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
    
    // Extract content sections (hero, features, about, etc.)
    const hero = e?.getIn(['data', 'hero']) || {};
    const features = e?.getIn(['data', 'features']) || {};
    const about = e?.getIn(['data', 'about']) || {};
    const cta_section = e?.getIn(['data', 'cta_section']) || {};
    const testimonials = e?.getIn(['data', 'testimonials']) || {};
    const analytics = e?.getIn(['data', 'analytics']) || {};
    const nav = e?.getIn(['data', 'nav']) || [];
    
    return {
      bg: colors.bg || layoutTheme.bg || '#ffffff',
      text: colors.text || layoutTheme.text || '#333333',
      primary: colors.primary || layoutTheme.primary || '#2563eb',
      accent: colors.accent || layoutTheme.accent || '#10b981',
      font: typography.font || layoutTheme.font || 'Inter',
      site_title: branding.site_title || layoutTheme.site_title || 'Your Site',
      logo: this.getLogo(),
      
      // Content sections
      hero: this.processHeroData(hero, layoutTheme.hero),
      features: this.processFeaturesData(features, layoutTheme.features),
      about: this.processAboutData(about, layoutTheme.about),
      cta_section: this.processCTAData(cta_section, layoutTheme.cta_section),
      testimonials: this.processTestimonialsData(testimonials, layoutTheme.testimonials),
      analytics: this.processAnalyticsData(analytics, layoutTheme.analytics),
      nav: this.processNavData(nav, layoutTheme.nav)
    };
  },

  processHeroData(cmsHero, defaultHero = {}) {
    const primary_button = cmsHero.primary_button || defaultHero.primary_button || {};
    const secondary_button = cmsHero.secondary_button || defaultHero.secondary_button || {};
    const background = cmsHero.background || defaultHero.background || {};
    
    return {
      enabled: cmsHero.enabled !== undefined ? cmsHero.enabled : (defaultHero.enabled !== false),
      title: cmsHero.title || defaultHero.title || 'Welcome to Your Website',
      subtitle: cmsHero.subtitle || defaultHero.subtitle || '',
      description: cmsHero.description || defaultHero.description || '',
      primary_button: {
        text: primary_button.text || 'Get Started',
        url: primary_button.url || '/',
        style: primary_button.style || 'primary'
      },
      secondary_button: {
        text: secondary_button.text || '',
        url: secondary_button.url || '/',
        style: secondary_button.style || 'secondary'
      },
      background: this.processHeroBackground(background, defaultHero.background)
    };
  },

  processHeroBackground(cmsBackground, defaultBackground = {}) {
    const bgType = cmsBackground.type || defaultBackground.type || 'gradient';
    
    return {
      type: bgType,
      gradient: {
        style: cmsBackground.gradient?.style || defaultBackground.gradient?.style || 'linear-diagonal',
        color1: cmsBackground.gradient?.color1 || defaultBackground.gradient?.color1 || '#667eea',
        color2: cmsBackground.gradient?.color2 || defaultBackground.gradient?.color2 || '#764ba2',
        color3: cmsBackground.gradient?.color3 || defaultBackground.gradient?.color3 || '',
        overlay_opacity: cmsBackground.gradient?.overlay_opacity !== undefined ? cmsBackground.gradient?.overlay_opacity : (defaultBackground.gradient?.overlay_opacity || 0.8)
      },
      image: {
        src: this.getAssetUrl(cmsBackground.image?.src) || this.getAssetUrl(defaultBackground.image?.src) || '',
        position: cmsBackground.image?.position || defaultBackground.image?.position || 'center center',
        size: cmsBackground.image?.size || defaultBackground.image?.size || 'cover',
        overlay: cmsBackground.image?.overlay !== undefined ? cmsBackground.image?.overlay : (defaultBackground.image?.overlay !== false),
        overlay_opacity: cmsBackground.image?.overlay_opacity !== undefined ? cmsBackground.image?.overlay_opacity : (defaultBackground.image?.overlay_opacity || 0.5)
      },
      video: {
        src: this.getAssetUrl(cmsBackground.video?.src) || this.getAssetUrl(defaultBackground.video?.src) || '',
        poster: this.getAssetUrl(cmsBackground.video?.poster) || this.getAssetUrl(defaultBackground.video?.poster) || '',
        autoplay: cmsBackground.video?.autoplay !== undefined ? cmsBackground.video?.autoplay : (defaultBackground.video?.autoplay !== false),
        loop: cmsBackground.video?.loop !== undefined ? cmsBackground.video?.loop : (defaultBackground.video?.loop !== false),
        overlay: cmsBackground.video?.overlay !== undefined ? cmsBackground.video?.overlay : (defaultBackground.video?.overlay !== false),
        overlay_opacity: cmsBackground.video?.overlay_opacity !== undefined ? cmsBackground.video?.overlay_opacity : (defaultBackground.video?.overlay_opacity || 0.6)
      }
    };
  },

  processFeaturesData(cmsFeatures, defaultFeatures = {}) {
    const items = cmsFeatures.items?.toJS?.() || cmsFeatures.items || defaultFeatures.items || [];
    
    return {
      enabled: cmsFeatures.enabled !== undefined ? cmsFeatures.enabled : (defaultFeatures.enabled !== false),
      title: cmsFeatures.title || defaultFeatures.title || 'Key Features',
      subtitle: cmsFeatures.subtitle || defaultFeatures.subtitle || '',
      items: items.map(item => ({
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '⭐',
        link: item.link || null
      }))
    };
  },

  processAboutData(cmsAbout, defaultAbout = {}) {
    const cta = cmsAbout.cta || defaultAbout.cta || {};
    
    return {
      enabled: cmsAbout.enabled !== undefined ? cmsAbout.enabled : (defaultAbout.enabled || false),
      title: cmsAbout.title || defaultAbout.title || 'About Us',
      content: cmsAbout.content || defaultAbout.content || '',
      image: this.getAssetUrl(cmsAbout.image) || this.getAssetUrl(defaultAbout.image) || '',
      cta: {
        text: cta.text || '',
        url: cta.url || '/about/'
      }
    };
  },

  processCTAData(cmsCTA, defaultCTA = {}) {
    const primary_button = cmsCTA.primary_button || defaultCTA.primary_button || {};
    const secondary_button = cmsCTA.secondary_button || defaultCTA.secondary_button || {};
    
    return {
      enabled: cmsCTA.enabled !== undefined ? cmsCTA.enabled : (defaultCTA.enabled || false),
      background: cmsCTA.background || defaultCTA.background || 'primary',
      title: cmsCTA.title || defaultCTA.title || 'Ready to Get Started?',
      subtitle: cmsCTA.subtitle || defaultCTA.subtitle || '',
      primary_button: {
        text: primary_button.text || 'Get Started',
        url: primary_button.url || '/contact/'
      },
      secondary_button: {
        text: secondary_button.text || '',
        url: secondary_button.url || '/about/'
      }
    };
  },

  processTestimonialsData(cmsTestimonials, defaultTestimonials = {}) {
    const items = cmsTestimonials.items?.toJS?.() || cmsTestimonials.items || defaultTestimonials.items || [];
    
    return {
      enabled: cmsTestimonials.enabled !== undefined ? cmsTestimonials.enabled : (defaultTestimonials.enabled || false),
      title: cmsTestimonials.title || defaultTestimonials.title || 'What Our Clients Say',
      items: items.map(item => ({
        quote: item.quote || '',
        name: item.name || '',
        title: item.title || '',
        photo: this.getAssetUrl(item.photo) || ''
      }))
    };
  },

  processAnalyticsData(cmsAnalytics, defaultAnalytics = {}) {
    return {
      enabled: cmsAnalytics.enabled !== undefined ? cmsAnalytics.enabled : (defaultAnalytics.enabled || false),
      ga4_id: cmsAnalytics.ga4_id || defaultAnalytics.ga4_id || '',
      cookie_consent: cmsAnalytics.cookie_consent !== undefined ? cmsAnalytics.cookie_consent : (defaultAnalytics.cookie_consent !== false),
      track_external_links: cmsAnalytics.track_external_links !== undefined ? cmsAnalytics.track_external_links : (defaultAnalytics.track_external_links !== false),
      track_downloads: cmsAnalytics.track_downloads !== undefined ? cmsAnalytics.track_downloads : (defaultAnalytics.track_downloads !== false),
      enhanced_ecommerce: cmsAnalytics.enhanced_ecommerce !== undefined ? cmsAnalytics.enhanced_ecommerce : (defaultAnalytics.enhanced_ecommerce || false),
      debug_mode: cmsAnalytics.debug_mode !== undefined ? cmsAnalytics.debug_mode : (defaultAnalytics.debug_mode || false)
    };
  },

  processNavData(cmsNav, defaultNav = []) {
    const navItems = cmsNav?.toJS?.() || cmsNav || defaultNav || [];
    return navItems.map(item => ({
      name: item.name || '',
      url: item.url || '/'
    }));
  },

  getAssetUrl(asset) {
    if (!asset) return '';
    if (typeof asset === 'string') return asset;
    return this.props.getAsset?.(asset) || '';
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

    // For theme editing, render homepage content sections directly from theme data
    const sections = [
      // Site Header
      h("div", { key: "site-header" }, 
        ComponentRegistry['site-header']({
          type: 'site-header',
          navigation: theme.nav || navigation,
          logo: theme.logo,
          title: theme.site_title,
          show_mobile_menu: true
        }, theme)
      ),
      
      // Enhanced Hero Section
      theme.hero?.enabled && h("div", { key: "enhanced-hero" }, 
        ComponentRegistry['enhanced-hero'](theme.hero, theme)
      ),
      
      // Enhanced Features Section
      theme.features?.enabled && h("div", { key: "enhanced-features" }, 
        ComponentRegistry['enhanced-features'](theme.features, theme)
      ),
      
      // About Section
      theme.about?.enabled && h("div", { key: "about-section" }, 
        ComponentRegistry['about-section'](theme.about, theme)
      ),
      
      // Testimonials Section
      theme.testimonials?.enabled && h("div", { key: "testimonials-section" }, 
        ComponentRegistry['testimonials-section'](theme.testimonials, theme)
      ),
      
      // CTA Section
      theme.cta_section?.enabled && h("div", { key: "cta-section" }, 
        ComponentRegistry['cta-section'](theme.cta_section, theme)
      )
    ].filter(Boolean);

    return h(
      "div",
      null,
      [
        ...links,
        h("style", null, css),

        h("div", { className: "preview-container" }, [
          // Analytics status indicator (for preview only)
          theme.analytics?.enabled && theme.analytics?.ga4_id && h("div", {
            style: {
              position: 'fixed',
              top: '10px',
              right: '10px',
              background: '#10b981',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              zIndex: '9999',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          }, `📊 Analytics: ${theme.analytics.ga4_id}`),
          
          ...sections,
          
          // Add mobile menu (optional)
          ...renderMobileMenu(navigation, theme)
        ])
      ]
    );
  },
});