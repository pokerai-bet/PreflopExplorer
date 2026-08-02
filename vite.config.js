import { defineConfig } from 'vite'

export default defineConfig({
  // Keep the build deployable below any same-origin Pokerai path.
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/preflop-explorer.js',
      },
    },
  },
})
