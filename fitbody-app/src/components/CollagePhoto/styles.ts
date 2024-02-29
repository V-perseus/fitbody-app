import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  collageFrame: {
    height: globals.window.width - 48,
  },
  collageFooter: {
    height: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collageImages: {
    // flex: 1,
    height: globals.window.width - 48 - 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  collageImage: {
    borderWidth: 0.2,
    width: '50%',
  },
  collageFooterItem: {
    width: '50%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collageFooterText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorWhite,
    lineHeight: 19.5,
    fontSize: 15,
  },
  footerIcon: {
    color: globals.styles.colors.colorWhite,
    fontSize: 30,
    textAlign: 'center',
  },
  beforeImage: {
    height: '100%',
    width: '100%',
  },
})

export default styles
