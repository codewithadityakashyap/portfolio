# Production Deployment Checklist

Use this checklist to ensure your portfolio is ready for production deployment.

## Pre-Build Verification

- [ ] **Dependencies Updated**
  ```bash
  npm outdated
  npm update
  npm audit
  ```
  - All critical security updates applied
  - No high-severity vulnerabilities

- [ ] **TypeScript Strict Mode**
  ```bash
  npm run type-check
  ```
  - Zero TypeScript errors
  - All types properly defined

- [ ] **Code Quality**
  ```bash
  npm run lint
  ```
  - No linting errors
  - Code follows best practices

## Security Verification

- [ ] **Environment Variables**
  - [ ] `.env.local` created from `.env.example`
  - [ ] `BLOB_READ_WRITE_TOKEN` configured
  - [ ] `ADMIN_PASSWORD_HASH` generated and set
  - [ ] `ALLOWED_ORIGINS` configured with your domain
  - [ ] `.env*` files in `.gitignore`

- [ ] **No Exposed Secrets**
  ```bash
  git log --all --oneline | grep -i "secret\|key\|token\|password"
  # Should return nothing
  ```
  - No commits with exposed credentials
  - No hardcoded API keys
  - No passwords in code

- [ ] **Security Headers**
  - [ ] Review `next.config.mjs` headers
  - [ ] CSP policy configured
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] X-Content-Type-Options: nosniff

- [ ] **API Route Security**
  - [ ] Password validation implemented
  - [ ] CORS checks enabled
  - [ ] File type whitelist active
  - [ ] File size limits enforced
  - [ ] Filename sanitization applied

## Build Verification

- [ ] **Build Successfully Completes**
  ```bash
  npm run build
  ```
  - Build completes without errors
  - Build completes without warnings
  - Output directory exists: `.next/`

- [ ] **Build Size Acceptable**
  ```bash
  du -sh .next/
  ```
  - Static files size reasonable
  - No unexpected large files

- [ ] **Images Optimized**
  - [ ] All images in `public/` folder
  - [ ] Image formats: JPEG, PNG, WebP, AVIF
  - [ ] Images properly sized
  - [ ] No console errors about images

- [ ] **No Console Logs in Production**
  ```bash
  grep -r "console\." app/ --include="*.ts" --include="*.tsx" | grep -v "console.error"
  # Should return nothing or only console.error
  ```

## Functionality Testing

- [ ] **Homepage Loads**
  ```bash
  npm run dev
  ```
  - [ ] Page loads without errors
  - [ ] No 404s in console
  - [ ] No CORS errors

- [ ] **Typewriter Animation**
  - [ ] Loads quickly (< 1 second)
  - [ ] Text types smoothly
  - [ ] Cursor visible

- [ ] **Navigation**
  - [ ] All navigation links work
  - [ ] Smooth scrolling functional
  - [ ] No broken links

- [ ] **File Upload Feature** (if applicable)
  - [ ] Upload page accessible
  - [ ] File selection works
  - [ ] Password validation works
  - [ ] Upload completes successfully
  - [ ] File appears in list
  - [ ] File deletion works

- [ ] **External Links**
  - [ ] GitHub link opens correctly
  - [ ] Social links work
  - [ ] No 404s

## Performance Testing

- [ ] **Lighthouse Audit**
  ```bash
  npm install -g lighthouse
  lighthouse https://localhost:3000 --view
  ```
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+

- [ ] **Core Web Vitals**
  - [ ] First Contentful Paint (FCP): < 1.5s
  - [ ] Largest Contentful Paint (LCP): < 2.5s
  - [ ] Cumulative Layout Shift (CLS): < 0.1
  - [ ] First Input Delay (FID): < 100ms

- [ ] **Mobile Performance**
  - [ ] Test on mobile device or DevTools
  - [ ] Responsive design verified
  - [ ] Touch interactions work
  - [ ] No layout shift on scroll

- [ ] **Bundle Size**
  ```bash
  npm run analyze  # if webpack-bundle-analyzer configured
  ```
  - [ ] Main bundle: < 250KB
  - [ ] Total JS: < 500KB

## Responsive Design Testing

Test on multiple devices:
- [ ] **Desktop** (1920px)
  - [ ] Layout correct
  - [ ] No horizontal scroll
  - [ ] Typography readable

- [ ] **Tablet** (768px)
  - [ ] Responsive layout works
  - [ ] Touch targets adequate
  - [ ] No overflow

- [ ] **Mobile** (375px)
  - [ ] Single column layout
  - [ ] Navigation accessible
  - [ ] Forms usable
  - [ ] Images scaled properly

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

All should display correctly with no critical errors.

## SEO Verification

- [ ] **Meta Tags**
  - [ ] Title set correctly
  - [ ] Description present
  - [ ] OG tags configured
  - [ ] Favicon present

- [ ] **Sitemap/Robots**
  - [ ] robots.txt configured (if needed)
  - [ ] sitemap.xml present (if needed)

- [ ] **Structured Data**
  - [ ] Schema markup valid
  - [ ] JSON-LD configured

## Pre-Deployment Tasks

- [ ] **Git Preparation**
  ```bash
  git status
  git log --oneline | head -5
  ```
  - [ ] No uncommitted changes
  - [ ] All changes committed
  - [ ] Meaningful commit messages

- [ ] **GitHub Repository**
  - [ ] Repository public/private as intended
  - [ ] Correct branch (`main` or `master`)
  - [ ] No sensitive files in history

