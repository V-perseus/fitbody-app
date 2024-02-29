module.exports = {
  preset: 'jest-expo',
  // preset: 'react-native',
  // preset: 'ts-jest/presets/js-with-ts',
  // preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {},
  setupFiles: ['./jestSetup.js', './node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|@sentry/react-native|@segment/analytics-react-native|@redux-offline/redux-offline|expo(nent)?|@expo(nent)?/.*|expo-av|@unimodules/.*|unimodules|expo-av|react-navigation-shared-element|rn-color-matrices|concat-color-matrices)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    // '\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/fileTransformer.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/?(*.)+(spec).[jt]s?(x)'],
  verbose: true,
  collectCoverageFrom: ['**/*.{ts,tsx,js,jsx}', '!**/node_modules/**', '!**/vendor/**'],
}
