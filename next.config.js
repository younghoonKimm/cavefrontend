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

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  publicRuntimeConfig: {
    // Will be available on both server and client
    URI: process.env.NEXT_PUBLIC_API_URL,
  },

  images: {
    domains: ['lh3.googleusercontent.com', 'videodelivery.net'],
  },

  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
    },
  ],

  webpack: (config, context) => {
    config.watchOptions = {
      aggregateTimeout: 200,
      poll: 1000,
      ignored: /node_modules/,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
