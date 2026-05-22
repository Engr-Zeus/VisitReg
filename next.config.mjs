/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/active", destination: "/admin/active", permanent: false },
      { source: "/logs", destination: "/admin/logs", permanent: false },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
