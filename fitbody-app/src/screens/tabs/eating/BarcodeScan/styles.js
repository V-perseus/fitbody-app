import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
  },
  headerSubtitleStyle: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    flex: 1,
    fontSize: 13,
    color: globals.styles.colors.colorLove,
  },
  preview: {
    flex: 1,
  },
  inputView: {
    width: globals.window.width,
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 27,
  },
  barcodeInput: {
    backgroundColor: globals.styles.colors.colorGrayLight,
    height: 47,
    width: '100%',
    borderRadius: 23.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  manualInput: {
    flex: 1,
    backgroundColor: 'transparent',
    marginLeft: 12,
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 16,
    letterSpacing: 0,
    color: globals.styles.colors.colorBlack,
  },
})

export default styles
