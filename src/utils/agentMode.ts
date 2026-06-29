import type { CollectionEntry } from "astro:content";
import { AGENT_TOOLS } from "@/config";

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
 * post's custom prompts. Embeds the canonical post URL so the drafted post
 * links back to the original (the traffic-driving goal of the feature).
 */
export function getLinkedInPrompt(postUrl: string): { label: string; text: string } {
  return {
    label: "Draft a LinkedIn post",
    text: `Write a LinkedIn post summarizing my takeaways from this in my voice — hook, 3 short takeaways, and end with a link to the original post (${postUrl}) so people can read it.`,
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
