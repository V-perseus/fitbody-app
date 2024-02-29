import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  calendarDayContainer: {
    width: (globals.window.width - 36) / 7 - 7,
    flexGrow: 7,
    height: 74,
    flexDirection: 'column',
    alignItems: 'center',
    margin: 1,
    borderRadius: 3,
    borderColor: globals.styles.colors.colorWhite,
  },
  dayLabel: {
    fontSize: 17,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    marginTop: 2,
  },
  pseudoContainer: {
    // flex: 1,
    // borderWidth: 1,
    // margin: 1,
    // overflow:'visible',
    width: (globals.window.width - 36) / 7 - 7,
  },
  top: {
    alignItems: 'center',
  },
  bottom: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  singleIcon: {
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: (globals.window.width - 36) / 7 - 7,
  },
  categoryIcon: {
    marginTop: 3,
  },
})

export default styles
