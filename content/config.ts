import { z, defineCollection } from 'astro:content';

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    image: z.string(),
    affiliateUrl: z.string().url(),
    couponCode: z.string().optional(),
    shortDescription: z.string(),
    batteryCapacity: z.string().optional(),
    outputWatts: z.string().optional(),
    weight: z.string().optional(),
    rechargeMethods: z.string().optional(),
    price: z.string().optional(),
    featured: z.boolean().default(false),
    category: z.string().optional(),
    useCase: z.array(z.string()).optional(),
    order: z.number().default(99),
  }),
});

export const collections = {
  'products': productsCollection,
};
