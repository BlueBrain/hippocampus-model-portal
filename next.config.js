const { withSentryConfig } = require('@sentry/nextjs');


const SentryWebpackPluginOptions = {
  silent: true,
};

const basePath = '/model';

const nextConfig = {
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  basePath: basePath,
  assetPrefix: `${basePath}/`,
  images: {
    path: `${basePath}/_next/image`,
  },
  webpack5: true,
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

module.exports = withSentryConfig(nextConfig, SentryWebpackPluginOptions);
