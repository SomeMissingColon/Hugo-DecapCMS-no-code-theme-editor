# Netlify Deployment Guide - Hugo CMS Starter Kit

## Quick Fix for Git Access Errors

If you're seeing the error:
```
ERROR Failed to read Git log: access denied: "git" is not whitelisted in policy "security.exec.allow"
```

**This has been fixed!** The updated `netlify.toml` removes all Git dependencies.

## Fixed netlify.toml Configuration

The included `netlify.toml` is configured to build without Git access:

```toml
[build]
  command = "hugo --gc --minify"
  publish = "public"
  
  [build.environment]
    HUGO_VERSION = "0.145.0"
    HUGO_ENV = "production"

[context.production]
  command = "hugo --gc --minify"
```

**Key changes:**
- ❌ Removed `HUGO_ENABLEGITINFO = "true"`
- ❌ Removed `--enableGitInfo` flags
- ✅ Clean build without Git dependencies

## Deployment Steps

### 1. Prepare Repository
```bash
# Ensure you have the latest files
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

### 2. Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, Bitbucket)
4. Select your repository
5. Netlify will auto-detect the `netlify.toml` settings

### 3. Build Settings (Auto-detected)
```
Build command: hugo --gc --minify
Publish directory: public
```

### 4. Environment Variables
Netlify will automatically set:
- `HUGO_VERSION = 0.145.0`
- `HUGO_ENV = production`

### 5. Deploy
Click "Deploy site" - the build should complete successfully in 1-2 minutes.

## CMS Configuration for Netlify

### Enable Netlify Identity
1. Go to your site dashboard
2. Navigate to **Identity** tab
3. Click **Enable Identity**
4. Configure settings:
   - Registration: Invite only (recommended)
   - Email confirmation: Enable
   - Add users manually

### Git Gateway Setup
1. In Identity settings, scroll to **Services**
2. Click **Enable Git Gateway**
3. No additional configuration needed

### Update CMS Config
Edit `static/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

site_url: https://your-site-name.netlify.app
display_url: https://your-site-name.netlify.app
```

## Testing Your Deployment

### 1. Verify Site Loads
- Visit your Netlify URL
- Check all pages load correctly
- Test responsive design

### 2. Test CMS Access
- Go to `/admin/` on your site
- Sign up/login with Netlify Identity
- Verify you can edit content
- Test live preview functionality

### 3. Test Content Publishing
- Make a small content change
- Save and publish
- Verify the site rebuilds automatically
- Check changes appear on live site

## Performance Optimization

The `netlify.toml` includes performance optimizations:

### Security Headers
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Caching Strategy
```toml
# Long-term caching for assets
[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### CMS-Specific Headers
```toml
# Allow CMS iframe preview
[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
```

## Custom Domain Setup

### 1. Add Custom Domain
1. In Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions

### 2. SSL Certificate
- Netlify automatically provisions SSL certificates
- Certificate typically takes 1-24 hours to activate
- No additional configuration required

### 3. Update CMS Configuration
Update your `static/admin/config.yml`:
```yaml
site_url: https://yourdomain.com
display_url: https://yourdomain.com
```

## Troubleshooting

### Build Failures

**Error: Hugo version mismatch**
```toml
# In netlify.toml, update Hugo version
[build.environment]
  HUGO_VERSION = "0.145.0"  # Use latest stable
```

**Error: Missing dependencies**
- Ensure all files are committed to Git
- Check `hugo.toml` configuration
- Verify theme files are present

### CMS Issues

**Can't access /admin/**
- Check Netlify Identity is enabled
- Verify Git Gateway is configured
- Ensure Identity widget is included

**Preview not working**
- Check if Hugo server is required for preview
- Verify `/cms-data.json` is generated
- Check browser console for errors

**Authentication problems**
- Verify email confirmation settings
- Check user permissions
- Test in incognito/private browsing

### Performance Issues

**Slow build times**
```bash
# Optimize build command
hugo --gc --minify --cleanDestinationDir
```

**Large bundle size**
- Enable Hugo minification
- Optimize images before upload
- Remove unused CSS/JS

## Advanced Configuration

### Branch Deploys
```toml
[context.branch-deploy]
  command = "hugo --gc --minify -b $DEPLOY_PRIME_URL"
```

### Deploy Previews
```toml
[context.deploy-preview]
  command = "hugo --gc --minify --buildFuture -b $DEPLOY_PRIME_URL"
```

### Environment-Specific Builds
```toml
[context.production.environment]
  HUGO_ENV = "production"
  
[context.deploy-preview.environment]
  HUGO_ENV = "preview"
```

## Monitoring and Analytics

### Build Notifications
1. Go to **Site settings** → **Build & deploy**
2. Scroll to **Deploy notifications**
3. Add email, Slack, or webhook notifications

### Performance Monitoring
- Use Netlify Analytics (paid)
- Integrate Google Analytics via CMS
- Monitor Core Web Vitals

### Error Tracking
- Check deploy logs for build errors
- Monitor function logs if using serverless
- Set up uptime monitoring

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Hugo Deployment Guide](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/)
- [Decap CMS Netlify Guide](https://decapcms.org/docs/add-to-your-site/)

**Need help?** Open an issue with:
- Build logs
- Error messages
- Configuration files
- Steps to reproduce