/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static optimization for better performance
  poweredByHeader: false,
  // Enable image optimization
  images: {
    domains: [],
  },
}

export default nextConfig 