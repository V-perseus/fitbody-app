import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  modalContent: {
    // padding: 32,
    // paddingTop: 32,
    paddingBottom: 0,
    width: globals.window.width * 0.9,
    height: 445,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 10,
  },
  modalContentColumn: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
  titleContainer: { height: 70, marginTop: 12, alignItems: 'center', justifyContent: 'center' },
  titleText: {
    textAlign: 'center',
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
    color: globals.styles.colors.colorBlackDark,
  },
  pickerContainer: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  pickerContainerItem: { width: '100%', height: 60 },
  item: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 18,
    color: globals.styles.colors.colorBlack,
    marginTop: 10,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 75,
    width: globals.window.width * 0.9,
    height: 165 - 49.3,
  },
  gradientTop: {
    position: 'absolute',
    top: 75,
    width: globals.window.width * 0.9,
    height: 165 - 49.3,
  },
  currentBorder: {
    position: 'absolute',
    top: 180,
    borderColor: globals.styles.colors.colorGray,
    width: globals.window.width * 0.9,
    height: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  closeButton: { padding: 8, position: 'absolute', top: 0, right: 0 },
  pinkButton: { width: globals.window.width - 32 - 64 },
})

export default styles