- [ ] **Documentation**
  - [ ] README.md updated
  - [ ] DEPLOYMENT.md reviewed
  - [ ] Contributing guidelines (if applicable)

## Platform-Specific Checks

### For Vercel Deployment

- [ ] **Connect GitHub**
  - [ ] Repository connected
  - [ ] Correct branch selected
  - [ ] Auto-deploy enabled

- [ ] **Environment Variables**
  - [ ] `BLOB_READ_WRITE_TOKEN` set
  - [ ] `ADMIN_PASSWORD_HASH` set
  - [ ] `ALLOWED_ORIGINS` set
  - [ ] `NODE_ENV=production`

- [ ] **Build Settings**
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `.next`
  - [ ] Node.js Version: 20.x

- [ ] **Domain Configuration**
  - [ ] Domain added (if custom)
  - [ ] SSL certificate auto-installed
  - [ ] DNS configured correctly

### For Netlify Deployment

- [ ] **Connect GitHub**
  - [ ] Repository authorized
  - [ ] Branch selected (`main`)
  - [ ] Build settings configured

- [ ] **Build Configuration**
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `.next`
  - [ ] Node version: 20.11.0 (in netlify.toml)

- [ ] **Environment Variables**
  - [ ] All production vars set
  - [ ] No sensitive data in logs

- [ ] **Plugins**
  - [ ] @netlify/plugin-nextjs installed (optional)
  - [ ] Plugin configured in netlify.toml

- [ ] **Domain Setup**
  - [ ] Custom domain configured
  - [ ] SSL certificate auto-installed

### For Railway/Render

- [ ] **GitHub Connection**
  - [ ] Repository connected
  - [ ] Correct branch tracked
  - [ ] Auto-deploy enabled

- [ ] **Environment Configuration**
  - [ ] Node.js version: 20.x
  - [ ] All env variables set
  - [ ] Build cache enabled

- [ ] **Deployment**
  - [ ] Build command correct
  - [ ] Start command: `npm start`
  - [ ] Logs visible

## Post-Deployment Verification

After deploying to production:

- [ ] **Site Loads**
  ```bash
  curl https://yourdomain.com
  ```
  - [ ] HTTP 200 response
  - [ ] HTML content received
  - [ ] No redirects or errors

- [ ] **Performance in Production**
  - [ ] Page loads in < 2s
  - [ ] No 404s in DevTools
  - [ ] Images load correctly
  - [ ] No console errors

- [ ] **Security Headers Present**
  ```bash
  curl -I https://yourdomain.com
  ```
  - [ ] Content-Security-Policy header
  - [ ] X-Frame-Options header
  - [ ] X-Content-Type-Options header
  - [ ] HTTPS only (no HTTP)

- [ ] **File Upload Works**
  - [ ] Upload accessible
  - [ ] File upload successful
  - [ ] File downloadable
  - [ ] File deletion works

- [ ] **Mobile Works**
  - [ ] Responsive on mobile
  - [ ] Touch interactions work
  - [ ] No console errors

- [ ] **Third-Party Services**
  - [ ] Analytics tracking works (if used)
  - [ ] External links functional
  - [ ] Third-party scripts load

## Monitoring Setup

- [ ] **Error Tracking**
  - [ ] Error monitoring enabled
  - [ ] Sentry or similar configured (optional)
  - [ ] Alerts set up

- [ ] **Performance Monitoring**
  - [ ] Vercel Analytics enabled (Vercel)
  - [ ] Netlify Analytics enabled (Netlify)
  - [ ] Custom monitoring (if needed)

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot or similar configured
  - [ ] Alerts set up
  - [ ] Check interval: 5 minutes

- [ ] **Logs Configured**
  - [ ] Access logs visible
  - [ ] Error logs configured
  - [ ] Log retention set

## Maintenance Plan

- [ ] **Dependency Updates**
  - [ ] Check monthly: `npm outdated`
  - [ ] Update patches immediately
  - [ ] Update minor versions monthly
  - [ ] Test before deploying

- [ ] **Security Audits**
  - [ ] Run `npm audit` weekly
  - [ ] Fix vulnerabilities immediately
  - [ ] Review security headers monthly

- [ ] **Backup Strategy**
  - [ ] GitHub repository as backup
  - [ ] Database backups (if applicable)
  - [ ] File storage backups (if applicable)

- [ ] **Performance Monitoring**
  - [ ] Review metrics monthly
  - [ ] Address performance issues
  - [ ] Optimize as needed

## Final Sign-Off

- [ ] **All Checks Complete**
  - [ ] Reviewed entire checklist
  - [ ] All items verified
  - [ ] No blockers remaining

- [ ] **Stakeholder Approval**
  - [ ] Portfolio owner reviewed
  - [ ] Functionality approved
  - [ ] Performance acceptable

- [ ] **Launch Decision**
  - [ ] Ready for production: ✅
  - [ ] Deployment authorized
  - [ ] Rollback plan understood

---

## Rollback Plan (If Issues)

1. **Vercel**: Click "Rollback" in Deployments tab
2. **Netlify**: Go to Deploys → Select previous deploy → Publish
3. **GitHub**: `git revert HEAD && git push`

## Emergency Contacts

- **Vercel Support**: https://vercel.com/help
- **Netlify Support**: https://www.netlify.com/support
- **GitHub Help**: https://docs.github.com

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Production URL**: _______________  
**Verification Complete**: ✅ YES ☐ NO

Checklist completed on: **________________**
