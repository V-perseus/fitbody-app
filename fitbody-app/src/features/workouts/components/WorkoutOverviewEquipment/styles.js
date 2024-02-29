import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  equipmentContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginTop: 0,
    padding: 15,
    paddingHorizontal: 19,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  header: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
  },
  iconBox: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  iconBorder: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconName: {
    fontSize: 10,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorGrayDark,
  },
})

export default styles
