import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

const postFilter = ({ data }: CollectionEntry<"blog">) => {
  const isPublishTimePassed =
    Date.now() > new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  // Drafts are visible in `astro dev` only so they can be previewed locally;
  // production builds still exclude them.
  const isVisibleDraftState = !data.draft || import.meta.env.DEV;
  return isVisibleDraftState && !data.unlisted && (import.meta.env.DEV || isPublishTimePassed);
};

export default postFilter;
