import type { MetadataRoute } from "next";

import { scholarships } from "@/data/scholarships";

const baseUrl = "https://grantly.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/discover`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/dashboard`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/documents`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const scholarshipRoutes: MetadataRoute.Sitemap = scholarships.map(
    (scholarship) => ({
      url: `${baseUrl}/scholarship/${scholarship.id}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...scholarshipRoutes];
}
