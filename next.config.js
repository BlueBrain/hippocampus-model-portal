const isProd = process.env.NODE_ENV === 'production';


const basePath = '/model';

module.exports = {
  trailingSlash: true,
  productionBrowserSourceMaps: true,
  basePath: basePath,
  assetPrefix: `${basePath}/`,
  images: {
    path: `${basePath}/_next/image`,
  },
  future: {
    webpack5: true,
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