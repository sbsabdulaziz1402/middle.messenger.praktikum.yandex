/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  ignores: ['dist/**', 'node_modules/**', 'eslint.config.ts', 'vite.config.ts', 'jest.config.ts', 'stylelint.config.ts'],
};
