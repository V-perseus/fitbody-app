import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContents: {
    marginHorizontal: 32,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    minHeight: 197,
    paddingTop: 39,
    paddingBottom: 25,
    paddingHorizontal: 25,
  },
  modalTitle: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 17,
    textAlign: 'center',
    letterSpacing: -0.36,
    color: 'black',
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  modalButton1: {
    flex: 1,
    height: 55,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: globals.styles.colors.colorBlack,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton2: {
    flex: 1,
    height: 55,
    marginLeft: 12.5,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: -0.39,
    color: globals.styles.colors.colorBlack,
  },
  textColor1: {
    color: globals.styles.colors.colorBlack,
  },
  textColor2: {
    color: globals.styles.colors.colorWhite,
  },
})

export default styles
