import { configDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    ...configDefaults,
    setupFiles: ['./src/vitestSetup.ts'],
    include: ['**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
})
