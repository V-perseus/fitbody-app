import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  container: {
    backgroundColor: globals.styles.colors.colorWhite,
    ...globals.styles.container,
  },
  view: {
    // alignItems: "center",
    ...globals.styles.view,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  saveButton: {
    ...globals.header.icons,
  },
  saveButtonText: {
    fontSize: 12,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
  textFields: {
    width: '100%',
    color: globals.styles.colors.colorBlack,
    borderBottomWidth: 1,
    borderColor: globals.styles.colors.colorGray,
    marginBottom: 23,
    fontSize: 16,
    paddingLeft: 0,
    paddingTop: 10,
    paddingBottom: 10,
  },
  text: {
    color: globals.styles.colors.colorGrayDark,
    fontSize: 12,
  },
  headshot: {
    marginTop: 40,
    marginBottom: 40,
    borderColor: globals.styles.colors.colorGray,
    borderWidth: 2,
    width: 105,
    height: 105,
    borderRadius: 50,
  },
  headshotButton: {
    marginTop: 20,
    marginBottom: 40,
    borderColor: globals.styles.colors.colorGray,
    borderWidth: 2,
    width: 105,
    height: 105,
    borderRadius: 50,
    backgroundColor: globals.styles.colors.colorGrayLight,
    flex: 1,
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
