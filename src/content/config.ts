import { defineCollection, z } from 'astro:content';

const projets = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    secteur: z.string(),
    type: z.enum(['vitrine', 'e-commerce', 'wordpress', 'astro', 'headless']),
    stack: z.array(z.string()),
    url: z.string().url().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    date: z.string(),
  }),
});

export const collections = { projets };
