module.exports = {
  project: {
    ios: {
      sourceDir: './ios',
    },
  },
  dependencies: {
    // ...require('expo-dev-client/dependencies'),
    'react-native-notifications': {
      platforms: {
        android: null,
      },
    },

    '@segment/analytics-react-native': {
      platforms: {
        ios: null,
      },
    },
    'react-native-google-cast': {
      platforms: {
        ios: null, // this will disable autolinking for this package on iOS
      },
    },
    'react-native-flipper': {
      platforms: {
        ios: null,
      },
    },
  },
  assets: ['./assets/fonts'],
}
