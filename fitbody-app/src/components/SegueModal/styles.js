import { StyleSheet } from 'react-native'
import globals from '../../config/globals'
import { moderateScale, ms } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  cancelIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContents: {
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingTop: ms(32),
    paddingBottom: ms(24),
    paddingHorizontal: ms(32),
  },
  modalTitle: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: moderateScale(18),
    textAlign: 'center',
    color: 'black',
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton1: {
    flex: 1,
    height: 48,
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
    height: 48,
    marginRight: 12.5,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: ms(14),
    textAlign: 'center',
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
