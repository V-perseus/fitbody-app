import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 5,
    borderRadius: 3,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 3,
  },
})

export default styles
