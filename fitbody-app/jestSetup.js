import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import mockNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'

// for react-native-reanimated-carousel
global.__reanimatedWorkletInit = jest.fn()
// patch an issue with jest 29 removeing setImmediate from jsdom preset
global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args))

jest.mock('react-native-device-info', () => {
  return {
    getVersion: jest.fn(),
  }
})

jest.mock('@segment/sovran-react-native')

jest.mock('@segment/analytics-react-native', () => {
  // const real = jest.requireActual('@segment/analytics-react-native')
  // return real
  return {
    setup: () => null,
    identify: () => null,
    reset: () => null,
    track: () => null,
    createClient: jest.fn(),
    useAnalytics: () => ({ track: () => null, identify: () => null }),
    AnalyticsProvider: jest.fn(),
  }
})

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  return {
    KeyboardAwareScrollView: jest.fn().mockImplementation(({ children }) => children),
  }
})

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)

jest.mock('@react-native-community/netinfo', () => mockNetInfo)

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: (props) => props.children,
}))

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist')
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
  }
})

// Solves - Invariant Violation: `new NativeEventEmitter()` requires a non-null argument.
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

// Silences a warning when running jest about `useNativeDriver`
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

// for whatever reason this would not work in __MOCKS__
jest.mock('react-native-background-downloader', () => {
  return {
    download: jest.fn(function () {
      return {
        begin: jest.fn(function () {
          return {
            progress: jest.fn(function () {
              return {
                done: jest.fn(function () {
                  return {
                    error: jest.fn(),
                  }
                }),
              }
            }),
          }
        }),
      }
    }),
  }
})

jest.mock('react-native-orientation-locker', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    lockToPortrait: jest.fn(),
    lockToLandscapeLeft: jest.fn(),
    lockToLandscapeRight: jest.fn(),
    unlockAllOrientations: jest.fn(),
  }
})

// https://github.com/callstack/react-native-testing-library/issues/329
jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent')
  return {
    default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
  }
})
