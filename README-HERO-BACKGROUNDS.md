# Hero Background Customization - Hugo CMS Starter Kit

## Overview

The Hugo CMS Starter Kit includes comprehensive hero background customization that allows users to choose between gradients, images, and videos with full control over styling and effects.

## Background Types

### 🎨 **Gradient Backgrounds**
Create stunning gradient effects with full customization:

#### Gradient Styles
- **Linear (Left to Right)**: Horizontal gradient flow
- **Linear (Top to Bottom)**: Vertical gradient flow  
- **Linear (Diagonal)**: 135-degree diagonal gradient (default)
- **Radial (Center)**: Circular gradient from center
- **Radial (Top Left)**: Circular gradient from corner

#### Color Options
- **Two-Color Gradients**: Basic start and end colors
- **Three-Color Gradients**: Complex gradients with intermediate color
- **Opacity Control**: Adjustable overlay opacity (0-100%)

#### Examples
```css
/* Linear Diagonal */
background: linear-gradient(135deg, #667eea, #764ba2);

/* Radial Center with 3 colors */
background: radial-gradient(circle at center, #667eea, #764ba2, #f093fb);

/* Linear Top to Bottom */
background: linear-gradient(to bottom, #667eea, #764ba2);
```

### 🖼️ **Image Backgrounds**
Upload and customize background images with professional controls:

#### Image Settings
- **Upload Support**: JPG, PNG, WebP formats
- **Recommended Size**: 1920x1080 or higher
- **File Size Limit**: Under 500KB for optimal performance

#### Positioning Options
- **Center**: Standard centered positioning
- **Top/Bottom**: Vertical alignment control
- **Left/Right**: Horizontal alignment control

#### Size Options
- **Cover**: Fill entire area (recommended)
- **Contain**: Fit entire image within area
- **Auto**: Original image dimensions

#### Overlay Features
- **Dark Overlay**: Improves text readability
- **Opacity Control**: 0-100% overlay strength
- **Automatic**: Smart overlay detection

### 🎬 **Video Backgrounds**
Add dynamic video backgrounds for engaging experiences:

#### Video Settings
- **Format Support**: MP4 (recommended)
- **File Size**: Max 10MB recommended
- **Resolution**: 1920x1080 for best quality
- **Duration**: 10-30 seconds optimal

#### Playback Options
- **Autoplay**: Starts automatically (muted)
- **Loop**: Continuous playback
- **Muted**: Required for autoplay compliance
- **Mobile Optimization**: Automatic performance adjustments

#### Fallback Options
- **Poster Image**: Shown before video loads
- **Error Handling**: Graceful fallback to poster
- **Performance**: Automatic quality adjustment

## CMS Configuration Interface

### Background Type Selector
```yaml
Background Type: [Gradient | Image | Video]
```

### Gradient Configuration
```yaml
🎨 Gradient Settings:
  - Gradient Style: Linear (Diagonal)
  - First Color: #667eea
  - Second Color: #764ba2  
  - Third Color: [Optional]
  - Overlay Opacity: 80%
```

### Image Configuration
```yaml
🖼️ Image Settings:
  - Background Image: [Upload]
  - Image Position: Center
  - Image Size: Cover
  - Dark Overlay: ✓ Enabled
  - Overlay Opacity: 50%
```

### Video Configuration
```yaml
🎬 Video Settings:
  - Video File: [Upload MP4]
  - Video Poster: [Upload Image]
  - Autoplay: ✓ Enabled
  - Loop Video: ✓ Enabled
  - Dark Overlay: ✓ Enabled
  - Overlay Opacity: 60%
```

## Technical Implementation

### Hugo Template Structure
```html
{{ $hero := .Site.Data.theme.hero }}
{{ $bg := $hero.background }}

<section class="hero hero-{{ $bg.type }}" 
         data-bg-type="{{ $bg.type }}">
  
  {{/* Video Background */}}
  {{ if eq $bg.type "video" }}
  <div class="hero-video">
    <video autoplay loop muted playsinline>
      <source src="{{ $bg.video.src }}" type="video/mp4">
    </video>
  </div>
  {{ end }}
  
  {{/* Overlay */}}
  <div class="hero-overlay"></div>
  
  {{/* Content */}}
  <div class="hero-content">
    <!-- Hero content here -->
  </div>
</section>
```

