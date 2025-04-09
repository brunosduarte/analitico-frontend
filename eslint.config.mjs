import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    '@rocketseat/eslint-config/next',
  ),
  {
    rules: {
      // Disable the no-explicit-any rule to allow 'any' types where needed
      '@typescript-eslint/no-explicit-any': 'off',

      // Configure unused vars to be warnings and ignore vars with underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      // Relax the exhaustive-deps rule to be a warning instead of error
      'react-hooks/exhaustive-deps': 'warn',

      // Disable the no-explicit-any rule specifically for chart components
      '@typescript-eslint/ban-types': [
        'error',
        {
          types: {
            '{}': false,
          },
          extendDefaults: true,
        },
      ],
    },

    // Apply these rules to specific files/patterns if needed
    files: ['**/*.{ts,tsx}'],
  },
]

export default eslintConfig
