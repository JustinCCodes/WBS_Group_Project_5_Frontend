/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const DEFAULT_API = "http://localhost:8000";
    const DEFAULT_AUTH = "http://localhost:8001";

    const apiCandidate =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      DEFAULT_API;

    const authCandidate =
      process.env.NEXT_PUBLIC_AUTH_API_URL ||
      process.env.NEXT_PUBLIC_AUTH_SERVER_URL ||
      process.env.AUTH_SERVER_URL ||
      "";

    const API = String(apiCandidate).replace(/\/$/, "");
    const AUTH_BASE =
      String(authCandidate).replace(/\/$/, "") || API || DEFAULT_AUTH;

    const buildApiDest = (base: string): string => {
      const b = String(base).replace(/\/$/, "");
      // If base already includes /api/v1 don't append it again
      return /\/api\/v1(\/)?$/.test(b) ? `${b}/:path*` : `${b}/api/v1/:path*`;
    };

    const buildAuthDest = (base: string): string => {
      const b = String(base).replace(/\/$/, "");
      if (/\/api\/v1\/auth(\/)?$/.test(b)) return `${b}/:path*`;
      if (/\/api\/v1(\/)?$/.test(b)) return `${b}/auth/:path*`;
      return `${b}/api/v1/auth/:path*`;
    };

    return [
      { source: "/api/auth/:path*", destination: buildAuthDest(AUTH_BASE) },
      { source: "/api/:path*", destination: buildApiDest(API) },
    ];
  },
};

module.exports = nextConfig;
