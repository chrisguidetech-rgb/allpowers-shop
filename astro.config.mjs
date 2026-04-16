import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://iallpowers.eu',
  integrations: [tailwind()],
  output: 'static',
  build: {
    format: 'directory'
  }
});
