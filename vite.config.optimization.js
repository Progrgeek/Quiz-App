import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';

/**
 * Optimized Vite Configuration for Bundle Optimization & Tree Shaking
 * Configured for maximum performance and minimal bundle size
 */
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh for development
      fastRefresh: true,
      // Optimize React in production
      jsxRuntime: 'automatic'
    }),
    
    // Bundle analyzer - generates visual bundle report
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false, // Set to true to auto-open after build
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // 'treemap', 'sunburst', 'network'
    })
  ],

  // Development server configuration
  server: {
    port: 5173,
    open: true,
    cors: true,
    // Enable HMR for better development experience
    hmr: {
      overlay: true
    }
  },

  // Build optimization configuration
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging
    sourcemap: false, // Set to true for debugging production
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.log in production
        drop_console: true,
        drop_debugger: true,
        // Remove unused code
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        // Preserve class names for debugging
        keep_classnames: false,
        keep_fnames: false
      }
    },

    // Rollup-specific optimizations
    rollupOptions: {
      // Code splitting configuration
      output: {
        // Manual chunks for optimal caching
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          
          // Exercise components (lazy loaded)
          'exercise-basic': [
            './src/components/multipleChoice',
            './src/components/singleAnswer',
            './src/components/fillInTheBlanks'
          ],
          'exercise-interactive': [
            './src/components/dragAndDrop',
            './src/components/clickToChange',
            './src/components/sequencing'
          ],
          'exercise-advanced': [
            './src/components/highlight',
            './src/components/gapFill',
            './src/components/multipleAnswers',
            './src/components/tableExercise'
          ],
          
          // Design system and utilities
          'design-system': [
            './src/design-system',
            './src/components/common'
          ],
          'utils': [
            './src/utils',
            './src/hooks',
            './src/performance'
          ],
          'i18n': [
            './src/i18n',
            './src/content'
          ]
        },
        
        // Optimize chunk names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      },
      
      // External dependencies (if using CDN)
      external: [],
      
      // Tree shaking configuration
      treeshake: {
        // Enable aggressive tree shaking
        moduleSideEffects: false,
        // Analyze property access for better tree shaking
        propertyReadSideEffects: false,
        // Remove unused imports
        unknownGlobalSideEffects: false
      }
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 500, // 500KB warning threshold
    
    // Asset handling
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg'],
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // CSS minification
    cssMinify: true,
    
    // Emit assets for better caching
    emitAssets: true
  },

  // Dependency optimization
  optimizeDeps: {
    // Include dependencies for pre-bundling
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    
    // Exclude from pre-bundling (for tree shaking)
    exclude: [
      // Large libraries that should be tree-shaken
    ],
    
    // ESBuild options for dependency optimization
    esbuildOptions: {
      target: 'es2020'
    }
  },

  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    // Remove process.env in production for smaller bundle
    'process.env': process.env.NODE_ENV === 'production' ? '{}' : 'process.env'
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@design-system': resolve(__dirname, 'src/design-system'),
      '@performance': resolve(__dirname, 'src/performance'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@content': resolve(__dirname, 'src/content')
    },
    
    // Extensions to resolve
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },

  // Environment variables
  envPrefix: 'VITE_',

  // CSS configuration
  css: {
    // CSS modules configuration
    modules: {
      localsConvention: 'camelCase'
    },
    
    // PostCSS configuration
    postcss: './postcss.config.js',
    
    // CSS preprocessing
    preprocessorOptions: {
      // Add global SCSS/LESS variables if needed
    }
  },

  // Performance optimizations
  esbuild: {
    // Target modern browsers for smaller output
    target: 'es2020',
    
    // Optimize for production
    legalComments: 'none',
    
    // JSX optimization
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  }
});

// Production-specific overrides
if (process.env.NODE_ENV === 'production') {
  // Additional production optimizations can be added here
}
