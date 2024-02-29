import { StyleSheet } from 'react-native'
import globals from '../../config/globals'

const styles = StyleSheet.create({
  container: {
    ...globals.styles.container,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  view: {
    ...globals.styles.view,
  },
  headerTitle: {
    ...globals.header.headerTitleStyle,
  },
  textFieldsAnswer: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 12,
    paddingLeft: 10,
    paddingTop: 10,
    lineHeight: 25,
    color: globals.styles.colors.colorBlack,
  },
  boldText: {
    fontWeight: 'bold',
  },
  question: {
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 1,
  },
  questionHeader: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionHeaderActive: {
    minHeight: 70,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    justifyContent: 'center',
    width: globals.window.width * 0.1,
  },
  textFieldsQuestion: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 14,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 8,
    lineHeight: 20,
    color: globals.styles.colors.colorBlack,
    flexWrap: 'wrap',
    width: globals.window.width * 0.9,
  },
  textFieldsQuestionActive: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 14,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 5,
    lineHeight: 20,
    color: globals.styles.colors.colorWhite,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: globals.window.width * 0.9,
  },
  answerBody: {
    paddingBottom: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    borderLeftColor: globals.styles.colors.colorLove,
    borderLeftWidth: 3,
  },
})

export default styles
