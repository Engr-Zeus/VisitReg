/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/active", destination: "/admin/active", permanent: false },
      { source: "/logs", destination: "/admin/logs", permanent: false },
    ];
  },
};

export default nextConfig;
