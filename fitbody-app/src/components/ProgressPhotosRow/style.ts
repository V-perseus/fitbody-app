import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 10,
  },
  date: {
    fontSize: 15,
    color: globals.styles.colors.colorLove,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: ((globals.window.width - 64) / 3 / 117) * 206,
    width: (globals.window.width - 64) / 3,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  middleImage: {
    marginLeft: 8,
    marginRight: 8,
    height: ((globals.window.width - 64) / 3 / 117) * 206,
    width: (globals.window.width - 64) / 3,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  placeHolderImg: {
    margin: 5,
  },
})
