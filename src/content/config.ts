import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projets' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    secteur: z.string(),
    type: z.enum(['vitrine', 'e-commerce', 'wordpress', 'astro', 'headless']),
    stack: z.array(z.string()),
    url: z.string().url().optional(),
    image: image().optional(),
    logo: image().optional(),
    draft: z.boolean().default(false),
    date: z.string(),
  }),
});

export const collections = { projets };
