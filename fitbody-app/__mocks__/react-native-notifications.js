jest.mock('react-native-notifications', () => {
  return {
    Notifications: {
      ios: {
        setBadgeCount: jest.fn(),
      },
    },
  }
})
