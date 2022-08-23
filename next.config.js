const { withSentryConfig } = require('@sentry/nextjs');

const withBundleAnalyzer = require('@next/bundle-analyzer') ({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPluginOptions = {
  silent: true,
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const day = 60 * 60 * 24;

const nextConfig = {
  basePath: basePath,
  assetPrefix: `${basePath}/`,
  trailingSlash: true,
  swcMinify: true,
  images: {
    path: `${basePath}/_next/image`,
    minimumCacheTTL: 7 * day,
    formats: ['image/avif', 'image/webp'],
    domains: ['hippocampus-portal-auth-proxy', 'localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: false,
  productionBrowserSourceMaps: true,
  output: 'standalone',
  experimental: {
    esmExternals: true,
  },
  async redirects() {
    return [
      {
        source: '/experimental-data',
        destination: '/experimental-data/neuronal-morphology',
        permanent: false,
      },
      {
        source: '/digital-reconstructions',
        destination: '/digital-reconstructions/neurons',
        permanent: false,
      },
    ]
  },
};


module.exports = withBundleAnalyzer(withSentryConfig(nextConfig, SentryWebpackPluginOptions));
