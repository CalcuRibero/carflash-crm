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
  async headers() {
    return [
      // {
      //   source: '/manifest.json',
      //   headers: [
      //     {
      //       key: 'Content-Type',
      //       value: 'application/manifest+json',
      //     },
      //   ],
      // },
      // {
      //   source: '/sw.js',
      //   headers: [
      //     {
      //       key: 'Content-Type',
      //       value: 'application/javascript',
      //     },
      //     {
      //       key: 'Cache-Control',
      //       value: 'public, max-age=0, must-revalidate',
      //     },
      //   ],
      // },
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
