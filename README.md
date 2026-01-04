# HQ

Personal website and infrastructure monorepo.

## Structure

```text
.
├── site/       # Astro blog/personal website (Cloudflare Workers)
└── infra/      # Terraform infrastructure (placeholder)
```

## Site

The website is built with [Astro](https://astro.build) and deployed to Cloudflare Workers.

### Getting Started

```bash
cd site
npm install
npm run dev      # Start dev server at localhost:4321
```

### Commands

All commands are run from the `site/` directory:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Build and preview locally via Wrangler       |
| `npm run deploy`  | Build and deploy to Cloudflare Workers       |
| `npm run lint`    | Run Biome linter                             |

### Features

- Astro 5 with static site generation
- Tailwind CSS v4 + DaisyUI theming
- Markdown/MDX blog content
- RSS feed and sitemap
- Light/dark theme toggle

## Infrastructure

The `infra/` directory is a placeholder for future Terraform infrastructure code.

## Tool Versions

Tool versions are managed via [mise](https://mise.jdx.dev/). Run `mise install` from the `site/` directory to install Node.js and other required tools.
