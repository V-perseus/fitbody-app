import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    width: globals.window.width,
    height: 55,
    // borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 21,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  dayContainer: {
    flexDirection: 'row',
    height: 30,
    // borderWidth: 1,
    marginHorizontal: 18,
    width: globals.window.width - 36,
    // backgroundColor: globals.styles.colors.colorWhite
  },
  dayView: {
    width: (globals.window.width - 36) / 7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 13,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
})

export default styles
