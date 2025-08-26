import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
    exclude: ['node_modules', 'dist', '.storybook']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
