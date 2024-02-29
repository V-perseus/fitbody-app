import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  titleText: { fontSize: 25, fontFamily: globals.fonts.secondary.style.fontFamily, paddingHorizontal: 10, textAlign: 'center' },
  image: { height: 190, width: 190 },
  header: {
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    marginRight: 20,
    flexShrink: 1,
  },
  labels: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    letterSpacing: -0.4,
    fontSize: 12,
    flexWrap: 'wrap',
  },
  right: {
    textAlign: 'right',
    flexShrink: 0,
  },
  subtitleLabel: {
    lineHeight: 14,
    fontSize: 13,
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    letterSpacing: -0.3,
    opacity: 0.7,
  },
  videoContainer: {
    height: 190,
    width: 190,
    // alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 24,
    marginTop: 18,
  },
  video: {
    height: 186,
    // borderWidth: 1,
  },
  equipmentView: {
    width: globals.window.width,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  equipmentText: {
    color: globals.styles.colors.colorGrayDark,
    textAlign: 'center',
  },
})

export default styles
