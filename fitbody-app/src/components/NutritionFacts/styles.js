import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  nutritionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 17,
    // paddingTop: 27,
    paddingHorizontal: 24,
    // paddingBottom: 23,
    borderColor: globals.styles.colors.colorGrayLight,
  },
  caloriesInfo: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  caloriesValue: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 30,
    color: globals.styles.colors.colorBlack,
    textAlign: 'center',
  },
  caloriesLabel: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 12,
    color: globals.styles.colors.colorBlack,
    textAlign: 'center',
    marginTop: -10,
  },
  proteinPercent: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    letterSpacing: 0,
    color: globals.styles.colors.colorLove,
  },
  carbsPercent: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    letterSpacing: 0,
    color: globals.styles.colors.colorPurple,
  },
  fatsPercent: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    letterSpacing: 0,
    color: globals.styles.colors.colorAqua,
  },
  proteinBar: {
    height: 2,
    width: 60,
    backgroundColor: globals.styles.colors.colorLove,
  },
  carbsBar: {
    height: 2,
    width: 60,
    backgroundColor: globals.styles.colors.colorPurple,
  },
  fatsBar: {
    height: 2,
    width: 60,
    backgroundColor: globals.styles.colors.colorAqua,
  },
  proteinLabel: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 12,
    // letterSpacing: 0,
    color: globals.styles.colors.colorGrayDark,
    marginTop: -3,
    // marginLeft: 3
  },
  proteinQuantity: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
    letterSpacing: 0,
    color: globals.styles.colors.colorBlack,
    marginTop: 2,
  },
  dailyLabel: {
    fontSize: 12,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorBlack,
    textAlign: 'right',
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
    color: globals.styles.colors.colorBlack,
  },
  subItemName: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 14,
    color: globals.styles.colors.colorBlack,
  },
  dailyValuesContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 26,
    paddingLeft: 28,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: globals.styles.colors.colorGrayLight,
  },
  gText: { fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 16, color: globals.styles.colors.colorBlack },
})

export default styles
