import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// A focused config for the test runner. The application's Vite config carries the
// Tailwind and MDX plugins the tests do not need; keeping them out makes the
// suite fast and independent of the site's build toolchain.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
  },
})
