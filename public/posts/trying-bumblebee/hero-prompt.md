# Hero image prompt — "Trying Bumblebee"

Generated from `docs/hero-image-style.md` with the `[TOPIC]` slot filled in for this post. Paste into your preferred image generator (Sora, ChatGPT image, Midjourney, etc.) and place the final 16:9 result at `public/posts/trying-bumblebee/hero.jpg`.

## Topic instantiation

The post is a practitioner walkthrough of running a read-only developer-endpoint scanner (Bumblebee) that walks lockfiles, package metadata, and plugin/MCP configs to flag known supply-chain compromises. Two ideas are doing the work in the post:

1. A read-only **scan** moving through a tree of developer-machine artifacts (lockfiles, package metadata, MCP configs, extension manifests).
2. An **inventory revelation** — that most of what's on a developer's machine wasn't put there by the developer.

Visual metaphor: a clean architecture-diagram composition (per option 2 in `hero-image-style.md`) where small rounded panels representing packages, plugins, and MCP configs flow left-to-right toward a central focal element that resembles a lens or scanner, with status dots indicating matches against catalogues. Most dots are quiet teal/cyan; one or two warm amber dots glow on the central element to suggest active inspection rather than a finding.

## Full prompt

Create a wide 16:9 editorial hero illustration for a technical software blog. Style should match a modern developer-focused publication: clean, cinematic, slightly painterly digital illustration with soft depth and atmospheric lighting.

Use a deep navy or blue-gray background. Build the scene around a clear central focal point: a small, glowing **read-only scanner element** — render it as a rounded panel containing an abstract lens or magnifier shape, with a warm amber glow at its center, sitting at the visual center of the composition.

Around the central scanner, arrange a left-to-right flow of pale blue-gray rounded panels representing developer-machine artifacts being inspected: small cards with abstract code-pane shapes (unreadable short lines), lockfile-style nested-list shapes, and a few panels with simple connector or socket motifs suggesting plugin or extension configs. Use thin flow arrows or dotted paths to indicate the panels passing through or past the scanner. A subset of panels should carry small teal/cyan status dots (cleared); one or two should carry warm amber dots (under inspection). No panels should carry red or "alert" coloring — the scene is calm and methodical, not alarmed.

Composition should be spacious and balanced, optimized for a blog hero image with generous negative space. Use a clean architecture-diagram look with floating rounded panels, subtle shadows, gentle left-to-right flow, and the central scanner module as the focal anchor.

Color palette: midnight navy, slate blue, soft gray, off-white, warm amber/orange glow on the central element, teal/cyan accents on cleared panels, small green/yellow status dots elsewhere. Add subtle gradients, soft shadows, gentle bloom around the warm amber glow, and minimal background texture such as faint grid lines or dotted paths suggesting file-tree traversal.

Mood: thoughtful, technical, polished, calm, high-signal. The image should communicate "patient inspection" rather than "alert" or "incident response."

No branding, no logos, no readable text, no photorealistic stock-photo look, no clutter, no human figures, no faces.

## Negative prompt

Readable text, real code, logos, brand names, stock photo, smiling corporate people, cluttered dashboard, excessive neon, cartoon mascot, hyperrealistic face, distorted hands, garish colors, dense tiny details, watermark, red alert coloring, bee imagery (the post is about a tool named Bumblebee, but the image should not literally depict bees — visual literalism on the tool name would undercut the editorial style).

## After generation

1. Save as `hero.jpg` in this directory.
2. The frontmatter already references `/posts/trying-bumblebee/hero.jpg`.
3. Delete this `hero-prompt.md` once the image is in place, or keep it as documentation — your call.
