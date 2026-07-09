import createNextIntlPlugin from 'next-intl/plugin';

const medusaBackendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL

let medusaImageRemotePattern
try {
  if (medusaBackendUrl) {
    const u = new URL(medusaBackendUrl)
    medusaImageRemotePattern = {
      protocol: u.protocol.replace(":", ""),
      hostname: u.hostname,
      port: u.port || "",
      pathname: "/**",
    }
  }
} catch {
  medusaImageRemotePattern = undefined
}

let storageImageRemotePattern
try {
  if (storageUrl) {
    const u = new URL(storageUrl)
    storageImageRemotePattern = {
      protocol: u.protocol.replace(":", ""),
      hostname: u.hostname,
      port: u.port || "",
      pathname: "/**",
    }
  }
} catch {
  storageImageRemotePattern = undefined
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '..',
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 375, 414, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      ...(medusaImageRemotePattern ? [medusaImageRemotePattern] : []),
      ...(storageImageRemotePattern ? [storageImageRemotePattern] : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60, stale-while-revalidate=30'
          }
        ]
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Only apply strict CSP in production
      ...(process.env.NODE_ENV === "production" ? [{
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com",
              "frame-src 'self' https://accounts.google.com https://www.google.com https://maps.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
              "font-src 'self' https://fonts.gstatic.com",
              `img-src 'self' data: blob: https://*.r2.cloudflarestorage.com https://*.s3.amazonaws.com https://medusa-public-images.s3.eu-west-1.amazonaws.com https://images.unsplash.com https://*.unsplash.com https://placehold.co${medusaBackendUrl ? ` ${medusaBackendUrl}` : ""}${storageUrl ? ` ${storageUrl}` : ""}`,
              `connect-src 'self' https://accounts.google.com https://*.meilisearch.com${medusaBackendUrl ? ` ${medusaBackendUrl}` : ""}`,
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      }] : []),
      // In development, allow localhost for Medusa backend images
      ...(process.env.NODE_ENV === "development" ? [{
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com",
              "frame-src 'self' https://accounts.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: http://localhost:9000 https://*.r2.cloudflarestorage.com https://*.s3.amazonaws.com https://medusa-public-images.s3.eu-west-1.amazonaws.com https://images.unsplash.com https://*.unsplash.com https://placehold.co",
              "connect-src 'self' http://localhost:9000 https://accounts.google.com https://*.meilisearch.com",
            ].join("; "),
          },
        ],
      }] : []),
    ];
  },
};

export default withNextIntl(nextConfig);
