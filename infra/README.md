# Infrastructure

<p align="center">
  <img src="https://img.shields.io/badge/Terraform-Planned-844FBA?logo=terraform&logoColor=white" alt="Terraform Planned" />
  <img src="https://img.shields.io/badge/Status-Vibes%20Only-yellow" alt="Status: Vibes Only" />
</p>

---

## Current State

```
infra/
└── .gitkeep    # The loneliest file in the repo
```

This directory is a placeholder for future Infrastructure as Code. It exists as a promise to my future self that one day, cloud resources will be properly managed here.

## The Vision

When this directory grows up, it wants to be:

- **Terraform modules** for cloud infrastructure
- **State management** (probably remote, because we're not savages)
- **Environment configs** for staging/production
- **CI/CD integration** for safe `terraform apply`

## Potential Scope

| Resource | Provider | Priority |
|----------|----------|----------|
| DNS records | Cloudflare | Eventually |
| Secrets management | TBD | Someday |
| Monitoring/alerts | TBD | When things break |
| Backups | TBD | After data loss teaches a lesson |

## Why Not Now?

The website runs on Cloudflare Workers via Wrangler, which handles deployment without Terraform. Additional infrastructure will be added here as needs arise (and as motivation permits).

## Contributing

If you're reading this and thinking "I should add Terraform here," please consider:

1. Do I actually need this?
2. Is YAML the answer? (It's rarely the answer)
3. Will I maintain this?

If you answered "yes" to all three, go for it. Otherwise, the `.gitkeep` is doing its job just fine.

---

<p align="center">
  <sub>Part of the <a href="../README.md">HQ monorepo</a></sub>
</p>
