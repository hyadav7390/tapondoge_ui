/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      url: 'url/',
      zlib: 'browserify-zlib',
      http: 'stream-http',
      https: 'https-browserify',
      assert: 'assert/',
      os: 'os-browserify/browser',
      path: 'path-browserify',
      buffer: 'buffer/',
    };
    return config;
  },
  images: {
    domains: ['api.qrserver.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/tapondoge/:path*',
        destination: 'https://api.tapondoge.com/api/tod/:path*',
      },
      {
        source: '/api/tap/:path*',
        destination: 'https://tap.tapondoge.com/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
