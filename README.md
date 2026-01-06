<p align="center">
  <img src="site/src/assets/logos/diz-rocks-avatar.svg" alt="diz.rocks logo" width="120" height="120" />
</p>

<h1 align="center">HQ</h1>

<p align="center">
  <em>Command center for all things diz.rocks</em>
</p>

<p align="center">
  <a href="https://github.com/ndisidore/hq/actions/workflows/ci.yml">
    <img src="https://github.com/ndisidore/hq/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <img src="https://img.shields.io/badge/Astro-5-BC52EE?logo=astro&logoColor=white" alt="Astro 5" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/Terraform-soon%E2%84%A2-844FBA?logo=terraform&logoColor=white" alt="Terraform" />
</p>

---

## What is this?

This is my personal monorepo—the nerve center where my website lives and my infrastructure (eventually) gets wrangled. Think of it as a digital treehouse, but with more YAML and fewer splinters.

## The Map

```
.
├── site/    # The website. Where words become HTML and dreams become CSS.
├── infra/   # Infrastructure as Code. Currently just vibes and a .gitkeep.
└── .github/ # CI workflows that yell at me when I mess up.
```

| Directory | What's Inside | Status |
|-----------|---------------|--------|
| [`site/`](./site/) | Astro-powered blog & personal site | Live & kicking |
| [`infra/`](./infra/) | Terraform infrastructure | Placeholder (but make it professional) |

## Quick Start

```bash
# Clone the HQ
git clone https://github.com/ndisidore/hq.git
cd hq

# Enter the site dimension
cd site
npm install
npm run dev

# Marvel at http://localhost:4321
```

## Tech Stack

| Layer | Tools |
|-------|-------|
| **Frontend** | [Astro 5](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), [DaisyUI](https://daisyui.com) |
| **Content** | Markdown/MDX with Zod-validated frontmatter |
| **Hosting** | [Cloudflare Workers](https://workers.cloudflare.com) |
| **Linting** | [Biome](https://biomejs.dev), markdownlint, [Harper](https://github.com/Automattic/harper) |
| **Tooling** | [mise](https://mise.jdx.dev) for version management |
| **Infra** | Terraform (coming to a `terraform apply` near you) |

## CI Pipeline

Every push and PR triggers the gauntlet:

1. **Biome** - Checks code style (it has opinions, and they're usually right)
2. **markdownlint** - Ensures blog posts aren't chaos
3. **Harper** - Grammar cop for your prose

## Deep Dives

- **[`site/README.md`](./site/README.md)** - Everything about the website: architecture, theming, content system, and more
- **[`infra/README.md`](./infra/README.md)** - The infrastructure roadmap (spoiler: it's mostly dreams right now)

## License

Do whatever you want with the code. The content (blog posts, etc.) is mine though—please don't pretend you wrote my ramblings.

---

<p align="center">
  <sub>Built with caffeine, mass amounts of Chipotle, and mass amounts of mass amounts.</sub>
</p>
