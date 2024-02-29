import { Platform, StatusBar, StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    alignItems: 'center',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  view: {
    ...globals.styles.view,
    backgroundColor: globals.styles.colors.colorWhite,
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 50 : 50 + (StatusBar.currentHeight || 0),
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  notificationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  buttonText: {
    color: globals.styles.colors.colorBlackDark,
  },
  footnote: {
    fontSize: 10,
    fontStyle: 'italic',
    color: globals.styles.colors.colorGrayDark,
  },
  noDownloads: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 15,
    letterSpacing: -0.3,
    textAlign: 'center',
    color: globals.styles.colors.colorBlack,
    marginTop: 13,
  },
  title: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 15,
    letterSpacing: -0.3,
    color: globals.styles.colors.colorBlack,
  },
  subTitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    color: globals.styles.colors.colorBlack,
  },
  downloadItemContainer: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 1,
  },
})

export default styles
