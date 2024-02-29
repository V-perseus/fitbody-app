import { StyleSheet } from 'react-native'
import { scale } from 'react-native-size-matters/extend'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 0,
  },
  titleOption: {
    paddingTop: 48,
  },
  subtitleText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#fff',
    width: globals.window.width * 0.8,
  },
  save: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    color: '#fa8dd5',
  },
  macroText: {
    marginTop: 16,
    marginBottom: 24,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    textAlign: 'center',
    color: 'white',
    fontSize: scale(14),
  },
  buttonBg: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 19,
    height: 56,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonCheckbox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dedede',
  },
  buttonTextContainer: { flex: 1, marginLeft: 12 },
  buttonText: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 16, color: '#bbb' },
})

export default styles
