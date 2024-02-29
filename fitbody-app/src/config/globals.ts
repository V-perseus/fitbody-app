import { Dimensions, TextProps } from 'react-native'
import styles from './styles'
import string from './strings'
import { FB_CURRENT_ENV, FB_ENVIRONMENTS } from '../../env'

export const globals = {
  // Styles & Colors
  styles: {
    ...styles,
  },
  // Fonts
  fonts: {
    ...styles.fonts,
  },
  // Header Styles
  header: {
    icons: {
      marginRight: 15,
      marginLeft: 15,
    },
    headerTitleStyle: <TextProps>{
      fontSize: 16,
      fontFamily: styles.fonts.primary.semiboldStyle.fontFamily,
      textAlign: 'center',
    },
    headerTruncatedBackTitle: true,
  },
  // Standard String
  strings: {
    ...string,
  },
  // Background Images
  bgImage: {
    imageStyle: { resizeMode: 'cover' },
    style: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  },
  // Window dimensions
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  // Button click targeting
  touchableOpacity: {
    activeOpacity: 0.8,
    hitSlop: { top: 5, right: 5, left: 5, bottom: 5 },
  },
  fbEnvironments: {
    ...FB_ENVIRONMENTS,
  },
  currentEnv: FB_CURRENT_ENV,
  get apiBase(): string {
    return this.fbEnvironments[this.currentEnv]
  },
}

export default globals
