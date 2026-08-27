import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Vanity URLs Mark uses in places we do not control, and which 404 without
   * these. A dead link in print or in a newsletter that has already gone out
   * cannot be recalled, so the redirect belongs here rather than a correction
   * to whatever he wrote.
   *
   * - /built-this-way is the URL he put behind "Join the Launch Team" in the
   *   Aug 2026 newsletter, sent to the whole list.
   * - /powertools (no hyphen) is the spelling printed inside the book; the
   *   route is /power-tools. Once the book is printed this is permanent.
   */
  async redirects() {
    return [
      { source: '/built-this-way', destination: '/launch-team', permanent: true },
      { source: '/powertools', destination: '/power-tools', permanent: true },
      { source: '/powertools/:path*', destination: '/power-tools/:path*', permanent: true },
      // Printed in Chapter 8 as drmarkpirtle.com/boundarylessness.
      { source: '/boundarylessness', destination: '/power-tools/book', permanent: false },
      // Printed in Chapter 10 as drmarkpirtle.com/saaq.
      { source: '/saaq', destination: '/consultation', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      // Directus file assets (blog featured images, page media)
      {
        protocol: "https",
        hostname: "cms.drmarkpirtle.com",
        pathname: "/assets/**",
      },
      // Legacy Squarespace CDN — source for blog images pending migration to Directus
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
        pathname: "/content/**",
      },
    ],
  },
};

export default nextConfig;
