import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    flexDirection: 'row',
    height: 200,
  },
  navLabel: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
  },
  title: {
    fontSize: 21,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.extraBoldStyle.fontFamily,
  },
  description: {
    width: globals.window.width * 0.9,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    fontSize: 14,
    letterSpacing: -0.3,
    marginTop: 10,
    marginBottom: 20,
  },
  datePickerButtonView: {
    marginBottom: globals.window.width * 0.05,
    width: globals.window.width,
    paddingRight: globals.window.width * 0.05,
    paddingLeft: globals.window.width * 0.05,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: globals.styles.colors.colorWhite,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  date: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 19,
    color: globals.styles.colors.colorWhite,
    marginBottom: 15,
    marginTop: 15,
  },
  button: {
    height: 42,
    width: 90,
    borderColor: globals.styles.colors.colorWhite,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    letterSpacing: -0.3,
    color: globals.styles.colors.colorWhite,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20,
  },
})

export default styles
