import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

export default StyleSheet.create({
  date: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: 'black',
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    padding: 50,
    paddingTop: 20,
    paddingBottom: 0,
    width: globals.window.width * 0.9,
    height: 435.1,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 10,
  },
  pickerContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  hoursPickerContainer: { width: 60 },
  minutesPickerContainer: { width: 60 },
  ampmPickerContainer: { width: 50 },
  gradientTop: { position: 'absolute', borderWidth: 0, borderRadius: 10, top: 20, width: globals.window.width * 0.9, height: 230 },
  gradientBottom: { position: 'absolute', borderWidth: 0, borderRadius: 10, bottom: 74, width: globals.window.width * 0.9, height: 230 },
  selectorWindow: {
    position: 'absolute',
    top: 165.5,
    borderColor: globals.styles.colors.colorGray,
    width: globals.window.width * 0.9,
    height: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  selectButton: { width: globals.window.width * 0.8 },
})
