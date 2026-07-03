import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fetchPublishedPosts, fetchTopics } from "@/lib/cms/queries";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [posts, topics] = await Promise.all([fetchPublishedPosts(), fetchTopics()]);
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/journal", changefreq: "weekly", priority: "0.9" },
          { path: "/visuals", changefreq: "weekly", priority: "0.8" },
          { path: "/topics", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "yearly", priority: "0.5" },
          { path: "/contact", changefreq: "yearly", priority: "0.5" },
          ...posts.map((p) => ({
            path: `/journal/${p.slug}`,
            lastmod: p.date,
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
          ...topics.map((t) => ({
            path: `/topics/${t.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              "lastmod" in e && e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ].filter(Boolean).join("\n"),
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
