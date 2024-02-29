import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    backgroundColor: globals.styles.colors.colorPink,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
})

export default styles
