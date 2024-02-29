import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    paddingVertical: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradientBg: {
    position: 'absolute',
    height: globals.window.height / 2,
    width: globals.window.width,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: globals.window.height * 0.05,
  },
  tipNameText: {
    color: globals.styles.colors.colorBlack,
    ...globals.styles.fonts.secondary.style,
    fontSize: 20,
  },
  whiteText: {
    color: globals.styles.colors.colorWhite,
    fontSize: 30,
    textTransform: 'uppercase',
    ...globals.styles.fonts.secondary.style,
  },
  middle: {
    flex: 1,
    width: globals.window.width,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginRight: 8 },
  carouselContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseLayerImage: {
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    padding: 16,
    color: globals.styles.colors.colorLove,
    fontSize: 20,
    ...globals.styles.fonts.secondary.style,
  },
})

export default styles
