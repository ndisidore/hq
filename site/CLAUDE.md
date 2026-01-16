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

Extensive theming support via DaisyUI. Theme persistence uses localStorage with system preference fallback. The `ThemeToggle.astro` component handles switching. FOUC is prevented by an inline script in `BaseHead.astro` that sets the theme before render.

### Neobrutalism Design

The site uses a neobrutalism aesthetic applied globally via `src/styles/app.css`. Key characteristics: bold 2px borders, offset box shadows (4px), and hover states that shift elements. Design tokens in `@theme` include `--neo-shadow`, `--neo-shadow-hover`, and `--neo-border` for consistency across components (buttons, cards, inputs, dropdowns, navbar).

### Icons

Icons use [Iconify](https://iconify.design/) via `astro-icon`. Three icon sets are installed:

- `tabler:` - UI icons ([browse](https://icon-sets.iconify.design/tabler/))
- `simple-icons:` - Brand icons ([browse](https://icon-sets.iconify.design/simple-icons/))
- `logos:` - Tech/brand logos ([browse](https://icon-sets.iconify.design/logos/))

```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="tabler:calendar" class="h-4 w-4" />
<Icon name="simple-icons:github" class="w-5 h-5" />
<Icon name="logos:astro-icon" class="w-6 h-6" />
```

To add other icon sets, install `@iconify-json/<set-name>`.

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

## Verifying Changes

If the Playwright MCP server is available, use it to verify UI changes:

1. Start the dev server with `npm run dev` (runs on <http://localhost:4321>)
2. Use `browser_navigate` to load pages
3. Use `browser_snapshot` to inspect the accessibility tree and verify elements
4. Use `browser_take_screenshot` to capture visual state
5. Use `browser_click`, `browser_hover`, etc. to test interactions

This is especially useful for:

- Verifying responsive layouts (use `browser_resize` for different viewport sizes)
- Testing hover states and dropdowns
- Checking theme switching behavior
- Debugging CSS issues by inspecting computed styles with `browser_evaluate`
