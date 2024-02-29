import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingTop: 8,
  },
  safe: {
    flex: 1,
    ...globals.window,
  },
  icons: {
    ...globals.header.icons,
  },
  navLabel: {
    color: globals.styles.colors.colorBlack,
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  photoContainer: {
    flex: 1,
    width: globals.window.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  collageFrame: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    height: 300,
  },
  collageFooter: {
    height: 70,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collageImages: {
    height: 230,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  collageImage: {
    borderWidth: 0.2,
    width: '50%',
  },
  collageFooterItem: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collageFooterText: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorWhite,
    fontSize: 24,
  },
  footerIcon: {
    color: globals.styles.colors.colorWhite,
    fontSize: 30,
    textAlign: 'center',
  },
  beforeImage: {
    height: '100%',
    width: '100%',
  },
})

export default styles
