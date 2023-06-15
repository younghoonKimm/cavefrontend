/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },
  experimental: {
    reactMode: 'concurrent',
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

module.exports = withBundleAnalyzer(nextConfig);
