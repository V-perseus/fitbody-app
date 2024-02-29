/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('@expo/metro-config')

const config = getDefaultConfig(__dirname)

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer')
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles']
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
})

config.resolver.assetExts = [...config.resolver.assetExts.filter((ext) => ext !== 'svg'), 'zip']
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg']

module.exports = config
// module.exports = async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = getDefaultConfig(__dirname)
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//       assetPlugins: ['expo-asset/tools/hashAssetFiles'],
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false,
//           inlineRequires: true,
//         },
//       }),
//     },
//     resolver: {
//       assetExts: [...assetExts.filter((ext) => ext !== 'svg'), 'zip'],
//       sourceExts: [...sourceExts, 'svg'],
//     },
//   }
// }
