import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // height: 65,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 2,
  },
  foodContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: globals.styles.colors.colorGrayLight,
    backgroundColor: globals.styles.colors.colorGrayLight,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  name: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorBlackDark,
  },
  amount: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.style.fontFamily,
    color: globals.styles.colors.colorGrayDark,
  },
  addFoodBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 70,
    height: 50,
  },
  typeTitle: { fontSize: 12, fontFamily: globals.fonts.primary.style.fontFamily },
})

export default styles
