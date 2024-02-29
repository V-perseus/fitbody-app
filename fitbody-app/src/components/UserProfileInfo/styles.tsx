import globals from '../../config/globals'
import { Platform, StyleSheet, StatusBar } from 'react-native'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
  },
  view: {
    bottom: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 15,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 35 + (StatusBar.currentHeight || 0),
  },
  profileImageContainer: {
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: 136,
    width: 136,
    marginTop: 43,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDefaultImageContainer: {
    borderRadius: 100,
    backgroundColor: globals.styles.colors.colorWhite,
    height: 128,
    width: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    textTransform: 'uppercase',
    fontSize: 30,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  location: {
    fontSize: 12,
    color: globals.styles.colors.colorWhite,
    marginTop: 6,
    marginBottom: 31,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  headshot: {
    width: 128,
    height: 128,
    borderRadius: 100,
  },
  headshotButton: {
    marginTop: 43,
    marginBottom: 20,
    zIndex: 50,
    width: 136,
    height: 136,
    borderRadius: 100,
    backgroundColor: globals.styles.colors.colorTransparentWhite50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: globals.styles.colors.colorPink,
  },
})

export default styles
