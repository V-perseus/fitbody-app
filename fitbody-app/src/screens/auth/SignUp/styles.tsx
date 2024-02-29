import { StyleSheet, Platform } from 'react-native'
import globals from '../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
  },
  scrollView: {
    flex: 1,
  },
  backgroundImage: {
    width: globals.window.width,
    height: 800 * (globals.window.width / 828), // image width is 824 and height is 800
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { marginTop: 100 },
  headerButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 0,
    zIndex: 5,
  },
  view: { flex: 1, marginVertical: 32, marginHorizontal: 24 },
  signupText: { fontSize: 30, marginBottom: 21, ...globals.styles.fonts.secondary.style },
  tc: {
    fontSize: 12,
    color: globals.styles.colors.colorBlack,
    textAlign: 'center',
  },
  tcLink: {
    marginLeft: 10,
    marginRight: 10,
    fontWeight: '700',
    textDecorationColor: globals.styles.colors.colorBlack,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 30,
  },
  signIn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    backgroundColor: globals.styles.colors.colorLove,
  },
  buttonText: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.39,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
})

export default styles
