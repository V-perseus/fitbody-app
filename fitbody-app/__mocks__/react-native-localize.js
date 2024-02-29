jest.mock('react-native-localize', () => {
  return {
    RNLocalize: {
      findBestAvailableLanguage: jest.fn(),
    },
  }
})
