import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  containerView: {
    display: 'flex',
    width: globals.window.width * 0.9,
    paddingTop: 0,
    backgroundColor: globals.styles.colors.colorWhite,
    alignItems: 'center',
    borderRadius: 8,
  },
  title: {
    marginTop: 35,
    fontSize: 23,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    letterSpacing: -0.43,
    textAlign: 'center',
  },
  subtitle: { textAlign: 'center', fontSize: 14, color: globals.styles.colors.colorBlack, marginTop: 11 },
  popupContainer: { height: 55, flexDirection: 'row', marginTop: 32, paddingHorizontal: 18.25, width: '100%' },
  buttonPositive: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6.25,
    flexGrow: 1,
    flexBasis: 0,
    borderWidth: 0,
    backgroundColor: globals.styles.colors.colorPink,
    borderRadius: 8,
  },
  textPositive: { fontSize: 16, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, color: globals.styles.colors.colorWhite },
  buttonNegative: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6.25,
    flexGrow: 1,
    flexBasis: 0,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorBlack,
    borderRadius: 8,
  },
  textNegative: { fontSize: 16, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, color: globals.styles.colors.colorBlackDark },
  remindText: {
    marginTop: 23,
    marginBottom: 20,
    fontSize: 12,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    letterSpacing: 0.44,
    color: globals.styles.colors.colorPink,
  },
})

export default styles
