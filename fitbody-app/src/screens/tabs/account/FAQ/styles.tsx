import { StyleSheet, Dimensions } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  view: {
    ...globals.styles.view,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  buttonText: {
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  submitContainer: {
    paddingTop: 100,
  },
  tabActive: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 57,
    borderRadius: 50,
    width: 160,
    marginTop: 5,
    marginLeft: 9,
    marginRight: 9,
    marginBottom: 5,
  },
  tabInactive: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 50,
    width: 140,
    marginTop: 10,
    marginLeft: 9,
    marginRight: 9,
    marginBottom: 5,
  },
  headerStyle: {
    height: 180,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
})

export default styles
