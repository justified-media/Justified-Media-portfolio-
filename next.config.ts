// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // This will match any subdomain of supabase.co
        port: '',
        pathname: '/storage/v1/object/public/**', // Restrict to public storage paths
      },
      {
        protocol: 'https',
        hostname: 'your-project-id.supabase.co', // Replace with your actual Supabase project ID
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Optional: Increase if you have many images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;