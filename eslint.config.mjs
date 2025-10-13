import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const WARN = 1;
const ERROR = 2;
const OFF = 0;

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        __DEV__: 'readonly',
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // TypeScript rules - relaxed
      '@typescript-eslint/no-unused-vars': [
        WARN,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': OFF, // Allow any type
      '@typescript-eslint/no-empty-function': OFF,
      '@typescript-eslint/no-empty-object-type': OFF,
      '@typescript-eslint/no-require-imports': OFF,

      // React rules - relaxed
      'react/prop-types': OFF, // Using TypeScript
      'react/react-in-jsx-scope': OFF, // Not needed with new JSX transform
      'react/jsx-uses-react': OFF,
      'react/jsx-no-bind': OFF,
      'react/jsx-props-no-spreading': OFF,

      // General code quality
      'no-console': [WARN, { allow: ['warn', 'error'] }],
      'no-empty-pattern': OFF,
      'prefer-const': WARN,
      'no-var': ERROR,
    },
  },
  {
    files: ['*.conf.js', '*.config.js', '*.setup.js', '*.config.mjs'],
    rules: {
      '@typescript-eslint/no-require-imports': OFF,
      'no-undef': OFF,
    },
  },
  {
    ignores: ['plugins/**', 'node_modules/**', 'android/**', 'ios/**', '.bundle/**'],
  }
);
