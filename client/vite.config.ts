// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ['@urql/svelte'],
  },
  ssr: {
    noExternal: ['dayjs'],
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      types: path.resolve(__dirname, '../@types'),
    },
  },
};

export default config;
