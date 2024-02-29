import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    ...globals.styles.container,
  },
  backIcon: {
    ...globals.header.icons,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  headerRight: {
    ...globals.header.icons,
  },
})

export default styles
