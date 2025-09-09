import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [sveltekit()],

	// Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
