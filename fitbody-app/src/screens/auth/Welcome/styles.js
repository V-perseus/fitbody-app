import { StyleSheet, StatusBar, Platform } from 'react-native'
import globals from '../../../config/globals'
import { ms } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    alignItems: 'center',
  },
  logoContainer: {
    width: '100%',
    paddingLeft: 27,
    marginTop: Platform.select({ ios: 10, android: StatusBar.currentHeight + 10 }),
  },
  logo: {
    width: 31,
    height: 44,
    marginBottom: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 120,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 26,
    paddingHorizontal: 22,
  },
  button: {
    marginLeft: 7,
    marginRight: 7,
  },
  gradientButton: {
    flex: 1,
    height: 55,
    marginHorizontal: 7,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: globals.styles.colors.colorWhite,
    backgroundColor: 'transparent',
  },
  signupButton: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  buttonLabel: {
    fontSize: ms(16),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'center',
    lineHeight: 22,
    color: globals.styles.colors.colorWhite,
  },
  signupLabel: {
    color: globals.styles.colors.colorLove,
  },
})

export default styles
