# 🔧 CMS Configuration Guide

Understanding and customizing the Decap CMS setup in your Hugo starter kit.

## 📁 CMS File Structure

```
static/admin/
├── config.yml                 # Main CMS configuration
├── index.html                 # CMS admin interface
├── google-fonts.json          # Font library data
├── widgets/
│   └── GoogleFontSelect.js     # Custom font picker widget
└── preview-templates/
    ├── ComponentRegistry.js    # Component rendering system
    ├── UniversalPreview.js     # Main preview template
    └── registerPreviews.js     # Preview registration
```

## ⚙️ Main Configuration (`config.yml`)

### Backend Configuration
```yaml
backend:
  name: git-gateway          # Authentication method
  branch: main              # Git branch to edit
  
# For local development:
# local_backend: true
```

**Backend Options**:
- `git-gateway`: Netlify Identity (recommended for Netlify)
- `github`: Direct GitHub authentication
- `gitlab`: GitLab authentication
- `test-repo`: Local testing only

### Media Management
```yaml
media_folder: static/images/uploads    # Where files are stored
public_folder: /images/uploads         # URL path for uploaded files
```

### Site Branding
```yaml
site_url: https://your-site.com        # Your website URL
display_url: https://your-site.com     # Link in CMS header
logo_url: /images/logo.svg             # CMS login logo
```

## 📝 Content Collections

### Theme Collection
Controls site appearance and branding:

```yaml
collections:
  - name: "theme"
    label: "Site Theme & Branding"
    files:
      - name: "theme"
        file: "data/theme.yml"      # Hugo data file
        fields:
          # Color scheme, typography, branding, etc.
```

**Field Types Used**:
- `color`: Color picker widget
- `googleFontSelect`: Custom font selector
- `string`: Text input
- `text`: Multi-line text
- `boolean`: Checkbox
- `image`: File upload
- `list`: Repeatable items
- `object`: Grouped fields

### Pages Collection
Manages static pages:

```yaml
- name: "pages"
  label: "📄 Pages"
  files:
    - file: "content/_index.md"    # Homepage
    - file: "content/about/_index.md"
    # ... other pages
```

### Blog Collection
Manages blog posts:

```yaml
- name: "blog"
  label: "📝 Blog Posts"
  folder: "content/blog"           # Folder for posts
  create: true                     # Allow creating new posts
  slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
```

## 🎨 Custom Widgets

### Google Font Selector
Located in `widgets/GoogleFontSelect.js`:

```javascript
// Usage in config.yml
- label: "Font Family"
  name: "font"
  widget: "googleFontSelect"      # Custom widget
  default: "Inter"
```

**Features**:
- Searchable font list
- Live preview
- System fonts included
- Fallback handling

### Creating Custom Widgets
```javascript
// Example: Color palette widget
const ColorPaletteWidget = createClass({
  render() {
    // Widget implementation
  }
});

CMS.registerWidget('colorPalette', ColorPaletteWidget);
```

## 🖼️ Preview System

### Component Registry
`ComponentRegistry.js` defines how sections render:

```javascript
export const ComponentRegistry = {
  'site-header': renderSiteHeader,
  'hero-section': renderHeroSection,
  'features-grid': renderFeaturesGrid,
  // ... more components
};
```

### Adding New Components
1. **Create renderer function**:
   ```javascript
   function renderTestimonials(data, theme) {
     return h("section", { className: "testimonials" }, [
       // Component HTML structure
     ]);
   }
   ```

2. **Register component**:
   ```javascript
   ComponentRegistry['testimonials'] = renderTestimonials;
   ```

3. **Update Hugo template** (`layouts/index.cmsdata.json`):
   ```javascript
   {{- $testimonials := dict
     "type" "testimonials"
     "items" $theme.testimonials.items
   -}}
   ```

### Preview Data Flow
1. **Hugo generates** `/cms-data.json` with layout structure
2. **Preview fetches** JSON data on load
3. **Components render** based on registry
4. **Theme updates** override colors/fonts in real-time

## 🔧 Advanced Configuration

### Field Validation
```yaml
fields:
  - label: "Email"
    name: "email"
    widget: "string"
    pattern: ['^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', 'Must be a valid email']
    required: true
```

### Conditional Fields
```yaml
fields:
  - label: "Show Hero"
    name: "show_hero"
    widget: "boolean"
  
  - label: "Hero Title"
    name: "hero_title"
    widget: "string"
    condition:
      field: "show_hero"
      value: true
```

### Custom Preview Styles
```javascript
// In registerPreviews.js
CMS.registerPreviewStyle('/css/admin-preview.css');
CMS.registerPreviewStyle(`
  .preview-container {
    font-family: 'Inter', sans-serif;
  }
`);
```

### Editor Toolbar Customization
```yaml
fields:
  - label: "Content"
    name: "body"
    widget: "markdown"
    buttons: ["bold", "italic", "link", "heading-two", "bulleted-list"]
    editor_components: ["image", "code-block"]
```

## 🏗️ Data Structure

### Theme Data Schema
```yaml
# data/theme.yml structure
colors:
  bg: "#ffffff"
  text: "#333333"
  primary: "#2563eb"
  accent: "#10b981"

typography:
  font: "Inter"

branding:
  site_title: "Your Site"
  logo: "/images/logo.svg"

hero:
  enabled: true
  title: "Welcome"
  subtitle: "Your subtitle"
  button_text: "Get Started"
  button_url: "/about/"
```

### Hugo Data Access
```html
<!-- In Hugo templates -->
{{ .Site.Data.theme.colors.primary }}
{{ .Site.Data.theme.typography.font }}
{{ .Site.Data.theme.hero.title }}
```

## 🔐 Authentication & Permissions

### User Roles
```yaml
# For Netlify Identity
users:
  - email: "admin@example.com"
    role: "admin"
  - email: "editor@example.com"  
    role: "editor"
```

### Collection Permissions
```yaml
collections:
  - name: "posts"
    # Only admins can edit
    access: 
      role: "admin"
```

## 🎯 Workflow Configuration

### Editorial Workflow
```yaml
# Enable draft/review process
publish_mode: editorial_workflow

# Custom statuses
status:
  - name: "draft"
    label: "Draft"
  - name: "in_review"
    label: "In Review"
  - name: "ready"
    label: "Ready to Publish"
```

### Auto-Save & Drafts
```yaml
# Save drafts automatically
auto_save: true

# Draft folder structure
drafts:
  folder: "content/drafts"
```

## 🐛 Debugging

### Common Issues
1. **Preview not loading**: Check `/cms-data.json` exists
2. **Fonts not working**: Verify Google Fonts API
3. **Images not showing**: Check media folder configuration
4. **Authentication failing**: Review backend setup

### Debug Mode
```javascript
// In admin/index.html
<script>
  window.CMS_MANUAL_INIT = true;
  window.CMS_DEBUG = true;
</script>
```

### Console Logging
```javascript
// In preview templates
console.log('Layout data:', layoutData);
console.log('Theme data:', theme);
```

## 📚 Resources

- [Decap CMS Widget Reference](https://decapcms.org/docs/widgets/)
- [Hugo Data Templates](https://gohugo.io/templates/data-templates/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

💡 **Pro Tip**: Start with the default configuration and gradually customize based on your needs!