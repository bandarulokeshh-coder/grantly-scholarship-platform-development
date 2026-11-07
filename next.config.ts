import type { NextConfig } from "next";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const externalDomains = [
  "scholarships.gov.in",
  "reliancefoundation.org",
  "sitaramjindalfoundation.org",
  "vidyasaarathi.co.in",
  "jntataendowment.org",
  "tatatrusts.org",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: externalDomains.map((domain) => ({
      protocol: "https",
      hostname: domain,
      pathname: "/**",
    })),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          ...externalDomains.map((domain) => ({
            key: "Link",
            value: `<https://${domain}>; rel=dns-prefetch`,
          })),
        ],
      },
    ];
  },
};

export default nextConfig;
