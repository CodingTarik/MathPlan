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
    'plugin:security/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['react', 'jest', 'etc'],
  rules: {
    'no-func-assign': 'off',
    'etc/no-commented-out-code': 'warn',
    semi: ['error', 'always'],
    'space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' }
    ]
  },
  ignorePatterns: ['node_modules/', 'build/', 'docs/', '/public'],
  settings: {
    react: {
      version: 'detect' // or specify the React version you are using, e.g., "16.8"
    }
  }
};
