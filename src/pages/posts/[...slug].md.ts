import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { getAgentSummary } from "@/utils/agentMode";
import { getPath } from "@/utils/getPath";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.map((post) => ({
    // Key the slug off getPath (not raw post.id) so the .md URL always matches
    // the canonical HTML URL. Strip the leading "/" for the [...slug] param.
    params: { slug: getPath(post.id, post.filePath, false).replace(/^\//, "") },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };

  // Prepend an agent-facing TL;DR (authored agentSummary, else description).
  const summary = getAgentSummary(post);
  const body = `> **TL;DR:** ${summary}\n\n${post.body ?? ""}`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
