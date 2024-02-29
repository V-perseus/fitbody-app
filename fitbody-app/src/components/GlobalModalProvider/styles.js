import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

export default StyleSheet.create({
  // Loading Modal
  loadingModal: {
    margin: 0,
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifSize: {
    height: 100,
  },
  // Error Modal
  errorModal: {
    justifyContent: 'flex-start',
    marginTop: 46,
    marginHorizontal: 0,
  },
  errorView: {
    backgroundColor: globals.styles.colors.colorWhite,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 4,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  errorText: {
    marginLeft: 25,
    fontSize: 15,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: 'black',
    // textAlign: 'center',
    lineHeight: 20,
  },
})
