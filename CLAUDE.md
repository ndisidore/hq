# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HQ is a monorepo containing:
- **site/** - Static blog/personal website built with Astro 5, deployed to Cloudflare Workers
- **infra/** - Infrastructure as Code (Terraform) for cloud resources (placeholder)

## Repository Structure

```
.
├── site/       # Astro website (see site/CLAUDE.md for details)
├── infra/      # Terraform infrastructure
└── .github/    # CI workflows
```

## Git Hooks

Pre-commit hooks (via hk) run Biome and markdownlint on staged files. Install with `mise x -- hk install --mise`.

## CI Pipeline

GitHub Actions runs on push/PR to main (site/ only):
1. `mise run lint` (Biome)
2. `mise run lint:md` on blog content
3. Grammar check via Harper

Note: `infra/` has no CI validation yet (placeholder for future Terraform).
