import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: {
			$lib: '/src/lib',
			$components: '/src/components',
			$stores: '/src/stores',
			$utils: '/src/utils',
			$styles: '/src/styles',
			$types: '/src/types'
		}
	}
});
