import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  header: {
    marginTop: 41,
    height: 46,
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: 16,
    top: 4,
  },
  titleLabel: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'center',
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
    marginVertical: 12,
  },
  columnWrapper: {
    paddingHorizontal: 8,
    justifyContent: 'space-evenly',
  },
  // tile: {
  //   alignItems: 'center',
  //   width: globals.window.width * 0.24, // = 100 / 414
  //   height: 102,
  //   marginTop: 18,
  //   marginBottom: 8,
  // },
  // tileText: {
  //   marginTop: 14,
  //   paddingVertical: 3,
  //   width: globals.window.width * 0.24, // = 100 / 414
  //   height: 25,
  //   borderRadius: 6,
  //   backgroundColor: 'transparent',
  //   alignItems: 'center',
  // },
  // innerText: {
  //   fontFamily: globals.fonts.secondary.style.fontFamily,
  //   fontSize: 16,
  //   textAlign: 'center',
  // },

  unselectTileText: {
    color: globals.styles.colors.colorWhite,
    backgroundColor: globals.styles.colors.colorTransparentWhite15,
  },
  mainMoodTileText: {
    color: globals.styles.colors.colorBlack,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  extraMoodTileText: {
    color: globals.styles.colors.colorWhite,
    backgroundColor: globals.styles.colors.colorTwilight,
  },
  unselectInnerTileText: {
    color: globals.styles.colors.colorWhite,
  },
  mainMoodInnerTileText: {
    color: globals.styles.colors.colorBlack,
  },
  extraMoodInnerTileText: {
    color: globals.styles.colors.colorWhite,
  },
  saveButton: {
    margin: 33,
    height: 55,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 28,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    letterSpacing: -0.34,
    color: globals.styles.colors.colorPink,
    textAlign: 'center',
  },
})

export default styles
