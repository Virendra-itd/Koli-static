# Deployment Guide

This guide provides instructions for deploying the Koli Catch website to various hosting platforms.

## Prerequisites

1. Build the project:
   ```bash
   yarn install
   yarn build
   ```

2. The `build` folder contains all the production-ready files.

## Deployment Options

### 1. Netlify

**Automatic Deployment:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Netlify will automatically detect the `netlify.toml` configuration
4. Set build command: `yarn build`
5. Set publish directory: `build`

**Manual Deployment:**
1. Build the project: `yarn build`
2. Drag and drop the `build` folder to Netlify's deploy interface

**Configuration:**
- The `netlify.toml` file is already configured with:
  - Build settings
  - Redirect rules for client-side routing
  - Security headers
  - Cache optimization

### 2. Vercel

**Automatic Deployment:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Follow the prompts

**Via GitHub:**
1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Vercel will automatically detect `vercel.json` configuration

**Configuration:**
- The `vercel.json` file includes:
  - Build settings
  - Rewrite rules for React Router
  - Cache headers
  - Security headers

### 3. Apache Server

1. Build the project: `yarn build`
2. Copy the contents of the `build` folder to your Apache web root (usually `/var/www/html` or `public_html`)
3. Copy the `.htaccess` file to the web root directory
4. Ensure `mod_rewrite` is enabled:
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

**Configuration:**
- The `.htaccess` file includes:
  - URL rewriting for React Router
  - Security headers
  - Compression
  - Browser caching

### 4. Nginx Server

1. Build the project: `yarn build`
2. Copy the contents of the `build` folder to `/usr/share/nginx/html`
3. Choose configuration:
   - **For HTTPS (recommended):** Copy `nginx.conf` to `/etc/nginx/sites-available/koli-catch`
   - **For HTTP only:** Copy `nginx-http-only.conf` to `/etc/nginx/sites-available/koli-catch`
4. **If using HTTPS:**
   - Update SSL certificate paths in `nginx.conf`:
     ```nginx
     ssl_certificate /etc/nginx/ssl/cert.pem;
     ssl_certificate_key /etc/nginx/ssl/key.pem;
     ```
   - Place your SSL certificates in the specified directory
   - Consider using Let's Encrypt for free SSL certificates
5. Create a symbolic link:
   ```bash
   sudo ln -s /etc/nginx/sites-available/koli-catch /etc/nginx/sites-enabled/
   ```
6. Test configuration and restart:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

**Configuration:**
- The `nginx.conf` file includes:
  - HTTPS with HTTP to HTTPS redirect
  - Client-side routing support
  - Gzip compression
  - Security headers (including Content Security Policy)
  - Cache optimization
- The `nginx-http-only.conf` file is for environments where HTTPS is not available

### 5. GitHub Pages

1. Install gh-pages package:
   ```bash
   yarn add --dev gh-pages
   ```

2. Add to `package.json` scripts:
   ```json
   "scripts": {
     "predeploy": "yarn build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```bash
   yarn deploy
   ```

**Note:** Update `package.json` with your repository URL in the `homepage` field.

### 6. AWS S3 + CloudFront

1. Build the project: `yarn build`
2. Create an S3 bucket
3. Enable static website hosting on the S3 bucket
4. Upload the `build` folder contents to S3
5. Set bucket policy for public read access
6. Create a CloudFront distribution pointing to the S3 bucket
7. Configure CloudFront with:
   - Default root object: `index.html`
   - Error pages: 404 → `/index.html` (for React Router)

### 7. Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t koli-catch .
docker run -p 80:80 koli-catch
```

## Environment Variables

If you need environment variables, create a `.env.production` file:
```
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

## Post-Deployment Checklist

- [ ] Verify the website loads correctly
- [ ] Test all routes (client-side routing)
- [ ] Check images and assets load properly
- [ ] Verify analytics (PostHog) is working
- [ ] Test contact form functionality
- [ ] Check mobile responsiveness
- [ ] Verify HTTPS is enabled and redirects HTTP to HTTPS (if applicable)
- [ ] Test SSL certificate validity and expiration
- [ ] Verify Content Security Policy is not blocking resources
- [ ] Test page load speed
- [ ] Check browser console for errors
- [ ] Verify loading indicator disappears after React mounts
- [ ] Test error handling (disable JavaScript temporarily)

## Troubleshooting

### Routes not working (404 errors)
- Ensure redirect/rewrite rules are configured correctly
- For Apache: Enable `mod_rewrite`
- For Nginx: Check `try_files` directive

### Assets not loading
- Verify asset paths are correct (should be relative)
- Check that the `build` folder structure is preserved
- Ensure static files are in the correct location

### Build fails
- Check Node.js version (should be 18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && yarn install`
- Clear build cache: `rm -rf build`

## Support

For issues or questions, please contact the development team.

