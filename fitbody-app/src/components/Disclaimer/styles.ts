import { StyleSheet, Dimensions } from 'react-native'
import globals from '../../config/globals'
import { ms } from 'react-native-size-matters/extend'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
  },
  modalContainer: {
    flex: 1,
    borderWidth: 4,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContents: {
    alignItems: 'center',
    borderWidth: 1,
    width: Dimensions.get('window').width - 32,
    maxHeight: Dimensions.get('window').height - 32,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 32,
  },
  modalTitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: ms(30),
    textAlign: 'center',
    color: globals.styles.colors.colorPink,
    marginTop: 10,
  },
  scrollView: {
    marginBottom: 11,
  },
  bodyText: {
    flex: 1,
  },
  linkText: {
    color: globals.styles.colors.colorPink,
    textDecorationLine: 'none',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  activeButton: {
    flex: 1,
    height: 48,
    backgroundColor: globals.styles.colors.colorPink,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 5,
  },
  activeLabel: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  inactiveButton: {
    flex: 1,
    height: 48,
    borderColor: globals.styles.colors.colorBlack,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 5,
  },
  inactiveLabel: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorBlack,
  },
})

export default styles
