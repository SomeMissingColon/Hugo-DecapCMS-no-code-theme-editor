# Hugo CMS Starter Kit

A complete starter kit for building modern websites with Hugo and integrated content management using Decap CMS (formerly Netlify CMS).

## 🚀 Features

- **Visual Theme Editor**: Change colors, fonts, and branding through a user-friendly interface
- **Dynamic Preview**: See changes in real-time as you edit
- **Content Management**: Easy editing of pages, blog posts, and site settings
- **Responsive Design**: Mobile-first, modern CSS with CSS custom properties
- **Google Fonts Integration**: Choose from hundreds of web fonts
- **Media Management**: Upload and organize images and files
- **SEO Friendly**: Built-in meta tags and structured data
- **Fast & Secure**: Static site generation with modern build tools

## 📁 Project Structure

```
hugo-cms-starter-kit/
├── content/                 # Site content (Markdown files)
│   ├── _index.md           # Homepage content
│   ├── about/              # About page
│   ├── services/           # Services page
│   ├── contact/            # Contact page
│   └── blog/               # Blog posts
├── data/
│   └── theme.yml           # Theme configuration (colors, fonts, etc.)
├── layouts/                # Hugo templates
│   ├── _default/           # Default page templates
│   ├── partials/           # Reusable template components
│   └── index.html          # Homepage template
├── static/                 # Static assets
│   ├── admin/              # CMS configuration and interface
│   │   ├── config.yml      # CMS settings
│   │   ├── index.html      # CMS admin interface
│   │   ├── widgets/        # Custom CMS widgets
│   │   └── preview-templates/ # Live preview components
│   ├── css/                # Stylesheets
│   └── images/             # Images and media files
└── hugo.toml               # Hugo site configuration
```

