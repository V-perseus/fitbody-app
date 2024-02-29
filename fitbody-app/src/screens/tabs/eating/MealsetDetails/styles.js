import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 19,
  },
  searchContainer: {
    flex: 1,
    height: 47,
    justifyContent: 'center',
    backgroundColor: globals.styles.colors.colorGrayLight,
    position: 'relative',
    borderRadius: 23.5,
  },
  searchInput: {
    width: '100%',
    height: '100%',
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorBlack,
    backgroundColor: 'transparent',
    paddingHorizontal: 53,
  },
  searchIcon: {
    position: 'absolute',
    left: 17,
  },
  cancelIcon: {
    position: 'absolute',
    right: 14,
  },
  barcodeIcon: {
    width: 25,
    marginLeft: 17,
  },
  titleContainer: {
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
    color: globals.styles.colors.colorBlack,
  },
  veganBtn: {
    width: 95,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  veganText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    color: globals.styles.colors.colorBlackDark,
  },
  warningContainer: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
    color: globals.styles.colors.colorBlackDark,
    textAlign: 'center',
  },
  foodsContainer: {
    paddingLeft: 27,
    paddingRight: 19,
    width: '100%',
    flexGrow: 1,
    paddingBottom: 20,
  },
  searchAllContainer: {
    marginTop: 23,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchAllText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    letterSpacing: 0,
    color: globals.styles.colors.colorPink,
    marginLeft: 15,
  },
})

export default styles
