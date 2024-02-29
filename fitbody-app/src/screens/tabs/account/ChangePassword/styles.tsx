import { StyleSheet, Platform } from 'react-native'
import globals from '../../../../config/globals'

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
  label: {
    marginTop: 40,
    color: globals.styles.colors.colorGrayDark,
    fontSize: 12,
  },
  textFields: {
    color: globals.styles.colors.colorBlackDark,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    fontSize: 16,
    paddingLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  checkMark: {
    position: 'absolute',
    right: 10,
    marginTop: Platform.OS === 'ios' ? 63 : 70,
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
  relative: {
    position: 'relative',
  },
})

export default styles
