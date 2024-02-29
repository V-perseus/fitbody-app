import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  HeaderRightIcon: {
    height: 24,
    backgroundColor: globals.styles.colors.colorWhite,
    marginRight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputContainer: { paddingHorizontal: 24, marginTop: 16 },
  AddUpdateButton: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 24,
    marginTop: 25,
    marginBottom: 30,
    height: 56,
    borderRadius: 28,
    backgroundColor: globals.styles.colors.colorPink,
    justifyContent: 'center',
    shadowColor: globals.styles.colors.colorPink,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 3,
  },
  AddUpdateButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  InputLabel: { fontSize: 12, fontFamily: globals.fonts.primary.boldStyle.fontFamily },
  InputStyle: {
    paddingHorizontal: 16,
    color: globals.styles.colors.colorBlack,
    height: 40,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorGray,
    fontSize: 14,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    marginBottom: 16,
    marginTop: 4,
  },
  CalorieText: {
    paddingHorizontal: 24,
    textAlign: 'center',
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 12,
    color: globals.styles.colors.colorGrayDark,
  },
})

export default styles
