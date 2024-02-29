import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    alignItems: 'center',
  },
  view: {
    ...globals.styles.view,
    width: '100%',
    padding: 24,
    marginTop: 30,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
    color: globals.styles.colors.colorWhite,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 53,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: globals.styles.colors.colorWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 55,
    marginTop: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: globals.styles.colors.colorPink,
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  notification: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: globals.styles.colors.colorPink,
    // width: 26,
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
  },
  notificationText: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
})

export default styles
