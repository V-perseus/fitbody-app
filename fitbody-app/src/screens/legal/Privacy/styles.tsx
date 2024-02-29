import { StyleSheet } from 'react-native'
import globals from '../../../config/globals'

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
    color: globals.styles.colors.colorBlack,
  },
  html: {
    flex: 1,
  },
})

export default styles
