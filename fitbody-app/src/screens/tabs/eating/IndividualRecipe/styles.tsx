import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'
import { moderateScale, scale } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  panelHandleWrapper: { alignSelf: 'stretch', alignItems: 'center' },
  panelHandle: {
    width: 32,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  hiddenItemButtons: {
    alignItems: 'center',
    flex: 1,
    height: scale(48),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hiddenItemButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  instructionListItemRow: { flexDirection: 'row', marginTop: 8 },
  instructionListItemNumber: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    color: globals.styles.colors.colorPink,
    marginRight: 6,
  },
  instructionListItemText: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 12,
    color: globals.styles.colors.colorBlackDark,
    marginTop: 2,
    marginRight: 15,
  },
  instructionListItemTextSingle: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 12,
    color: globals.styles.colors.colorBlackDark,
  },
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
  revertWrapper: { paddingHorizontal: 24, marginTop: 20 },
  revertButton: { borderRadius: 8, borderWidth: 1, borderColor: globals.styles.colors.colorPink, alignItems: 'center' },
  revertButtonText: {
    paddingVertical: 15,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorPink,
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
    borderColor: '#eaeaea',
  },
  nutritionFactsWrapper: { borderBottomWidth: 3, borderBottomColor: globals.styles.colors.colorGray },
  toggleLabel: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    textAlign: 'center',
    color: globals.styles.colors.colorBlack,
    marginRight: 7,
  },
  ingredientsContainer: {
    width: '100%',
    // paddingTop: 10,
    paddingBottom: 24,
    // paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  toolsContainer: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  ingredientsLabel: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
    marginTop: 24,
    // paddingHorizontal: 24,
    // lineHeight: 24,
    color: globals.styles.colors.colorBlack,
  },
  recipeInstructions: { fontSize: 13, lineHeight: 19, fontFamily: globals.fonts.primary.style.fontFamily },
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
  deleteContainer: {
    width: scale(73),
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 10,
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopColor: globals.styles.colors.colorGray,
    borderTopWidth: 1,
  },
  buttonContainerView: { marginTop: 16, marginBottom: 35, height: 55, paddingHorizontal: 27 },
  addIngredientBtn: {
    fontSize: moderateScale(15),
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorPink,
    marginTop: scale(12),
    marginBottom: scale(0),
    paddingLeft: scale(24),
  },
  addFoodBtn: {
    width: '100%',
    height: '100%',
    backgroundColor: globals.styles.colors.colorPink,
    borderRadius: 35,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: globals.styles.colors.colorPink,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.71,
    shadowRadius: 10,
    elevation: 2,
  },
  saveFoodBtn: {
    width: '100%',
    height: '100%',
    backgroundColor: globals.styles.colors.colorSkyBlue,
    borderRadius: 35,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: globals.styles.colors.colorSkyBlue,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.71,
    shadowRadius: 10,
    elevation: 2,
  },
  buttonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    lineHeight: 22,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
})

export default styles
