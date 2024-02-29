import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    backgroundColor: globals.styles.colors.colorWhite,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: globals.styles.colors.colorGray,
  },
  edit: {
    width: 65,
    height: 25,
    alignItems: 'center',
  },
  titleLabel: {
    flex: 1,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'center',
    fontSize: 24,
    color: globals.styles.colors.colorBlack,
    marginBottom: 9,
  },
  activityTitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'left',
    fontSize: 23,
    color: globals.styles.colors.colorBlack,
    paddingLeft: 31,
    paddingTop: 22,
  },
  section: {
    paddingHorizontal: 31,
    paddingTop: 21,
    borderTopWidth: 1,
    borderColor: globals.styles.colors.colorGray,
    backgroundColor: globals.styles.colors.colorWhite,
    height: 137,
  },
  sectionTitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'left',
    fontSize: 25,
    color: globals.styles.colors.colorBlack,
    paddingBottom: 5,
  },
  input: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    marginHorizontal: 0,
    padding: 0,
    fontSize: 15,
    color: globals.styles.colors.colorBlack,
  },
  addButton: {
    width: globals.window.width * 0.9,
    height: 55,
    borderRadius: 35,
    justifyContent: 'center',
    backgroundColor: globals.styles.colors.colorPink,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: globals.styles.colors.colorPink,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  addButtonText: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.39,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
})

export default styles
