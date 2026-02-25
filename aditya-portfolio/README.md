# Aditya's Professional Portfolio

A modern, interactive, and production-ready portfolio website showcasing biotechnology expertise, projects, and professional achievements.

## ✨ Features

- **Modern Design**: Glassmorphism effects, smooth animations, responsive layout
- **Interactive Elements**: Typewriter animations, carousel components, gradient backgrounds
- **File Management**: Upload and manage PowerBI, Tableau, and other dashboard files
- **Security-First**: Hashed password protection, secure API routes, no exposed secrets
- **Performance Optimized**: Lazy loading, image optimization, code splitting
- **Cross-Platform**: Works on Vercel, Netlify, Railway, Render, and any Node.js host
- **Production Ready**: Security headers, proper error handling, TypeScript strict mode
- **Mobile Responsive**: Fully responsive design for all devices

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 20.x (recommended) or 18.x minimum
- **npm**: 10.x or later

### Installation

```bash
# Clone repository
git clone https://github.com/codewithadityakashyap/portfolio.git
cd portfolio

# Install dependencies
npm install

# Configure environment (optional for local dev)
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.8 (latest stable)
- **React**: 19.2.4 with strict mode
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Shadcn UI + Radix UI
- **Storage**: Vercel Blob
- **Language**: TypeScript 5 (strict mode)
- **Deployment**: Vercel, Netlify, Railway, Render

## 📊 Project Status

| Item | Status | Details |
|------|--------|---------|
| **Security** | ✅ Hardened | CSP headers, hashed auth, no exposed secrets |
| **Performance** | ✅ Optimized | Image optimization, code splitting, minification |
| **Compatibility** | ✅ Multi-platform | Vercel, Netlify, Railway, Render ready |
| **TypeScript** | ✅ Strict | Full strict mode enabled |
| **Dependencies** | ✅ Current | All dependencies up-to-date, no CVEs |
| **Build** | ✅ Clean | No warnings or errors |

## 🚢 Deployment

### One-Click Deployment Options

**Vercel** (Recommended - fastest):
```bash
npm i -g vercel
vercel
```

**Netlify** (via GitHub):
- Connect repository → Select `main` branch
- Build: `npm run build`
- Publish: `.next`

**Railway/Render**:
- Connect GitHub repository
- Automatic deployment on push

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔐 Security Features

✅ **Implemented**:
- Content-Security-Policy headers
- X-Frame-Options, X-Content-Type-Options
- Password hashing (SHA-256)
- No exposed API keys or secrets
- CORS validation
- File type whitelist
- File size limits (100MB)
- Filename sanitization
- Production logging (no sensitive data)
- TypeScript strict mode

✅ **Environment Protection**:
- `.env.local` not committed
- `.env.example` template provided
- Clear separation of secrets and code

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guides for all platforms
- **[.env.example](./.env.example)** - Environment variables configuration
- **[next.config.mjs](./next.config.mjs)** - Performance & security settings
- **[tsconfig.json](./tsconfig.json)** - TypeScript strict configuration

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── api/               # Secure API routes
│   ├── layout.tsx         # Root layout with fonts
│   ├── globals.css        # Styles & animations
│   └── page.tsx           # Main portfolio
├── components/ui/         # Shadcn components
├── public/                # Images & assets
├── next.config.mjs        # Next.js config (security)
├── tsconfig.json          # TypeScript strict config
├── netlify.toml           # Netlify config
├── vercel.json            # Vercel config
├── .env.example           # Env template
└── DEPLOYMENT.md          # Deployment guide
```

## 🧪 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm start            # Start production server
npm run type-check   # TypeScript validation
npm run lint         # Code linting
npm run clean        # Clean build artifacts
```

## ⚡ Performance

**Build Optimization**:
- ✅ Automatic code splitting
- ✅ Image optimization (AVIF/WebP)
- ✅ Tree-shaking enabled
- ✅ Minification enabled
- ✅ Font optimization
- ✅ Gzip compression

**Target Scores**:
- Lighthouse Performance: 95+
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s

## 🔧 Configuration Files

### next.config.mjs
- Security headers (CSP, X-Frame-Options, etc.)
- Image optimization with AVIF/WebP
- Webpack optimization & tree-shaking
- Strict mode enabled

### tsconfig.json
- Strict type checking enabled
- ES2020 target for modern syntax
- Path aliases configured
- All strict compiler options

### netlify.toml
- Optimized for Next.js 15+
- Cache headers for static assets
- Security headers configured
- Build optimization

### vercel.json
- Next.js optimization
- Node.js 20.x configured
- API function configuration
- Security headers

## 🐛 Before Going Live

Checklist:
- [ ] Run `npm run build` successfully
- [ ] Run `npm run type-check` with no errors
- [ ] Configure `.env.local` with your values
- [ ] Test locally: `npm run dev`
- [ ] Verify security headers in network tab
- [ ] Test file upload functionality
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Push to GitHub
- [ ] Deploy to your platform

## 📞 Support

- **Deployment Issues**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **TypeScript Errors**: Run `npm run type-check`
- **Build Failures**: Run `npm run clean && npm install && npm run build`
- **Framework Questions**: [Next.js Docs](https://nextjs.org/docs)

## 📄 License

MIT License - feel free to use this as a template

## 👤 Author

**Aditya Raj**
- GitHub: [@codewithadityakashyap](https://github.com/codewithadityakashyap)
- Portfolio: [yoursite.com]

---

**Status**: ✅ Production Ready  
**Node.js**: 18.x or 20.x  
**Next.js**: 15.2.8  
**React**: 19.2.4
