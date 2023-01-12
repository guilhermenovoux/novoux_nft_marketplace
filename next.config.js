/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['novoux.infura-ipfs.io'],
    remotePatterns: [

      {
        protocol: 'https',
        hostname: 'infura-ipfs.io',
        pathname: '/ipfs/**',
      },
    ],
  },
};

module.exports = nextConfig;
