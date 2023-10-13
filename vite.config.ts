import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

//@ts-expect-error - Vite problems?
export default defineConfig({
	//@ts-expect-error - Vite problems?
	plugins: [sveltekit()],
})
