/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'wemine-api.onrender.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost', port: '4000' },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://wemine-api.onrender.com/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://wemine-api.onrender.com/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