## 🏃‍♂️ Quick Start

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended version)
- [Node.js](https://nodejs.org/) (for CMS backend)
- Git

### Installation

1. **Clone or download this starter kit**
   ```bash
   git clone <repository-url> my-website
   cd my-website
   ```

2. **Configure your site**
   
   Edit `hugo.toml`:
   ```toml
   baseURL = "https://your-domain.com/"
   title = "Your Site Name"
   
   [params]
     description = "Your site description"
     author = "Your Name"
   ```

3. **Set up the CMS**
   
   Edit `static/admin/config.yml`:
   ```yaml
   site_url: https://your-domain.com
   display_url: https://your-domain.com
   
   backend:
     name: git-gateway  # or your preferred backend
     branch: main
   ```

4. **Start development server**
   ```bash
   # Terminal 1: Start Hugo
   hugo server --buildDrafts
   
   # Terminal 2: Start CMS backend (in another terminal)
   npx decap-server
   ```

5. **Access your site**
   - Website: http://localhost:1313
   - CMS Admin: http://localhost:1313/admin

## 🎨 Customization

### Theme Colors & Fonts

1. Go to `/admin/` in your browser
2. Navigate to "Site Theme & Branding"
3. Customize:
   - **Colors**: Background, text, primary brand, and accent colors
   - **Typography**: Choose from Google Fonts
   - **Branding**: Upload logo and set site title
   - **Hero Section**: Edit homepage content
   - **Features**: Manage feature highlights

### Content Management

#### Pages
- **Home**: Edit homepage content and hero section
- **About**: Company/personal information
- **Services**: What you offer
- **Contact**: Contact information and forms

#### Blog Posts
- Create new posts with rich text editor
- Add featured images and tags
- Schedule posts and manage drafts

#### Navigation Menu
Edit navigation in two ways:
1. **Through CMS**: Site Theme → Navigation Menu
2. **Direct config**: Edit `hugo.toml` menu section

### Adding Custom Sections

1. **Create Hugo template** in `layouts/`
2. **Add component renderer** in `static/admin/preview-templates/ComponentRegistry.js`
3. **Update data export** in `layouts/index.cmsdata.json`
4. **Configure CMS fields** in `static/admin/config.yml`

Example: Adding a testimonials section

```javascript
// ComponentRegistry.js
function renderTestimonials(data, theme) {
  return h("section", { className: "testimonials" }, [
    h("div", { className: "container" }, [
      h("h2", null, data.title),
      h("div", { className: "testimonials-grid" },
        data.items.map(testimonial => 
          h("blockquote", null, [
            h("p", null, testimonial.quote),
            h("cite", null, testimonial.author)
          ])
        )
      )
    ])
  ]);
}
```

## 🔧 Configuration

### Authentication Setup

For production deployment, configure authentication:

#### Option 1: Netlify (Recommended)
1. Deploy to Netlify
2. Enable Netlify Identity in site settings
3. Configure Git Gateway

#### Option 2: GitHub OAuth
```yaml
# static/admin/config.yml
backend:
  name: github
  repo: username/repository-name
  branch: main
```

#### Option 3: GitLab/Bitbucket
See [Decap CMS documentation](https://decapcms.org/docs/backends-overview/) for other backends.

### Environment Variables

For different environments, set these variables:

```bash
# Development
HUGO_ENVIRONMENT=development

# Production  
HUGO_ENVIRONMENT=production
HUGO_BASEURL=https://your-domain.com
```

## 📱 Mobile Responsiveness

The starter kit includes:
- Mobile-first CSS design
- Responsive navigation with hamburger menu
- Optimized typography scaling
- Touch-friendly interface elements
- Fast loading on mobile networks

## 🔍 SEO Optimization

Built-in SEO features:
- Semantic HTML structure
- Meta tags and Open Graph
- Structured data markup
- XML sitemap generation
- Fast loading speeds
- Mobile optimization

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `hugo --gc --minify`
   - Publish directory: `public`
3. **Configure CMS**:
   - Enable Netlify Identity
   - Set up Git Gateway
4. **Custom domain** (optional)

### Vercel

```json
// vercel.json
{
  "build": {
    "env": {
      "HUGO_VERSION": "0.111.0"
    }
  },
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### GitHub Pages

```yaml
# .github/workflows/hugo.yml
name: Build and Deploy
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
      - name: Build
        run: hugo --gc --minify
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## 🛠 Extending the CMS

### Adding Custom Widgets

Create custom input widgets for the CMS:

```javascript
// static/admin/widgets/MyCustomWidget.js
const CustomWidget = createClass({
  render() {
    return h('input', {
      type: 'text',
      value: this.props.value,
      onChange: (e) => this.props.onChange(e.target.value)
    });
  }
});

CMS.registerWidget('myCustomWidget', CustomWidget);
```

### Custom Preview Templates

Create specialized preview templates:

```javascript
// static/admin/preview-templates/BlogPostPreview.js
const BlogPostPreview = createClass({
  render() {
    const entry = this.props.entry;
    return h('article', null, [
      h('h1', null, entry.getIn(['data', 'title'])),
      h('div', null, entry.getIn(['data', 'body']))
    ]);
  }
});

CMS.registerPreviewTemplate('blog', BlogPostPreview);
```

## 🔒 Security Best Practices

- Use HTTPS for all deployments
- Configure proper CORS headers
- Validate user inputs
- Regular dependency updates
- Secure authentication setup
- Content sanitization

## 📚 Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Hugo Themes](https://themes.gohugo.io/)
- [Web Performance Best Practices](https://web.dev/fast/)

## 🐛 Troubleshooting

### Common Issues

**CMS not loading**
- Check if backend configuration is correct
- Verify authentication setup
- Check browser console for errors

**Preview not updating**
- Ensure Hugo server is running
- Check `/cms-data.json` exists and is valid
- Verify preview template registration

**Styling issues**
- Check CSS custom properties syntax
- Verify theme data structure
- Review browser developer tools

**Build failures**
- Check Hugo version compatibility
- Verify all required files exist
- Review build logs for specific errors

### Getting Help

1. Check the [Issues](link-to-issues) section
2. Review [Hugo Community Forum](https://discourse.gohugo.io/)
3. Check [Decap CMS Discussions](https://github.com/decaporg/decap-cms/discussions)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🎯 Roadmap

- [ ] More theme templates
- [ ] Advanced custom fields
- [ ] E-commerce integration
- [ ] Multi-language support
- [ ] Advanced SEO tools
- [ ] Performance analytics

---

**Happy building!** 🚀

For questions or support, please open an issue or reach out to the community.