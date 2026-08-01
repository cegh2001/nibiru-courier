import { defineConfig } from 'vitest/config';
import { transformWithEsbuild } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.match(/src[\\/].*\.js$/)) return null;
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react({
      include: /.*\.(js|jsx)$/,
    }),
  ],
  test: {
    environment: 'jsdom',
    include: ['**/__tests__/**/*.{test,spec}.{js,jsx}', '**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'dist', '.next', 'coverage'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '.next/', '**/*.config.js', '**/node_modules/**'],
    },
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
  resolve: {
    alias: [
      { find: '@/shared', replacement: path.resolve(__dirname, './src/shared') },
      { find: '@/components', replacement: path.resolve(__dirname, './src/shared/components') },
      { find: '@/core', replacement: path.resolve(__dirname, './src/shared/core') },
      { find: '@/hooks', replacement: path.resolve(__dirname, './src/shared/hooks') },
      { find: '@/layouts', replacement: path.resolve(__dirname, './src/shared/layouts') },
      { find: '@/lib', replacement: path.resolve(__dirname, './src/shared/lib') },
      { find: '@/services', replacement: path.resolve(__dirname, './src/shared/services') },
      { find: '@/modules', replacement: path.resolve(__dirname, './src/modules') },
      { find: '@', replacement: path.resolve(__dirname, '.') },
    ],
  },
});
