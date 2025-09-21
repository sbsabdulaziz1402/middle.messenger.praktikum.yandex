import tseslint from 'typescript-eslint';
import globals from 'globals';
import path from 'path';
export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.ts', 'vite.config.ts', 'jest.config.ts', 'stylelint.config.ts'],
  },

  // TypeScript configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // so ESLint knows your TS config
        tsconfigRootDir: path.resolve(__dirname),
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
