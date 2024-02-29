import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'
import { moderateScale, scale } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  header: {
    width: globals.window.width,
    height: scale(160),
    flexDirection: 'column',
  },
  titleBar: {
    height: scale(90),
    width: globals.window.width,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  titleBarInner: {
    width: globals.window.width,
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: moderateScale(16),
    color: globals.styles.colors.colorWhite,
    lineHeight: moderateScale(22),
    letterSpacing: scale(-0.39),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'center',
  },
  headerDateButton: {
    paddingLeft: scale(24),
    flexDirection: 'row',
    borderBottomWidth: 3,
    borderBottomColor: globals.styles.colors.colorGray,
  },
  headerDateView: {
    paddingRight: scale(24),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scale(69),
  },
  headerDate: {
    fontSize: moderateScale(13),
    color: globals.styles.colors.colorBlack,
    letterSpacing: 0,
    fontFamily: globals.fonts.primary.style.fontFamily,
    paddingRight: scale(5),
  },
  rowAlignEnd: { flexDirection: 'row', alignItems: 'flex-end' },
  headerDateText: { fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: moderateScale(20) },
  headerDateChevronDown: { marginBottom: 4, marginLeft: 2 },
  toggleSelect: {
    borderLeftWidth: 1,
    borderLeftColor: globals.styles.colors.colorGray,
    width: scale(72),
    height: scale(69),
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBar: {
    flex: 1,
  },
  container: {
    width: globals.window.width,
    flexGrow: 1,
  },
  deleteContainer: {
    width: scale(73),
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  row: {
    width: globals.window.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: scale(20),
    paddingRight: scale(20),
    backgroundColor: globals.styles.colors.colorWhite,
  },
  activeDayButton: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  inactiveDayButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: globals.styles.colors.colorWhite,
  },
  dayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(58),
    overflow: 'hidden',
    borderWidth: 0,
  },
  dayWrapperText: {
    fontSize: moderateScale(18),
    fontFamily: globals.fonts.secondary.style.fontFamily,
    marginBottom: scale(15),
    color: globals.styles.colors.colorWhite,
  },
  dayContainer: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(6),
    marginLeft: scale(12),
    marginRight: scale(12),
    marginBottom: scale(7),
  },
  dateWord: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: moderateScale(11),
    color: globals.styles.colors.colorWhite,
  },
  dayWord: {
    fontSize: moderateScale(11),
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  activeDayLabel: {
    color: globals.styles.colors.colorPink,
  },
  daySliding: {
    width: scale(16),
    height: scale(2),
    backgroundColor: 'transparent',
  },
  mealContainer: {
    flexGrow: 1,
    paddingBottom: scale(50),
  },
  bannerContainer: {
    paddingHorizontal: scale(24),
    width: '100%',
  },
  recommendedBanner: {
    width: '100%',
    marginTop: scale(20),
    marginBottom: scale(18),
    height: scale(65),
    borderRadius: scale(8),
    backgroundColor: globals.styles.colors.colorPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: scale(14),
    paddingRight: scale(15),
    paddingBottom: scale(12),
    paddingLeft: scale(21),
  },
  bannerHeader: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: moderateScale(12),
    color: globals.styles.colors.colorWhite,
  },
  bannerTitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: moderateScale(20),
    color: globals.styles.colors.colorWhite,
  },
  closeBannerBtn: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    margin: scale(5),
    backgroundColor: globals.styles.colors.colorWhite,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFoodBtn: {
    fontSize: moderateScale(15),
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorPink,
    marginTop: scale(12),
    marginBottom: scale(19),
    paddingLeft: scale(24),
  },
  editModeView: { flexDirection: 'row', paddingHorizontal: 16 },
  editModeCopyButton: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: scale(5),
    marginHorizontal: scale(8),
    marginTop: scale(25),
    marginBottom: scale(30),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: globals.styles.colors.colorPurple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: globals.styles.colors.colorPurple,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: scale(15),
    elevation: 3,
  },
  editModeCopyButtonText: {
    marginLeft: scale(8),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  editModeDeleteButton: {
    flex: 1,
    marginVertical: scale(5),
    marginHorizontal: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(25),
    marginBottom: scale(30),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: globals.styles.colors.colorLove,
    justifyContent: 'center',
    shadowColor: globals.styles.colors.colorPink,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: scale(15),
    elevation: 3,
  },
  editModeDeleteButtonText: {
    marginLeft: scale(8),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  hiddenEditButtonContainer: {
    alignItems: 'center',
    flex: 1,
    height: scale(48),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default styles