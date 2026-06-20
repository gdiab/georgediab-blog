import { getCollection } from "astro:content";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";

/**
 * Generates /llms.txt — a plain-text, markdown-formatted index of the site for
 * AI answer engines (see https://llmstxt.org). Lists every published post with
 * its canonical URL and description so LLMs can find and cite source content.
 */
export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  const lines = [
    `# ${SITE.title}`,
    "",
    `> ${SITE.desc}`,
    "",
    `Author: ${SITE.author}. Canonical site: ${SITE.website}`,
    "",
    "## Posts",
    "",
    ...sortedPosts.map(({ data, id, filePath }) => {
      const url = new URL(getPath(id, filePath), SITE.website).href;
      return `- [${data.title}](${url}): ${data.description}`;
    }),
    "",
    "## Pages",
    "",
    `- [About](${new URL("/about", SITE.website).href}): About ${SITE.author}.`,
    `- [RSS feed](${new URL("/rss.xml", SITE.website).href}): Full-text feed of all posts.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
