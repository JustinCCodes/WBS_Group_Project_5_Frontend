/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    // This will get full backend URL from Vercel env
    const API_DESTINATION = (
      process.env.API_BASE_URL || "http://localhost:8000/api/v1"
    ).replace(/\/$/, ""); // Removes trailing slash

    return [
      // This single rule proxies all /api/* requests to the backend's /api/v1/*
      {
        source: "/api/:path*",
        destination: `${API_DESTINATION}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply to all API routes
        source: "/api/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
