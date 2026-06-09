import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase', 'firebase-admin'],
  /* config options here */
  typescript: {
   ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:* https://*.firebase.google.com; frame-src 'self' https://mgeb.top https://*.mgeb.top https://www.youtube.com https://embed.dailymotion.com https://*.iframe.mediadelivery.net https://*.netu.tv https://meu-streaming-9d1d5.firebaseapp.com;",
          },
          {
            key: 'Permissions-Policy',
            value: "fullscreen=(self \"https://mgeb.top\")",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
