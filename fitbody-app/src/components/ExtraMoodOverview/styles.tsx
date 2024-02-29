import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    paddingTop: 56,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  listContainer: {
    paddingTop: 56,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  nonEditableListContainer: {
    paddingTop: 7,
    paddingBottom: 26,
    flexDirection: 'row',
  },
  listContent: {
    paddingHorizontal: 12,
  },
  nonEditableListContent: {
    paddingLeft: 31,
    paddingRight: 19,
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 37,
    marginHorizontal: 13,
    backgroundColor: globals.styles.colors.colorGrayLight,
    borderRadius: 7,
    paddingHorizontal: 15,
  },
  addButton: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    paddingLeft: 7,
    paddingTop: 2,
    color: globals.styles.colors.colorGrayDark,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globals.styles.colors.colorPurple,
    marginRight: 12,
    borderRadius: 7,
    height: 37,
    paddingHorizontal: 8,
  },
  tileText: {
    marginTop: 2,
    paddingLeft: 7,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    color: globals.styles.colors.colorWhite,
  },
})

export default styles
