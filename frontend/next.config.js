/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `connect-src 'self' http://localhost:5252 http://localhost:8011 http://localhost:8081 http://127.0.0.1:8011 http://127.0.0.1:8081 ${process.env.NEXT_PUBLIC_SERVER_URL}`,
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8011',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
