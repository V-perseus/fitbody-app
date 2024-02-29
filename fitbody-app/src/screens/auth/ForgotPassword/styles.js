import { StyleSheet } from 'react-native'
import globals from '../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  view: {
    ...globals.styles.view,
  },
  h1: {
    marginTop: 15,
    fontSize: 28,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  p: {
    fontSize: 14,
    color: globals.styles.colors.colorGrayDark,
    marginTop: 10,
  },
  textFields: {
    marginTop: 40,
  },
  buttonText: {
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
  },
  submitContainer: {
    marginTop: 45,
  },
  submit: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 8,
  },
})

export default styles
