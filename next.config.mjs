/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
  // Ensure Tailwind CSS is properly processed
  swcMinify: true,
  reactStrictMode: true,
  // This helps with build caching on Vercel
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
