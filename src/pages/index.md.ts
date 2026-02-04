import type { APIRoute } from "astro";
import { SITE } from "@/config";

export const GET: APIRoute = async () => {
  const markdownContent = `# ${SITE.title} (@geediab)\n\n${SITE.desc}\n\n## Navigation\n\n- [About](/about.md)\n- [Recent Posts](/posts.md)\n- [RSS Feed](/rss.xml)\n\n## Links\n\n- X: [@geediab](https://x.com/geediab)\n- GitHub: [@gdiab](https://github.com/gdiab)\n- Email: me@georgediab.com\n\n---\n\n*This markdown view mirrors the main site at [georgediab.com](https://georgediab.com).*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
