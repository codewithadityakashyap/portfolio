# Production Deployment Guide

## Prerequisites

- **Node.js**: 20.x (recommended) or 18.x minimum
- **npm**: 10.x or later
- **Git**: For version control
- **Vercel Blob Token**: For file upload functionality

## Environment Setup

### 1. Create `.env.local` File

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Fill in the required values:
```env
NODE_ENV=production
BLOB_READ_WRITE_TOKEN=your_token_here
ADMIN_PASSWORD_HASH=your_hash_here
ALLOWED_ORIGINS=https://yourdomain.com
```

### 2. Generate Admin Password Hash

To create a new password hash:
```bash
node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"
```

## Pre-Deployment Checklist

- [ ] All dependencies installed: `npm install`
- [ ] TypeScript checks pass: `npm run type-check`
- [ ] Build succeeds locally: `npm run build`
- [ ] No console.log statements in production code
- [ ] Environment variables configured correctly
- [ ] Git repository up to date
- [ ] Security headers configured in `next.config.mjs`

## Deployment Options

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- Native Next.js optimization
- Zero-config deployment
- Automatic performance optimizations
- Best compatibility with Blob storage

### Steps:

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "Production-ready portfolio"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Select project root (default: `.`)
   - Click "Deploy"

3. **Set Environment Variables**:
   - In Vercel Dashboard → Settings → Environment Variables
   - Add from `.env.local`:
     - `BLOB_READ_WRITE_TOKEN`
     - `ADMIN_PASSWORD_HASH`
     - `ALLOWED_ORIGINS`

4. **Configure Domain** (Optional):
   - Settings → Domains
   - Add your custom domain
   - Follow DNS instructions

### Verification:
```bash
# Check deployment status
vercel status

# View logs
vercel logs
```

---

## Option 2: Netlify

### Why Netlify?
- Excellent performance
- Good Next.js support with plugin
- Great analytics
- Edge functions available

### Steps:

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
# First time
netlify deploy --prod

# Subsequent deployments (with Git)
git push origin main
```

3. **Connect GitHub** (Recommended for CI/CD):
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Select GitHub and your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
     - **Node version**: `20.11.0`

4. **Set Environment Variables**:
   - Site Settings → Build & Deploy → Environment
   - Add variables from `.env.local`:
     - `BLOB_READ_WRITE_TOKEN`
     - `ADMIN_PASSWORD_HASH`
     - `ALLOWED_ORIGINS`
     - `NODE_ENV=production`

5. **Add Netlify Plugin** (Optional but recommended):
   - Create/update `netlify.toml` (already done)
   - Install plugin: `npm install -D @netlify/plugin-nextjs`

### Verification:
```bash
# Check deployment status
netlify status

# View logs
netlify logs
```

---

## Option 3: Railway.app

### Why Railway?
- Simple deployment
- Automatic SSL
- Good free tier

### Steps:

1. **Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Approve Railway's GitHub access

2. **Configure Service**:
   - In Railway Dashboard
   - Add environment variables from `.env.local`
   - Build command: `npm run build`
   - Start command: `npm start`

3. **Domain Setup**:
   - Settings → Domains
   - Add custom domain

---

## Option 4: Render.com

### Why Render?
- Free tier available
- PostgreSQL support
- Simple Git integration

### Steps:

1. **Create New Web Service**:
   - [render.com/new](https://render.com/new)
   - Select "Web Service"
   - Connect GitHub repository

2. **Configure**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `20` (in Environment)

3. **Environment Variables**:
   - Add all variables from `.env.local`

---

## Security Configuration

### Essential Environment Variables

```env
# Required
NODE_ENV=production
BLOB_READ_WRITE_TOKEN=<from Vercel Blob>
ADMIN_PASSWORD_HASH=<SHA-256 hash of your password>

# Security
ALLOWED_ORIGINS=https://yourdomain.com

# Optional
VERCEL_URL=<auto-set by Vercel>
```

### Security Headers

Already configured in:
- `next.config.mjs`: Content-Security-Policy, X-Frame-Options, etc.
- `netlify.toml`: Additional headers for Netlify
- `vercel.json`: Vercel-specific security

### Secure API Routes

All API routes implement:
- ✅ Password authentication (hashed)
- ✅ CORS validation
- ✅ File type validation
- ✅ File size limits (100MB)
- ✅ Filename sanitization
- ✅ No sensitive data in logs (production)
- ✅ Proper error handling

---

## Performance Optimization

### Build Output
```bash
npm run build
```

Expected output:
- Image optimization enabled
- Tree shaking: Enabled
- Minification: Enabled
- Code splitting: Automatic
- Font optimization: Enabled

### Monitoring

**Lighthouse Scores** (Target 90+):
```bash
# Run lighthouse locally
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

**Performance Checklist**:
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.5s

---

## Troubleshooting

### Build Fails

**Error**: `BLOB_READ_WRITE_TOKEN not found`
- **Solution**: Add environment variable to deployment platform

**Error**: `Module not found`
- **Solution**: Run `npm install` and verify dependencies

### API Upload Returns 401

- Check `ADMIN_PASSWORD_HASH` is correctly set
- Generate new hash: `node -e "console.log(require('crypto').createHash('sha256').update('your-password').digest('hex'))"`
- Update environment variable

### Slow Performance

- Enable Edge caching (Vercel/Netlify settings)
- Verify images are optimized
- Check bundle size: `npm run analyze`

### CORS Errors

- Verify domain is in `ALLOWED_ORIGINS`
- Format: `https://yourdomain.com,https://www.yourdomain.com`
- Redeploy after updating

---

## Post-Deployment

### Verify Deployment

1. **Test Homepage**:
   - Check typewriter animation loads
   - Verify responsive design on mobile
   - Check all navigation links work

2. **Test File Upload** (if admin panel):
   - Upload a test PDF/image
   - Verify upload succeeds
   - Verify file appears in list

3. **Performance Test**:
   - Run Lighthouse
   - Check Core Web Vitals
   - Monitor performance over time

### Monitoring & Maintenance

- **Vercel Analytics**: Built-in, no extra setup
- **Netlify Analytics**: Optional add-on
- **Error Tracking**: Monitor deployment logs weekly
- **Uptime Monitoring**: Use tools like UptimeRobot

### Update Schedule

- Check for dependency updates monthly: `npm outdated`
- Update security patches immediately: `npm audit fix`
- Review and update Next.js: `npm update next`

---

## Rollback Procedure

### If deployment fails:

**Vercel**:
```bash
# View deployments
vercel deployments

# Rollback to previous
vercel rollback
```

**Netlify**:
- Dashboard → Deploys → Select previous deploy → "Publish deploy"

**GitHub/Git**:
```bash
git revert HEAD
git push origin main
```

---

## Next Steps

1. Deploy to your chosen platform
2. Test all features in production
3. Set up monitoring
4. Share portfolio with recruiters
5. Monitor performance metrics

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Blob Storage**: https://vercel.com/docs/storage/vercel-blob

---

**Deployment Status**: ✅ Production Ready
**Last Updated**: 2026-02-24
**Next.js Version**: 15.2.8
**Node.js**: 20.x
