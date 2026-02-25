/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance & Optimization
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  
  // Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers for Security
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://blob.vercelusercontent.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  
  // Redirects for clean URLs
  redirects: async () => {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  // Strict mode for development
  reactStrictMode: true,
  
  // Optimized webpack config
  webpack: (config, { isServer }) => {
    config.optimization.usedExports = true;
    return config;
  },
}

export default nextConfig
