// apps/storefront/next.config.js
const createNextIntlPlugin = require('next-intl/plugin')
const { withSentryConfig } = require('@sentry/nextjs')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF first (20-30% smaller than WebP), then WebP as fallback
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        // Cloudflare R2 public bucket (imágenes de producto vía Medusa)
        protocol: 'https',
        hostname: '*.r2.dev',
      },
    ],
  },
}

module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: true,               // sin spam en CI
    widenClientFileUpload: true,
    hideSourceMaps: true,       // no exponer source maps al browser
    autoInstrumentMiddleware: false, // evita overhead de Sentry en cada request del middleware
  }
)
