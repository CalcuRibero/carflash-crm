/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/kanban",
        permanent: false,
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/:path*",
  //       destination: `${process.env.BACKEND_API_URL ?? "http://localhost:3001"}/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
