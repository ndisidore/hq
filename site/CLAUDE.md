# Site

Static blog/personal website built with Astro 5, deployed to Cloudflare Workers. Uses Tailwind CSS v4 with DaisyUI for styling and supports Markdown/MDX content.

## Development Commands

```bash
npm run dev          # Start dev server at http://localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Build and preview via Wrangler locally
npm run deploy       # Build and deploy to Cloudflare Workers

npm run lint         # Run Biome linter
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format code with Biome
npm run cf-typegen   # Generate Cloudflare Worker types
```

Tool versions are managed via mise (see `mise.toml`). Run `mise install` to set up Node LTS, markdownlint-cli, harper-cli, and pandoc.

## Architecture

### Content System

Blog posts live in `src/content/blog/` as Markdown or MDX files. The content schema is defined in `src/content.config.ts` with Zod validation:

- Required frontmatter: `title`, `description`, `pubDate`, `tags` (array)
- Optional: `updatedDate`, `heroImage`

Tags have dedicated filter pages at `/tags/[tag]`. Tag utilities are in `src/utils/tags.ts`.

### Routing

- File-based routing in `src/pages/`
- Dynamic blog routes: `src/pages/blog/[...slug].astro`
- Dynamic tag routes: `src/pages/tags/[...tag].astro`
- All routes are statically generated via `getStaticPaths()`

### Theming

Two DaisyUI themes: "light" (default) and "dracula" (dark). Theme persistence uses localStorage with system preference fallback. The `ThemeToggle.astro` component handles switching. FOUC is prevented by an inline script in `BaseHead.astro` that sets the theme before render.

### Icons

Icons use [Iconify](https://iconify.design/) via `astro-icon` with the Tabler icon set:

```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="tabler:calendar" class="h-4 w-4" />
<Icon name="tabler:brand-github" class="w-5 h-5" />
```

Browse icons at https://icon-sets.iconify.design/tabler/. To add other icon sets, install `@iconify-json/<set-name>`.

### Key Files

- `src/consts.ts` - Site metadata (title, author, social links)
- `src/styles/app.css` - Global styles and Tailwind directives
- `src/layouts/BlogPost.astro` - Blog post layout with TOC, metadata, navigation
- `astro.config.mjs` - Astro config (site URL, integrations, Shiki themes)
- `wrangler.jsonc` - Cloudflare Workers configuration

## Code Style

Biome handles linting and formatting:
- Single quotes, always semicolons
- 2-space indentation
- Tailwind CSS directives enabled

Markdown files in `src/content/blog/` are linted with markdownlint and grammar-checked with Harper (via pandoc preprocessing).
