import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const principles = defineCollection({
  loader: glob({ base: './src/content/principles', pattern: '*.mdx' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    values: z.array(
      z.object({
        value: z.string(),
        aka: z.string().optional(),
        description: z.string(),
      }),
    ),
  }),
});

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      // Tags for categorization
      tags: z.array(z.string()).default([]),
      // Draft posts are hidden from production
      draft: z.boolean().default(false),
    }),
});

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '*.mdx' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

// Role schema for grouped experiences (e.g., multiple roles at one company)
const roleSchema = z.object({
  id: z.string(),
  title: z.string(),
  period: z.string(),
  technologies: z.array(z.string()).default([]),
});

// Experience collection - supports both single and grouped positions
const experience = defineCollection({
  loader: glob({
    base: './src/content/cv/experience',
    pattern: '**/*.mdx',
  }),
  schema: z
    .object({
      // Common fields
      id: z.string(),
      title: z.string(),
      company: z.string(),
      companyUrl: z.string().url().optional(),
      location: z.string(),
      period: z.string(),
      order: z.number(),

      // Type discriminator: 'single' or 'grouped'
      type: z.enum(['single', 'grouped']).default('single'),

      // Single position fields
      technologies: z.array(z.string()).default([]),

      // Grouped position fields (optional for single)
      roles: z.array(roleSchema).optional(),
    })
    .refine(
      (data) =>
        data.type !== 'grouped' || (data.roles && data.roles.length > 0),
      { message: 'Grouped positions must have at least one role defined' },
    ),
});

export const collections = { about, blog, experience, principles };
