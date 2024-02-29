import { StyleSheet } from 'react-native'

import globals from '../../config/globals'

const styles = StyleSheet.create({
  profileUserDetailsContainer: {
    zIndex: 21,
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '100%',
  },
  userDetailSettingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    marginBottom: 1,
    height: 67,
    paddingLeft: 24,
    paddingRight: 24,
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 1,
  },
  userDetailTitleText: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
  },
  userDetailValue: {
    fontSize: 14,
    marginRight: 6,
    color: globals.styles.colors.colorPink,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textTransform: 'uppercase',
  },
})

export default styles
