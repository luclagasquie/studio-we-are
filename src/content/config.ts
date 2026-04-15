import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projets' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    secteur: z.string(),
    lieu: z.string(),
    venteEnLigne: z.boolean().default(false),
    design: z.boolean().default(false),
    developpement: z.boolean().default(false),
    collaborateur: z.string().optional(),
    order: z.number().default(100),
    image: image().optional(),

  }),
});

export const collections = { projets };
