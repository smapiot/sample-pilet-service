import noNull from 'eslint-plugin-no-null';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['src/**/*.test.ts'], files: ['src/**/*.ts'] },
  {
    plugins: { 'no-null': noNull, react, '@typescript-eslint': typescriptEslint },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: { project: 'tsconfig.json' },
    },

    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],

      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/indent': 'off',

      '@typescript-eslint/member-delimiter-style': [
        'off',
        {
          multiline: { delimiter: 'none', requireLast: true },

          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
      ],

      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/quotes': 'off',
      '@typescript-eslint/semi': ['off', null],
      '@typescript-eslint/type-annotation-spacing': 'off',
      'arrow-body-style': 'error',
      'arrow-parens': ['off', 'always'],
      'brace-style': ['off', 'off'],
      'comma-dangle': 'off',
      curly: ['error', 'multi-line'],
      'dot-notation': 'off',
      'eol-last': 'off',
      eqeqeq: ['error', 'smart'],

      'id-denylist': [
        'error',
        'any',
        'Number',
        'number',
        'String',
        'string',
        'Boolean',
        'boolean',
        'Undefined',
        'undefined',
      ],

      'id-match': 'error',
      indent: 'off',
      'linebreak-style': 'off',
      'max-len': 'off',
      'new-parens': 'off',
      'newline-per-chained-call': 'off',
      'no-eval': 'error',
      'no-extra-semi': 'off',
      'no-irregular-whitespace': 'off',
      'no-multiple-empty-lines': 'error',
      'no-null/no-null': 'error',
      'no-redeclare': 'error',
      'no-trailing-spaces': 'off',
      'no-underscore-dangle': 'off',
      'no-var': 'error',
      'one-var': ['error', 'never'],

      'padded-blocks': ['off', { blocks: 'never' }, { allowSingleLineBlocks: true }],

      'prefer-const': 'error',
      'quote-props': 'off',
      quotes: 'off',
      radix: 'error',
      'react/jsx-curly-spacing': 'off',
      'react/jsx-equals-spacing': 'off',

      'react/jsx-tag-spacing': ['off', { afterOpening: 'allow', closingSlash: 'allow' }],

      'react/jsx-wrap-multilines': 'off',
      semi: 'off',
      'space-before-function-paren': 'off',
      'space-in-parens': ['off', 'never'],
    },
  },
];
