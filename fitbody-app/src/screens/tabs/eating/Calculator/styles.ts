import { StyleSheet } from 'react-native'
import { vs } from 'react-native-size-matters/extend'

import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    paddingTop: 20,
    flexGrow: 1,
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  calculateButton: {
    height: 65,
    width: globals.window.width * 0.9,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  calculateText: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 20,
    letterSpacing: -0.4,
  },
  caloriesContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  titleLabel: {
    color: globals.styles.colors.colorBlack,
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  planRange: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  dailyFuel: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    letterSpacing: -0.4,
    marginBottom: vs(34),
  },
  calories: {
    fontSize: 40,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  mealPlan: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  number: {
    fontSize: 30,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    // width: globals.window.width * 0.85,
    marginTop: 0,
    marginHorizontal: 34,
    marginBottom: 25,
  },
  rowElement: {
    width: globals.window.width * 0.22,
    // borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  percentage: {
    fontSize: 18,
    color: globals.styles.colors.colorBlackDark,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  type: {
    paddingTop: 4,
    fontSize: 27,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorBlack,
    // opacity: 0.8
  },
  grams: {
    fontSize: 16,
    marginTop: -5,
    color: globals.styles.colors.colorGrayDark,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  chartText: {
    // font: 16px/1.4em "Montserrat", Arial, sans-serif;
    // fill: #000;
    // -moz-transform: translateY(0.25em);
    // -ms-transform: translateY(0.25em);
    // -webkit-transform: translateY(0.25em);
    // transform: translateY('0.25em')
  },

  chartNumber: {
    // font-size: 0.6em;
    // line-height: 1;
    // textAnchor: 'middle',
    // transform: translateY('-0.25em')
  },
  chartLabel: {
    fontSize: 20,
    // text-transform: uppercase;
    // textAnchor: 'middle',
    // transform: translateY('0.7em')
  },
  gradientStyles: {
    paddingBottom: 20,
    height: vs(299),
    alignItems: 'center',
    paddingTop: vs(60),
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  cardSection: {
    flex: 1,
    overflow: 'hidden',
    marginTop: -globals.window.width / 6 - 10,
  },
  whiteCardView: {
    backgroundColor: globals.styles.colors.colorWhite,
    alignItems: 'center',
    marginTop: 10,
    paddingTop: globals.window.height * 0.05,
    height: globals.window.width * 2,
    width: globals.window.width * 2,
    borderTopLeftRadius: globals.window.width,
    borderTopRightRadius: globals.window.width,
    marginLeft: -globals.window.width / 2,
  },
  whiteCardViewInner: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatedTextView: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyFuelView: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center' },
  calculatedDailyFuelView: {
    zIndex: 20,
    color: globals.styles.colors.colorBlackDark,
    borderWidth: 0,
    alignItems: 'center',
  },
  calculatedDailyFuelText: {
    fontSize: vs(70),
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  caloriesTextView: {
    marginTop: vs(-20),
    zIndex: 20,
    color: globals.styles.colors.colorBlackDark,
    borderWidth: 0,
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: vs(20),
    fontFamily: globals.fonts.primary.style.fontFamily,
  },
  recalcView: {
    position: 'absolute',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOpacity: 0.26,
    shadowRadius: 4,
    top: 0,
    left: globals.window.width / 2 - 60,
    width: 120,
    height: 28,
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsContainer: {
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 10,
    borderWidth: 0,
    overflow: 'visible',
  },
  proteinPercentView: { alignSelf: 'stretch', borderBottomWidth: 2, borderBottomColor: globals.styles.colors.colorLove },
  carbsPercentView: { alignSelf: 'stretch', borderBottomWidth: 2, borderBottomColor: globals.styles.colors.colorPurple },
  fatsPercentView: { alignSelf: 'stretch', borderBottomWidth: 2, borderBottomColor: globals.styles.colors.colorAqua },
  pinkButtonStyles: { marginTop: 0, marginHorizontal: 34, marginBottom: 10 },
  pinkButtonBtnStyles: { marginLeft: 15, marginRight: 15, alignSelf: 'stretch', width: 'auto' },
  activityButtonWrapper: { marginHorizontal: 24, marginTop: 24, marginBottom: 32 },
  activityButton: { backgroundColor: globals.styles.colors.colorPink, width: '100%' },
  activityButtonText: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
})

export default styles
