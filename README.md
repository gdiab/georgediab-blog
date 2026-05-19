# George Diab's Personal Website

Astro-powered personal site for [georgediab.com](https://www.georgediab.com). This repo is the home for my blog posts, project notes, experiments, and static site configuration.

The site is built on top of the AstroPaper theme, with custom content structure, styling, search, image handling, security headers, and Vercel deployment configuration layered on top.

## Content

Blog posts live in `src/content/blog/` and are organized by year. Most posts are Markdown files with frontmatter for title, description, publish date, tags, and optional hero images.

Use `https://www.georgediab.com` for public links. Prefer durable date wording in posts when possible, for example "in early April" instead of "a few weeks ago."

### Post frontmatter

Common fields:

```yaml
title: "Post title"
description: "Short social/search description."
pubDatetime: 2026-05-19T07:00:00-07:00
tags: ["ai", "tools", "software-engineering"]
heroImage: "/posts/post-slug/hero.jpg"
draft: false
```

Use `unlisted: true` only when a post should be available by direct URL but hidden from the posts list/feed. Remove it before publishing normally.

### Images

Post-specific images live under `public/posts/<post-slug>/` and are referenced from Markdown using root-relative paths, for example:

```md
![Alt text](/posts/example-post/image.jpg)
```

For generated hero or inline illustrations, start with `docs/hero-image-style.md` so new images match the site's visual system.

## Project structure

```text
├── docs/                # Project notes and reusable prompts
├── public/              # Static assets served directly
│   ├── fonts/           # Web fonts
│   └── posts/           # Post-specific images and assets
├── src/
│   ├── assets/          # Icons and images used by components
│   ├── components/      # Astro and React UI components
│   │   └── ui/          # React components
│   ├── content/         # Astro content collections
│   │   └── blog/        # Blog posts in Markdown
│   ├── layouts/         # Page layouts and templates
│   ├── pages/           # Routes and generated pages
│   ├── styles/          # Global styles and typography
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── biome.json           # Lint and formatting configuration
├── vercel.json          # Vercel deployment and security headers
├── package.json         # Dependencies and scripts
└── LICENSE              # MIT license
```

## Common commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production site and Pagefind search index |
| `npm run build:check` | Run Astro checks, build, and Pagefind indexing |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Biome linting |
| `npm run check` | Run Biome checks |

## Publishing workflow

`main` is protected, so changes should go through a pull request. Before merging content or site changes, run:

```sh
npm run build:check
```

After merge, Vercel rebuilds and deploys automatically. If a post is not appearing on the site, check `draft`, `unlisted`, publish date, and the Vercel deployment first.

## License

All code in this repository is available under the [MIT License](LICENSE).

## Special thanks

Special thanks to [Sat Naing](https://github.com/satnaing) for creating the excellent [AstroPaper theme](https://astro-paper.pages.dev/) that served as the foundation for this website.
