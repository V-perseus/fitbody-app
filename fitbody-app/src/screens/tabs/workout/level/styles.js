import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    paddingTop: 5,
  },
  button: { marginTop: 10, marginBottom: 10 },
  titleOption: {
    marginBottom: 0,
  },
  subtitleText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#fff',
    width: globals.window.width * 0.8,
    marginBottom: 24,
  },
})

export default styles
