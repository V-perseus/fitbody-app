import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  recipeName: {
    color: globals.styles.colors.colorBlackDark,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 30,
    lineHeight: 30,
    paddingLeft: 24,
    maxWidth: 250,
    textTransform: 'uppercase',
  },
  slotName: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    color: globals.styles.colors.colorBlackDark,
    fontSize: 12,
    paddingLeft: 24,
    textTransform: 'uppercase',
  },
  roundButton: {
    backgroundColor: globals.styles.colors.colorGreen,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 18,
    paddingHorizontal: 8,
    // width: 150
  },
  foodTypeLabel: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
    lineHeight: 20,
    color: globals.styles.colors.colorWhite,
    marginLeft: 4,
  },
  timeInfoContainer: {
    marginTop: 25,
    width: '100%',
    flexDirection: 'row',
  },
  timeInfo: {
    marginLeft: 24,
    // marginRight: 24,
  },
  timeLabel: {
    fontSize: 12,
    color: globals.styles.colors.colorBlackDark,
    marginBottom: 3,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  timeValue: {
    fontSize: 23,
    // lineHeight: 24,
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  nutritionsToggle: {
    height: 35,
    width: '100%',
    marginTop: 22,
    backgroundColor: globals.styles.colors.colorGrayLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: globals.styles.colors.colorGray,
  },
  toggleLabel: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    textAlign: 'center',
    color: globals.styles.colors.colorBlack,
    marginRight: 7,
  },
  ingredientsContainer: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: globals.styles.colors.colorGray,
  },
  ingredientsLabel: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
    marginTop: 24,
    // paddingHorizontal: 24,
    // lineHeight: 24,
    color: globals.styles.colors.colorBlack,
  },
  ingredientWrapper: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
  },
  listItemMark: {
    width: 6,
    height: 6,
    marginRight: 13,
    backgroundColor: globals.styles.colors.colorPink,
  },
  ingredientInfo: {
    flex: 1,
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 13,
    color: globals.styles.colors.colorBlackDark,
    marginTop: -5,
  },
})

export default styles
