import { z, defineCollection } from 'astro:content';

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string().optional(),
    image: z.string().optional(),
    affiliateUrl: z.any().optional(),
    couponCode: z.any().optional(),
    shortDescription: z.any().optional(),
    batteryCapacity: z.any().optional(),
    outputWatts: z.any().optional(),
    weight: z.any().optional(),
    rechargeMethods: z.any().optional(),
    price: z.any().optional(),
    featured: z.any().optional(),
    category: z.any().optional(),
    useCase: z.any().optional(),
    order: z.any().optional(),
  }).passthrough(),
});

export const collections = {
  'products': productsCollection,
};
