const Path = require('node:path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig = {
  basePath: basePath,
  assetPrefix: `${basePath}/`,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  experimental: {
    esmExternals: true,
  },
  webpack: (config) => {
    // Extend Webpack configuration to handle frag and vert files
    config.module.rules.push({
      test: /\.(vert|frag)$/i,
      type: 'asset/source',
    });
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    config.resolve.alias['@tgd'] = Path.resolve(__dirname, 'src/views/MorphoViewer/tgd/');
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
