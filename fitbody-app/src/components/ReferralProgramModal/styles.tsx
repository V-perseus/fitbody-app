import { StyleSheet, Dimensions } from 'react-native'
import globals from '../../config/globals'
import colors from '../../config/colors'
import { ms } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  cancelButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  modalContainer: {
    flex: 1,
    borderWidth: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContents: {
    width: Dimensions.get('window').width - 32,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: ms(18),
    textAlign: 'center',
    color: 'black',
    marginBottom: 16,
  },
  banner: {
    marginBottom: 32,
  },
  bannerText: {
    textAlign: 'center',
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: ms(14),
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  modalButton: {
    flex: 1,
    height: 55,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralLink: {
    fontSize: ms(16),
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: colors.colorGrayDark,
  },
  shareContainer: {
    marginBottom: 32,
    marginHorizontal: 8,
  },
  shareContainerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 7,
  },
  share: {
    borderStyle: 'dashed',
    borderColor: colors.colorGrayDark,
    borderWidth: 2,
    height: 56,
    borderRadius: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  copied: {
    color: globals.styles.colors.colorLove,
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  referralCode: {
    color: globals.styles.colors.colorLove,
    flex: 1,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
    paddingHorizontal: 8,
  },
})

export default styles
