#!/bin/bash

# Hugo CMS Starter Kit - Setup Script
# This script helps you get started quickly

echo "🚀 Hugo CMS Starter Kit Setup"
echo "================================"

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo is not installed. Please install Hugo first:"
    echo "   https://gohugo.io/installation/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Get site information
echo "📝 Site Configuration"
echo "Please provide the following information:"

read -p "Site name (e.g., 'My Awesome Website'): " SITE_NAME
read -p "Site URL (e.g., 'https://mysite.com'): " SITE_URL
read -p "Author name: " AUTHOR_NAME
read -p "Site description: " SITE_DESCRIPTION

# Update hugo.toml
echo ""
echo "📄 Updating site configuration..."

sed -i.bak "s|baseURL = \"https://your-site.com/\"|baseURL = \"$SITE_URL\"|g" hugo.toml
sed -i.bak "s|title = \"Hugo CMS Starter Kit\"|title = \"$SITE_NAME\"|g" hugo.toml
sed -i.bak "s|author = \"Your Name\"|author = \"$AUTHOR_NAME\"|g" hugo.toml
sed -i.bak "s|description = \"A starter kit for Hugo websites with integrated CMS\"|description = \"$SITE_DESCRIPTION\"|g" hugo.toml

# Update CMS config
echo "🔧 Updating CMS configuration..."

sed -i.bak "s|site_url: https://your-site.com|site_url: $SITE_URL|g" static/admin/config.yml
sed -i.bak "s|display_url: https://your-site.com|display_url: $SITE_URL|g" static/admin/config.yml

# Update theme data
echo "🎨 Updating theme configuration..."

sed -i.bak "s|site_title: \"Your Site Name\"|site_title: \"$SITE_NAME\"|g" data/theme.yml

# Clean up backup files
rm -f hugo.toml.bak static/admin/config.yml.bak data/theme.yml.bak

echo ""
echo "✅ Configuration updated successfully!"
echo ""

# Ask about starting development server
echo "🏃‍♂️ Development Server"
read -p "Start development server now? (y/n): " START_SERVER

if [[ $START_SERVER =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting Hugo development server..."
    echo "📍 Website: http://localhost:1313"
    echo "🎛️  CMS Admin: http://localhost:1313/admin"
    echo ""
    echo "In another terminal, run: npx decap-server"
    echo ""
    
    hugo server --buildDrafts --port 1313
else
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Start Hugo server: hugo server --buildDrafts"
    echo "2. Start CMS backend: npx decap-server (in another terminal)"
    echo "3. Visit http://localhost:1313 to see your site"
    echo "4. Visit http://localhost:1313/admin to manage content"
    echo ""
    echo "📚 Documentation:"
    echo "- README.md - Complete documentation"
    echo "- QUICK-START.md - 5-minute setup guide"
    echo "- CMS-CONFIGURATION.md - CMS customization guide"
fi

echo ""
echo "🎉 Setup complete! Happy building!"