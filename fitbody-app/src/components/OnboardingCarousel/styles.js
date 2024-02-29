import { StyleSheet } from 'react-native'
import globals from '../../config/globals'
import { ms, s } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  image: {
    width: globals.window.width - 64,
    flex: 1,
  },
  title: {
    marginTop: 15,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: s(30),
    textAlign: 'center',
    color: globals.styles.colors.colorBlack,
  },
  description: {
    marginTop: 11,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: s(16),
    textAlign: 'center',
    color: globals.styles.colors.colorGrayDark,
  },
  paginationContainer: {
    paddingVertical: 25,
  },
  dotContainer: {
    marginHorizontal: 4,
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 13.2,
    margin: 0,
    padding: 0,
  },
})

export default styles
