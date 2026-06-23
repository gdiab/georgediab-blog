import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";

/**
 * Find posts related to the current one, scored by shared tags.
 *
 * Posts are ranked by the number of overlapping tags (more shared tags = more
 * related). Ties are broken by recency (newest first), which `getSortedPosts`
 * already guarantees. The current post is always excluded. When fewer than
 * `limit` tag-matched posts exist, the list is topped up with the most recent
 * remaining posts so every article links onward to something — keeping the
 * internal-link graph connected for crawlers and answer engines.
 */
const getRelatedPosts = (
  post: CollectionEntry<"blog">,
  posts: CollectionEntry<"blog">[],
  limit = 3
) => {
  const candidates = getSortedPosts(posts).filter((p) => p.id !== post.id);
  const currentTags = new Set(post.data.tags ?? []);

  const scored = candidates
    .map((p) => ({
      post: p,
      score: (p.data.tags ?? []).filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.score - a.score); // recency order preserved within equal scores

  const related = scored.filter(({ score }) => score > 0).map(({ post }) => post);

  // Top up with recent posts if there aren't enough tag matches.
  if (related.length < limit) {
    const relatedIds = new Set(related.map((p) => p.id));
    for (const p of candidates) {
      if (related.length >= limit) break;
      if (!relatedIds.has(p.id)) related.push(p);
    }
  }

  return related.slice(0, limit);
};

export default getRelatedPosts;
