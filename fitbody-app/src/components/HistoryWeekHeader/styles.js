import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    width: globals.window.width,
    height: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  iconMargin: {
    marginHorizontal: 20,
  },
  weekContainer: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 20,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  monthLabel: {
    fontSize: 17,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  logoItem: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
  },
  headerLabel: {
    fontSize: 18,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
  },
})

export default styles
