jest.mock('react-native-share', () => {
  return {
    Share: {
      open: jest.fn(),
    },
  }
})
