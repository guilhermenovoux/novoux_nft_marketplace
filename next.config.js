/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['novoux.infura-ipfs.io'],
//     remotePatterns: [

//       {
//         protocol: 'https',
//         hostname: 'novoux.infura-ipfs.io',
//         pathname: '/ipfs/**',
//       },
//     ],
//   },
// };

const dedicatedEndPoint = 'https://novoux.infura-ipfs.io';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [dedicatedEndPoint, 'novoux.infura-ipfs.io'],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};
module.exports = nextConfig;


module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
};
