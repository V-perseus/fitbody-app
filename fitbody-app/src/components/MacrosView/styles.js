import { StyleSheet } from 'react-native'
import globals from '../../config/globals'
import { scale, moderateScale } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: moderateScale(122),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: globals.styles.colors.colorWhite,
    paddingHorizontal: 0,
  },
  name: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: scale(12),
    letterSpacing: 0,
    marginTop: scale(-4),
    color: globals.styles.colors.colorGrayDark,
  },
  amount: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: scale(25),
    letterSpacing: 0,
    color: globals.styles.colors.colorBlack,
    marginTop: scale(4),
  },
})

export default styles
