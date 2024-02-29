import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    paddingTop: 26,
    backgroundColor: globals.styles.colors.colorWhite,
    position: 'relative',
    marginBottom: 24,
  },
  mealTitle: {
    fontSize: 20,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorBlack,
    lineHeight: 24,
  },
  macrosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macros: {
    fontSize: 16,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorGrayDark,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: globals.styles.colors.colorPink,
    marginLeft: 4,
    marginRight: 4,
  },
  itemsContainer: {
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  recipeWrapper: {
    width: 179,
    backgroundColor: globals.styles.colors.colorWhite,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 3,
    borderRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: 'black',
    shadowOpacity: 0.11,
    shadowRadius: 15,
    elevation: 1.5,
  },
  imageWrapper: {
    width: 179,
    height: 137,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    overflow: 'hidden',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
  },
  icon: {
    marginLeft: 1.7,
    marginRight: 1.7,
  },
  itemTitle: {
    fontSize: 23,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: 'black',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 20,
    paddingHorizontal: 21,
  },
  category: {
    fontSize: 12,
    fontFamily: globals.fonts.primary.style.fontFamily,
    color: 'black',
    textAlign: 'center',
    marginTop: 1,
  },
  addSetButton: {
    position: 'absolute',
    top: -16,
    right: 27,
    width: 85,
    height: 33,
    borderRadius: 16.5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: globals.styles.colors.colorPink,
  },
  addSetButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 11,
    letterSpacing: 0,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  metricText: { fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12, marginLeft: 1 },
})

export default styles
