import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  listItemRow: {
    height: 40,
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 18,
    height: 18,
  },
  workoutTitle: {
    marginHorizontal: 6,
    fontSize: 12,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  levelTitle: {
    fontSize: 11,
    marginRight: 4,
    width: 90,
    textAlign: 'right',
  },
  week: {
    fontSize: 11,
    borderWidth: 0,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    width: 53,
    textAlign: 'right',
  },
  challengeTitle: {
    width: globals.window.width - 163 - 63,
    color: globals.styles.colors.colorYellow,
    marginHorizontal: 6,
    fontSize: 12,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  challengeText: {
    fontSize: 11,
    marginHorizontal: 0,
    width: 90,
    marginRight: 4,
    textAlign: 'right',
  },
  challengeDate: {
    fontSize: 11,
    borderWidth: 0,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    width: 53,
    textAlign: 'right',
  },
  videoTitle: {
    width: globals.window.width - 163 - 63,
    color: globals.styles.colors.colorBlackDark,
    marginHorizontal: 6,
    fontSize: 12,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  listItemRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 6,
    paddingVertical: 7,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  listItemRowHeaderDate: {
    fontSize: 12,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  challengeStarBig: {
    marginRight: 5,
  },
  inactiveContainer: {
    height: 30,
    flexDirection: 'row',
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inactiveText: {
    fontSize: 12,
    color: globals.styles.colors.colorGrayDark,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
})

export default styles
