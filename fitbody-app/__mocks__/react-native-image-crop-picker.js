jest.mock('react-native-image-crop-picker', () => {
  return {
    openPicker: jest.fn(),
  }
})
