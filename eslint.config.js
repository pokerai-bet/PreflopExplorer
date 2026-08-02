import js from '@eslint/js'

export default [
  { ignores: ['dist', 'coverage'] },
  {
    files: ['src/**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        AbortController: 'readonly', console: 'readonly', document: 'readonly', fetch: 'readonly',
        localStorage: 'readonly', navigator: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
        URL: 'readonly', window: 'readonly',
      },
    },
  },
]
