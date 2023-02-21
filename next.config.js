/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },

  // publicRuntimeConfig: {
  //   // Will be available on both server and client
  //   backendUrl: process.env.NEXT_PUBLIC_API_URL,
  // },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  publicRuntimeConfig: {
    // Will be available on both server and client
    URI: 'http://localhost:3002',
  },

  images: {
    domains: ['lh3.googleusercontent.com', 'videodelivery.net'],
  },

  rewrites: async () => [
    {
      // has: [{ type: 'host', value: '(?<siteHost>.*)' }],

      source: '/api/:path*',
      destination: 'http://localhost:3000/api/:path*',
    },
  ],

  // async redirects() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3000/api/:path*',
  //       permanent: false,
  //     },
  //   ];
  // },

  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;
