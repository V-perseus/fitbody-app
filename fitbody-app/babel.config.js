module.exports = {
  presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  // reanimated needs to be listed last
  plugins: ['react-native-reanimated/plugin'],
}
