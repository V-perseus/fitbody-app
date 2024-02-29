import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    alignItems: 'center',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  view: {
    ...globals.styles.view,
    backgroundColor: globals.styles.colors.colorWhite,
    width: '100%',
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  buttonContainer: {
    justifyContent: 'center',
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 1,
    height: 60,
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonText: {
    color: globals.styles.colors.colorBlack,
  },
})

export default styles
