import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    paths: {
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
    }
  }
};

if (process.argv.includes('dev')) {
  config = { ...config, preprocess: vitePreprocess() }
}

export default config;
