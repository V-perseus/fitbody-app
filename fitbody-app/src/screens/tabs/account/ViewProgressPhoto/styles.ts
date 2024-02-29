import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  icons: {
    ...globals.header.icons,
  },
  navLabel: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.extraBoldStyle.fontFamily,
  },
  image: {
    height: 420,
    width: 280,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 20,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  heading: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorLove,
    fontSize: 24,
    marginTop: 10,
  },
  shareButtonLabel: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    fontSize: 18,
  },
  shareButton: {
    height: 55,
    width: globals.window.width * 0.8,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: globals.styles.colors.colorPink,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: globals.styles.colors.colorPink,
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  deletePopUp: {
    marginTop: 10,
    width: '100%',
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 10,
    marginBottom: 20,
  },
  close: {
    margin: 12,
    alignItems: 'flex-end',
  },
  popUpTitle: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 24,
    marginBottom: 20,
  },
  popUpContent: {
    fontSize: 16,
  },
  popUpBody: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonLabel: {
    color: globals.styles.colors.colorWhite,
    fontSize: 18,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    borderRadius: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    width: globals.window.width * 0.8,
  },
  slider: {
    marginTop: 15,
  },
})

export default styles
