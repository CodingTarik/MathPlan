module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'standard',
    'plugin:react/recommended',
    "plugin:security/recommended"
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: [
    'react',
    'jest'
  ],
  rules: {
    'no-func-assign': 'off'
  },
  ignorePatterns: [
    'node_modules/',
    'build/'
  ]
}
