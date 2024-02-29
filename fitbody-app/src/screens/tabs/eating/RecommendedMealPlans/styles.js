import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  titleContainer: {
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
    color: globals.styles.colors.colorBlack,
  },
  veganBtn: {
    width: 95,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  veganText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 14,
    color: globals.styles.colors.colorBlackDark,
  },
  description: {
    marginTop: 19,
    marginBottom: 20,
    paddingHorizontal: 27,
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 10,
    color: globals.styles.colors.colorGrayDark,
  },
  mealSetsContainer: {
    paddingLeft: 27,
    paddingTop: 26,
    paddingBottom: 26,
    width: '100%',
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  loadingContainer: { marginTop: 58, flex: 1, alignItems: 'center' },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  noResultsText: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 16, textAlign: 'center' },
})

export default styles
