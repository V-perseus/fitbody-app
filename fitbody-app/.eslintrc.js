module.exports = {
  plugins: ['react-perf'],
  env: {
    browser: true,
    jest: true,
  },
  root: true,
  extends: ['@react-native-community', 'plugin:react-perf/recommended'],
  rules: {
    semi: [2, 'never'],
    'react-native/no-inline-styles': 1,
    'react-perf/jsx-no-new-array-as-prop': [1, { nativeAllowList: 'all' }],
    'react-perf/jsx-no-new-function-as-prop': [1, { nativeAllowList: 'all' }],
    'react-perf/jsx-no-new-object-as-prop': [1, { nativeAllowList: 'all' }],
    'no-shadow': 'off', // no-shadow eslint conflicts with no-shadow from tslint
    '@typescript-eslint/no-shadow': ['error'],
  },
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
}
