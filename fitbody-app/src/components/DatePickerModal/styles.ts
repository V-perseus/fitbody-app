import { ViewStyle } from 'react-native'
import globals from '../../config/globals'

// @DEV stylesheet does not support function types so we export plain object typed as ViewStyle. Would like to find a better way to do this.
export default {
  modalContent: (shift: number): ViewStyle => ({
    padding: 32,
    paddingTop: 32,
    paddingBottom: 0,
    width: globals.window.width * 0.9,
    height: 435.1 + shift - 98.6,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 10,
  }),
  modalContentColumn: { flex: 1, flexDirection: 'column', justifyContent: 'center' } as ViewStyle,
  titleContainer: { height: 70, alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  titleText: {
    textAlign: 'center',
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
    color: globals.styles.colors.colorBlackDark,
  } as ViewStyle,
  todayLinkContainer: { height: 40, alignItems: 'center', justifyContent: 'center' } as ViewStyle,
  todayLinkText: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
    color: globals.styles.colors.colorPink,
  } as ViewStyle,
  pickerContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center' } as ViewStyle,
  pickerContainerMonth: { width: 120 } as ViewStyle,
  pickerContainerMonthItem: { width: 110, textAlign: 'left' } as ViewStyle,
  pickerContainerDay: { width: 60 } as ViewStyle,
  pickerContainerYear: { width: 80 } as ViewStyle,
  date: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
    color: globals.styles.colors.colorWhite,
    marginBottom: 15,
    marginTop: 15,
  } as ViewStyle,
  gradientBottom: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 10,
    bottom: 74,
    width: globals.window.width * 0.9,
    height: 165 - 49.3,
  } as ViewStyle,
  gradientTop: (shift: number): ViewStyle => ({
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 10,
    top: 20 + shift,
    width: globals.window.width * 0.9,
    height: 165 - 49.3,
  }),
  currentBorder: (shift: number): ViewStyle => ({
    position: 'absolute',
    top: 165.5 + shift - 49.3,
    borderColor: globals.styles.colors.colorGray,
    width: globals.window.width * 0.9,
    height: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  }),
  closeButton: { padding: 8, position: 'absolute', top: 0, right: 0 } as ViewStyle,
  pinkButton: { width: globals.window.width - 32 - 64 } as ViewStyle,
}
