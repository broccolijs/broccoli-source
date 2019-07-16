module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'mocha', 'prettier'],
    extends: ['plugin:@typescript-eslint/recommended'],
    env: {
      node: true,
    },
    rules: {
      'no-var': 'error',
      'no-console': 'off',
      'object-shorthand': 'error',
      'prettier/prettier': ['error', require('./prettier.config')],
      '@typescript-eslint/indent': ['error', 2],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
    overrides: [
      {
        files: ['test/**/*.ts'],
        plugins: ['mocha'],
        env: {
          mocha: true,
        },
        rules: {
          'mocha/no-exclusive-tests': 'error',
          'mocha/handle-done-callback': 'error',
        },
      },
    ],
  };