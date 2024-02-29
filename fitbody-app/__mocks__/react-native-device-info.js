jest.mock('react-native-device-info', () => {})
export default {
  getVersion: jest.fn(() => '1.0.0'),
  getModel: jest.fn(() => 'iPhone XR'),
}
