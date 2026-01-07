# Experience Content Collection

MDX files for CV work experience. Each file represents a position or grouped set of roles at a company.

## Adding a New Position

1. Create a new file with the next numeric prefix (e.g., `06-new-company.mdx`)
2. Set `order` to the next highest number (higher = more recent, displayed first)
3. Use the appropriate template below

## File Structure

```
experience/
├── 01-targeted-victory.mdx    # Oldest position
├── 02-knocki.mdx
├── 03-pason-power.mdx
├── 04-cloudflare.mdx          # Grouped (multiple roles)
├── 05-terminal-industries.mdx # Most recent
└── README.md
```

## Single Position Template

```mdx
---
id: company-name
title: Job Title
company: Company Name
companyUrl: https://company.com
location: City, ST
period: Month YYYY - Present
order: 6
type: single
technologies:
  - Tech1
  - Tech2
---

## Summary

Brief description of the role and company.

## Details

- Accomplishment or responsibility one
- Accomplishment or responsibility two
- Accomplishment or responsibility three
```

## Grouped Position Template (Multiple Roles at One Company)

```mdx
---
id: company-name
title: Overall Title
company: Company Name
companyUrl: https://company.com
location: City, ST
period: Start Date - End Date
order: 6
type: grouped
roles:
  - id: company-role-one
    title: First Role Title
    period: Month YYYY - Month YYYY
    technologies:
      - Tech1
      - Tech2
  - id: company-role-two
    title: Second Role Title
    period: Month YYYY - Month YYYY
    technologies:
      - Tech3
      - Tech4
---

## company-role-one

### Summary

Description of this role.

### Details

- Accomplishment one
- Accomplishment two

## company-role-two

### Summary

Description of this role.

### Details

- Accomplishment one
- Accomplishment two
```

## Schema Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | URL-friendly identifier (used for hash links) |
| `title` | string | Yes | Job title |
| `company` | string | Yes | Company name |
| `companyUrl` | string | No | Company website URL |
| `location` | string | Yes | City, State |
| `period` | string | Yes | Employment period |
| `order` | number | Yes | Sort order (higher = more recent) |
| `type` | `single` \| `grouped` | No | Defaults to `single` |
| `technologies` | string[] | No | Tech stack (for single positions) |
| `roles` | Role[] | No | Array of roles (for grouped positions) |

### Role Schema (for grouped positions)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Must match the `## id` header in MDX body |
| `title` | string | Yes | Role title |
| `period` | string | Yes | Role period |
| `technologies` | string[] | No | Tech stack for this role |

## Content Parsing

The MDX body is parsed to extract:

- **Single positions**: `## Summary` and `## Details` sections
- **Grouped positions**: `## {role-id}` sections, each with `### Summary` and `### Details`

The `## Details` section should contain a markdown list (`- item`). These become the expandable bullet points on the CV page.
