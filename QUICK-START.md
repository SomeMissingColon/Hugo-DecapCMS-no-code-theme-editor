# 🚀 Quick Start Guide

Get your Hugo CMS website running in 5 minutes!

## ⚡ Fast Setup

### 1. Prerequisites
- Install [Hugo](https://gohugo.io/installation/) (extended version)
- Install [Node.js](https://nodejs.org/)

### 2. Configure Site
Edit these 2 files:

**`hugo.toml`** - Change these lines:
```toml
baseURL = "https://your-domain.com/"  # Your website URL
title = "Your Site Name"              # Your site name
```

**`static/admin/config.yml`** - Change these lines:
```yaml
site_url: https://your-domain.com     # Your website URL
display_url: https://your-domain.com  # Same as above
```

### 3. Start Development
```bash
# Terminal 1 - Hugo server
hugo server --buildDrafts

# Terminal 2 - CMS backend  
npx decap-server
```

### 4. Access Your Site
- **Website**: http://localhost:1313
- **CMS Admin**: http://localhost:1313/admin

## 🎨 First Customizations

1. **Go to CMS**: http://localhost:1313/admin
2. **Click "Site Theme & Branding"**
3. **Customize**:
   - Colors (background, text, brand colors)
   - Font (choose from Google Fonts)
   - Site title and logo
   - Hero section content

4. **See changes live** in the preview pane!

## 📝 Add Content

### Edit Pages
- **Home Page**: Pages → Home Page
- **About Page**: Pages → About Page  
- **Services Page**: Pages → Services Page
- **Contact Page**: Pages → Contact Page

### Create Blog Posts
- **Blog Posts** → **New Blog Post**
- Add title, content, images, and tags
- Save as draft or publish immediately

## 🚀 Deploy to Production

### Option 1: Netlify (Easiest)
1. Push code to GitHub/GitLab
2. Connect repository to [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `hugo --gc --minify`
   - Publish directory: `public`
4. Enable Netlify Identity for CMS authentication

### Option 2: Vercel
1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Configure build settings (auto-detected)

### Option 3: GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use provided GitHub Actions workflow

## 🔐 Authentication Setup

For production CMS access:

### Netlify Identity (Recommended)
1. Deploy to Netlify
2. Site Settings → Identity → Enable
3. Settings → Registration → Invite only
4. Invite users via email

### GitHub OAuth
1. Create GitHub OAuth App
2. Update `static/admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: username/repository-name
   ```

## 🛟 Need Help?

**Common Issues**:
- **CMS not loading**: Check authentication setup
- **Preview not working**: Ensure Hugo server is running
- **Styles not applying**: Check theme data in CMS

**Resources**:
- Full documentation in `README.md`
- [Hugo Docs](https://gohugo.io/documentation/)
- [Decap CMS Docs](https://decapcms.org/docs/)

---

🎉 **You're ready to build!** Start customizing your site through the CMS interface.