### Dynamic CSS Generation
```html
<!-- Generated dynamically based on CMS settings -->
<style id="hero-background-styles">
.hero-gradient {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.hero-image {
  background-image: url('/images/hero-bg.jpg');
  background-position: center center;
  background-size: cover;
}

.hero-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
```

### Performance Optimizations
```css
/* GPU Acceleration */
.hero-video,
.hero-overlay {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
  }
  
  .hero-image {
    background-attachment: scroll;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .hero-video video {
    animation: none;
  }
}
```

## Best Practices

### Image Guidelines
#### File Optimization
- **Compress images** before upload using TinyPNG or Squoosh
- **Use WebP format** when possible for better compression
- **Avoid huge files** that slow page loading
- **Test on mobile** to ensure fast loading

#### Composition Tips
- **High contrast** areas for text overlay
- **Central focus** for important content placement
- **Professional quality** for business websites
- **Brand consistency** with overall design

### Video Guidelines
#### Technical Requirements
- **MP4 format** with H.264 codec
- **30fps or lower** for smaller file sizes
- **No audio track** to reduce file size
- **Short duration** (10-30 seconds) for seamless loops

#### Content Recommendations
- **Subtle motion** that doesn't distract from text
- **Professional quality** that reflects brand values
- **Loop seamlessly** without jarring transitions
- **Test thoroughly** across different devices

### Performance Considerations
#### Loading Optimization
- **Preload critical resources** like video posters
- **Use appropriate image sizes** for different devices
- **Enable browser caching** for static assets
- **Monitor Core Web Vitals** impact

#### Mobile Experience
- **Reduce video quality** on mobile connections
- **Provide image fallbacks** for slow connections
- **Optimize for touch interfaces** and smaller screens
- **Test on real devices** not just desktop simulators

## Accessibility Features

### Screen Reader Support
- **Proper alt text** for background images
- **Semantic HTML structure** maintained
- **Color contrast compliance** with overlays
- **Focus management** for interactive elements

### Motion Sensitivity
```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  .hero-video video {
    animation: none;
  }
}
```

### Performance Accessibility
- **Fast loading times** benefit all users
- **Graceful degradation** for slow connections
- **Alternative content** when media fails to load
- **Keyboard navigation** support maintained

## SEO Considerations

### Image SEO
- **Descriptive filenames** before upload
- **Appropriate file sizes** for fast loading
- **Alt text consideration** for decorative images
- **Schema markup** for enhanced results

### Core Web Vitals
- **Largest Contentful Paint**: Optimize hero image loading
- **Cumulative Layout Shift**: Prevent layout jumping
- **First Input Delay**: Ensure interactive elements respond quickly

## Troubleshooting

### Common Issues

**Background not showing**
- Check file paths are correct
- Verify image/video uploaded successfully
- Confirm CMS settings saved properly
- Test browser cache by hard refresh

**Video not playing**
- Ensure MP4 format with H.264 codec
- Check file size under 10MB limit
- Verify autoplay settings enabled
- Test on different devices/browsers

**Performance problems**
- Compress large image/video files
- Enable CDN for media delivery
- Check mobile network conditions
- Monitor performance metrics

**Mobile display issues**
- Test responsive breakpoints
- Verify touch-friendly controls
- Check load times on slow connections
- Ensure fallbacks work properly

### Debug Tools
```javascript
// Check video playback
console.log('Video can play:', video.readyState);

// Monitor performance
const observer = new PerformanceObserver((list) => {
  console.log('Performance entries:', list.getEntries());
});
observer.observe({entryTypes: ['paint', 'navigation']});
```

## Advanced Customization

### Custom CSS Hooks
```css
/* Target specific background types */
.hero-gradient { /* Gradient-specific styles */ }
.hero-image { /* Image-specific styles */ }
.hero-video { /* Video-specific styles */ }

/* Custom overlay effects */
.hero-overlay {
  background: linear-gradient(45deg, 
    rgba(0,0,0,0.3), 
    rgba(255,255,255,0.1)
  );
}
```

### JavaScript Enhancement
```javascript
// Video quality detection
if (navigator.connection && navigator.connection.effectiveType === '4g') {
  // Load high-quality video
} else {
  // Use image fallback
}

// Intersection Observer for performance
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Start video or load high-res image
    }
  });
});
```

This comprehensive background system provides professional-grade customization while maintaining excellent performance and accessibility standards.