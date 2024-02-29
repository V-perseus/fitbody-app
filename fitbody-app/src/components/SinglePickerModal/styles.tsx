import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

export default StyleSheet.create({
  date: {
    textAlign: 'center',
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: 'black',
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    flexShrink: 1,
    paddingTop: 20,
    paddingBottom: 0,
    width: globals.window.width * 0.9,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 10,
  },
  titleContainer: { height: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  titleStyle: { fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 30, color: globals.styles.colors.colorBlack },
  bodyContainer: { alignItems: 'center', paddingHorizontal: 20, justifyContent: 'center' },
  bodyText: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 14,
    color: globals.styles.colors.colorBlack,
    textAlign: 'center',
  },
  pickerContainer: {
    height: 231.4,
  },
  pickerContainerInner: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  gradientTop: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 10,
    top: 0,
    width: globals.window.width * 0.9,
    height: 115.7,
  },
  gradientBottom: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 10,
    bottom: 0,
    width: globals.window.width * 0.9,
    height: 115.7,
  },
  selectedWindow: {
    position: 'absolute',
    top: 115.7 - 25,
    borderColor: globals.styles.colors.colorGray,
    width: globals.window.width * 0.9,
    height: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  closeButton: { padding: 15, position: 'absolute', top: 0, right: 0 },
  selectButton: { marginTop: 20, borderRadius: 8, height: 48, width: globals.window.width * 0.7 },
})
