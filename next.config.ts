import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
          ignoreBuildErrors: true,
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
    serverExternalPackages: ["@prisma/client", "prisma"],
    images: {
          remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com" },
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "avatars.githubusercontent.com" },
            { protocol: "https", hostname: "uploadthing.com" },
            { protocol: "https", hostname: "utfs.io" },
                ],
    },
    async headers() {
          return [
            {
                      source: "/(.*)",
                      headers: [
                        { key: "X-Frame-Options", value: "DENY" },
{ key: "X-Content-Type-Options", value: "nosniff" },
                        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                        { key: "X-XSS-Protection", value: "1; mode=block" },
                        {
                                      key: "Permissions-Policy",
                                      value: "camera=(), microphone=(), geolocation=()",
                        },
                        {
                                      key: "Content-Security-Policy",
                                      value: [
                                                      "default-src 'self'",
                                                      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
                                                      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                                                      "font-src 'self' https://fonts.gstatic.com",
                                                      "img-src 'self' data: https://res.cloudinary.com https://lh3.googleusercontent.com https://utfs.io",
                                                      "connect-src 'self' https://api.openai.com wss:",
                                                      "frame-src 'none'",
                                                    ].join("; "),
                        },
                                ],
            },
                ];
    },
    async redirects() {
          return [
            {
                      source: "/admin",
                      destination: "/admin/dashboard",
                      permanent: true,
            },
                ];
    },
};

  export default nextConfig;
