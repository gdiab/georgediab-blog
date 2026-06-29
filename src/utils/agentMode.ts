import type { CollectionEntry } from "astro:content";
import { AGENT_TOOLS, SITE } from "@/config";

export interface AgentPrompt {
  label: string;
  text: string;
  copyPayload: string; // text + PROMPT_SEPARATOR + fullMarkdown (primary "Copy")
  linkPayload: string; // text + "\n\nSource: " + mdUrl       (secondary deep-links)
}

/** Divider between the prompt and the inlined post markdown in a copy payload. */
export const PROMPT_SEPARATOR = "\n\n---\n\n";

interface GetPromptsArgs {
  post: CollectionEntry<"blog">;
  mdUrl: string;
  postUrl: string;
}

/**
 * The "share to LinkedIn" prompt — a single source of truth so it stays
 * identical whether it appears inside the default set or is appended to a
 * post's custom prompts. Interviews the reader for THEIR reaction and frames
 * the post as something they read and are passing on (crediting the author and
 * linking back) — so the draft never claims the reader wrote it or did the
 * things in it. Embeds the canonical post URL (the traffic-driving goal).
 */
export function getLinkedInPrompt(postUrl: string): { label: string; text: string } {
  return {
    label: "Draft a LinkedIn post",
    text: `I just read this post by ${SITE.author} and want to share it on LinkedIn. First, ask me 2–3 short questions about my honest reaction — what stood out, why it matters to me, and how it connects to my own work. Then write a brief LinkedIn post in my voice that shares this as something I read and recommend — NOT something I wrote or did myself. Base it on my answers, keep it to a few tight lines, and close by crediting ${SITE.author} and linking to the original (${postUrl}) so people can read the full post.`,
  };
}

/**
 * Generic default prompts shown on every post that doesn't define its own.
 * Voice: the reader's ("me"/"my"). Includes the LinkedIn share prompt at #3.
 */
export function getDefaultPrompts(postUrl: string): { label: string; text: string }[] {
  return [
    {
      label: "Summarize",
      text: "Read the linked post and give me the core argument in 5 bullets, then the one idea most worth remembering.",
    },
    {
      label: "Make it actionable",
      text: "Turn this post into a step-by-step checklist I could actually follow this week.",
    },
    getLinkedInPrompt(postUrl),
    {
      label: "Apply to me",
      text: "Ask me 3 questions about my situation, then tell me how the ideas in this post apply to me specifically.",
    },
    {
      label: "Go deeper",
      text: "What did this post assume or skip that I should understand? List the open questions and what to read next.",
    },
  ];
}

/**
 * Returns the prompt cards for a post. Uses `post.data.agentPrompts` if present
 * (labelled "Prompt 1..N" since custom prompts are bare strings), else the
 * generic default set. The LinkedIn share prompt is always present: it lives at
 * #3 in the default set, and is appended to custom prompts so every post can
 * drive traffic back to itself. Each card carries a self-contained `copyPayload`
 * (prompt + full markdown) and a `linkPayload` (prompt + .md URL).
 */
export function getAgentPrompts({ post, mdUrl, postUrl }: GetPromptsArgs): AgentPrompt[] {
  const fullMarkdown = post.body ?? "";
  const custom = post.data.agentPrompts;

  const base =
    custom && custom.length > 0
      ? [
          ...custom.map((text, i) => ({ label: `Prompt ${i + 1}`, text })),
          getLinkedInPrompt(postUrl),
        ]
      : getDefaultPrompts(postUrl);

  return base.map(({ label, text }) => ({
    label,
    text,
    copyPayload: text + PROMPT_SEPARATOR + fullMarkdown,
    linkPayload: `${text}\n\nSource: ${mdUrl}`,
  }));
}

/** Agent-facing summary: authored `agentSummary` or fallback to `description`. */
export function getAgentSummary(post: CollectionEntry<"blog">): string {
  return post.data.agentSummary ?? post.data.description;
}

/** URL-encodes a linkPayload against each provider's prefill base. */
export function buildAgentLinks(linkPayload: string): { chatgpt: string; claude: string } {
  const q = encodeURIComponent(linkPayload);
  return {
    chatgpt: AGENT_TOOLS.chatgpt.base + q,
    claude: AGENT_TOOLS.claude.base + q,
  };
}
