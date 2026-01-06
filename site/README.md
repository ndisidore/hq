<p align="center">
  <img src="src/assets/logos/diz-rocks-light.svg" alt="diz.rocks" width="200" />
</p>

<p align="center">
  <strong>The Website</strong><br/>
  <em>A static blog and personal site, lovingly crafted with Astro</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-5-BC52EE?logo=astro&logoColor=white" alt="Astro 5" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/DaisyUI-5-1AD1A5?logo=daisyui&logoColor=white" alt="DaisyUI 5" />
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
</p>

---

## Commands

All commands run from this directory (`site/`):

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Build and preview locally via Wrangler |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run lint` | Run Biome linter |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Biome |
| `npm run cf-typegen` | Generate Cloudflare Worker types |

### Tool Versions (mise)

This project uses [mise](https://mise.jdx.dev) to manage tool versions. See [`mise.toml`](./mise.toml) for the full configuration.

```bash
# Install all required tools
mise install

# Or trust and install in one go
mise trust && mise install
```

**Managed tools:**

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | LTS | Runtime |
| markdownlint-cli | latest | Markdown linting |
| harper-cli | latest | Grammar checking |
| pandoc | latest | Document conversion (for Harper preprocessing) |

---

## Architecture

### Project Structure

```
src/
├── assets/         # Images, logos, static assets
├── components/     # Astro/UI components
├── content/        # Blog posts (Markdown/MDX)
│   └── blog/       # Blog content collection
├── layouts/        # Page layouts
├── pages/          # File-based routing
├── styles/         # Global CSS
└── utils/          # Helper functions

public/             # Static files (copied as-is)
scripts/            # Build/CI scripts
```

### Content System

Blog posts live in `src/content/blog/` as Markdown or MDX files. The content schema is defined in `src/content.config.ts` with Zod validation.

**Required frontmatter:**
```yaml
---
title: "Your Post Title"
description: "A compelling description"
pubDate: 2025-01-06
tags: ["astro", "webdev"]
---
```

**Optional fields:**
- `updatedDate` - When the post was last updated
- `heroImage` - Featured image path

### Routing

File-based routing in `src/pages/`:

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.astro` | Home page |
| `/blog` | `blog/index.astro` | Blog listing |
| `/blog/[slug]` | `blog/[...slug].astro` | Individual blog posts |
| `/tags/[tag]` | `tags/[...tag].astro` | Posts filtered by tag |
| `/rss.xml` | `rss.xml.js` | RSS feed |

All routes are statically generated via `getStaticPaths()`.

### Theming

The site supports extensive theming via [DaisyUI](https://daisyui.com/docs/themes/). Theme persistence uses localStorage with system preference fallback. The `ThemeToggle.astro` component handles switching, and an inline script in `BaseHead.astro` prevents FOUC (Flash of Unstyled Content).

### Icons

Icons use [Iconify](https://iconify.design/) via `astro-icon`. Three icon sets are installed:

| Set | Prefix | Browse | Use Case |
|-----|--------|--------|----------|
| [Tabler](https://icon-sets.iconify.design/tabler/) | `tabler:` | [Browse](https://icon-sets.iconify.design/tabler/) | UI icons |
| [Simple Icons](https://icon-sets.iconify.design/simple-icons/) | `simple-icons:` | [Browse](https://icon-sets.iconify.design/simple-icons/) | Brand icons |
| [Logos](https://icon-sets.iconify.design/logos/) | `logos:` | [Browse](https://icon-sets.iconify.design/logos/) | Tech/brand logos |

```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="tabler:calendar" class="h-4 w-4" />
<Icon name="simple-icons:github" class="w-5 h-5" />
<Icon name="logos:astro-icon" class="w-6 h-6" />
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/consts.ts` | Site metadata (title, author, social links) |
| `src/styles/app.css` | Global styles and Tailwind directives |
| `src/layouts/BlogPost.astro` | Blog post layout with TOC, metadata, navigation |
| `astro.config.mjs` | Astro configuration (site URL, integrations, Shiki) |
| `wrangler.jsonc` | Cloudflare Workers configuration |
| `biome.json` | Biome linter/formatter configuration |

---

## Code Style

[Biome](https://biomejs.dev) handles linting and formatting:

- Single quotes
- Always semicolons
- 2-space indentation
- Tailwind CSS directives enabled

Markdown files in `src/content/blog/` are additionally linted with:
- **markdownlint** - Structural consistency
- **Harper** - Grammar checking (via pandoc preprocessing)

---

## Deployment

The site deploys to Cloudflare Workers on merge to `main` (manual deploy via `npm run deploy`).

Build output goes to `./dist/` which Wrangler packages and deploys.

---

<p align="center">
  <sub>Part of the <a href="../README.md">HQ monorepo</a></sub>
</p>
