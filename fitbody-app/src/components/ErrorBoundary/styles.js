import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  titleLargeText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 40,
    color: globals.styles.colors.colorWhite,
    marginTop: 16,
  },
  titleTextSmall: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    paddingVertical: 0,
    fontSize: 30,
    color: globals.styles.colors.colorWhite,
  },
  bodyTextTop: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 18,
    // color: 'white',
    color: globals.styles.colors.colorGray,
    textAlign: 'center',
    marginVertical: 27,
    width: globals.window.width * 0.85,
  },
  bodyTextBold: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  bodyText: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 18,
    // color: 'white',
    color: globals.styles.colors.colorGray,
    textAlign: 'center',
    width: globals.window.width * 0.85,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27.5,
    // marginBottom: 30,
    width: globals.window.width * 0.9,
    // marginTop: 27,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  buttonGradient: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    marginBottom: 30,
    width: globals.window.width * 0.9,
    marginTop: 27,
  },
  buttonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    color: globals.styles.colors.colorBlack,
    textAlign: 'center',
  },
})

export default styles
