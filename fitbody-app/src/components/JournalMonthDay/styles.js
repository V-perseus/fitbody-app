import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  calendarDayContainer: {
    width: (globals.window.width - 36) / 7 - 7,
    flexGrow: 7,
    height: 70,
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: 'rgba(255,255,255, 0.4)',
    margin: 1,
    borderRadius: 3,
    // borderWidth:1,
    borderColor: globals.styles.colors.colorWhite,
  },
  dayLabel: {
    fontSize: 17,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    marginTop: 2,
    marginBottom: 3,
  },
  pseudoContainer: {
    width: (globals.window.width - 36) / 7 - 7,
    // flexGrow: 7
  },
  top: {
    alignItems: 'center',
  },
  bottom: {
    // borderWidth:1,
    alignItems: 'center',
    flexDirection: 'column',
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end'
  },
  singleIcon: {
    marginBottom: 20,
  },
})

export default styles
