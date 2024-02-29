import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  modal: {
    ...globals.window,
  },
  internalModal: {
    height: globals.window.height * 0.92,
    width: globals.window.width * 0.9,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: globals.window.width * 0.05,
    marginTop: globals.window.width * 0.05 + 15,
    textAlign: 'right',
  },
  scrollView: {
    textAlign: 'right',
    flexDirection: 'column',
    paddingLeft: globals.window.width * 0.05,
    paddingRight: globals.window.width * 0.05,
    flexGrow: 1,
  },
  html: {
    flexGrow: 1,
    flexWrap: 'wrap',
    width: 0,
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    flex: 3,
  },
  closeIcon: {
    flex: 1,
    marginLeft: 'auto',
  },
  closeWrapper: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 5,
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
})

export default styles
