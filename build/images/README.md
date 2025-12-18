# Images Directory Structure

This directory contains all images used in the Koli Catch website, organized by section and purpose.

## Directory Structure

```
images/
├── logos/          # Company logos (header, footer, contact forms)
├── hero/           # Hero section background images
├── about/          # About section images
├── business/       # Business model section images
├── fish/           # Fish variety/product images
├── contact/        # Contact section images
└── footer/         # Footer section images (if any)
```

## Usage Guidelines

1. **File Naming**: Use descriptive, lowercase names with hyphens (e.g., `hero-background.jpg`, `logo-primary.png`)

2. **Image Formats**:
   - Logos: PNG (with transparency) or SVG
   - Photos: JPG or WebP
   - Icons: PNG or SVG

3. **Image Optimization**: 
   - Compress images before adding
   - Use appropriate sizes (responsive images)
   - Consider WebP format for better performance

4. **Reference in Code**:
   - Use: `/images/[folder]/[filename]`
   - Example: `/images/logos/logo-primary.png`

## Current Image Sources

The following images are currently referenced from external URLs and should be moved to this directory:

### Logos
- Header logo: `https://customer-assets.emergentagent.com/.../i0jb4mg9_logo.png`
- Footer logo: Same as header
- Contact form logo: Same as header

### Hero Section
- Background: `https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96...`

### About Section
- Fresh Seafood: `https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg`

### Business Model Section
- B2C Image: `https://images.pexels.com/photos/2792153/pexels-photo-2792153.jpeg`
- B2B Image: `https://images.pexels.com/photos/2042591/pexels-photo-2042591.jpeg`

### Fish Varieties
- Multiple fish images from Unsplash and Pexels
- See `src/mockData.js` for complete list

