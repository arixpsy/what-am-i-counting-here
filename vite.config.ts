import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [sveltekit(), SvelteKitPWA({
		manifest: {
			short_name: 'WAICH',
			name: 'What am I counting here',
			start_url: '/',
			scope: '/',
			display: 'standalone',
			theme_color: "#ffffff",
			background_color: "#ffffff",
			icons: [
				{
					src: '/waich-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/waich-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/waich-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any maskable',
				},
			],
		},
		// devOptions: {
		// 	enabled: true,
		// 	type: 'module',
		// 	navigateFallback: '/',
		// },
	})],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	resolve: {
		alias: {
			'@': resolve('./src'),
			'.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
		},
	},
})
