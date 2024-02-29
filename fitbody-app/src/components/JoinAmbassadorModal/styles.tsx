import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  cancelIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  modalContainer: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContents: {
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingVertical: 31,
    paddingHorizontal: 25,
  },
  modalTitle: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    marginBottom: 23,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    borderTopColor: globals.styles.colors.colorPink,
    borderBottomColor: globals.styles.colors.colorPink,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    paddingVertical: 11,
    marginBottom: 24,
  },
  bannerText: {
    textAlign: 'center',
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 45,
    letterSpacing: 0,
    color: globals.styles.colors.colorPink,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
  },
  footnote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
})

export default styles
