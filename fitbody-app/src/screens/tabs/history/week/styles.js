import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  headerTitle: {
    ...globals.header.headerTitleStyle,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  flex: {
    flexGrow: 1,
  },
  headerGoal: {
    ...globals.header.icons,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerGoalText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
  },
  viewSwitcher: {
    ...globals.header.icons,
  },
  backgroundImage: {
    width: globals.window.width,
    flex: 1,
  },
})

export default styles
