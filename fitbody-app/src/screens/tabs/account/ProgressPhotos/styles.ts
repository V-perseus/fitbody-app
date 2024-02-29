import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  navLabel: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
  },
  photoContainer: {
    width: globals.window.width,
    paddingHorizontal: 20,
    marginTop: 5,
    flex: 1,
  },
})

export default styles
