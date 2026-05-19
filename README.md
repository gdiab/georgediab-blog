# George Diab's Personal Website

Astro-powered personal site for [georgediab.com](https://www.georgediab.com). This repo is the home for my blog posts, project notes, experiments, and static site configuration.

The site is built on top of the AstroPaper theme, with custom content structure, styling, search, image handling, security headers, and Vercel deployment configuration layered on top.

## Content

Blog posts live in `src/content/blog/` and are organized by year. Most posts are Markdown files with frontmatter for title, description, publish date, tags, and optional hero images.

Post-specific images live under `public/posts/<post-slug>/` and are referenced from Markdown using root-relative paths, for example:

```md
![Alt text](/posts/example-post/image.jpg)
```

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

## Deployment

The site deploys through Vercel. Changes merged to `main` rebuild and deploy automatically.

## License

All code in this repository is available under the [MIT License](LICENSE).

## Special thanks

Special thanks to [Sat Naing](https://github.com/satnaing) for creating the excellent [AstroPaper theme](https://astro-paper.pages.dev/) that served as the foundation for this website.
