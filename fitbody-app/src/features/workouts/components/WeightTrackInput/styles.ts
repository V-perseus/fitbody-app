import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

export const createStyles = (bgColor: string, secondaryColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    description: {
      display: 'flex',
      flexDirection: 'column',
      paddingVertical: 24,
      alignItems: 'center',
    },
    descText: {
      paddingTop: 4,
      fontFamily: globals.fonts.primary.style.fontFamily,
      fontSize: 12,
    },
    setTitleView: {
      backgroundColor: bgColor, // #66000000
      paddingVertical: 4,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    setTitleText: {
      fontFamily: globals.fonts.primary.style.fontFamily,
      fontSize: 20,
      color: globals.styles.colors.colorBlack,
      fontWeight: 'bold',
    },
    setContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flex: 2,
      paddingTop: 28,
      paddingBottom: 30,
      paddingHorizontal: 20,
    },
    leftInputWrapper: {
      flex: 1,
      paddingRight: 9,
    },
    rightInputWrapper: {
      flex: 1,
      paddingLeft: 9,
    },
    customInput: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: globals.styles.colors.colorGray,
      paddingHorizontal: 16,
      height: 58,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputRightWrapper: {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: 12,
      alignItems: 'flex-end',
    },
    inputRightTopText: {
      fontSize: 16,
      fontWeight: '700',
      fontFamily: globals.fonts.primary.style.fontFamily,
      color: globals.styles.colors.colorBlack,
    },
    inputRightBottomText: {
      fontSize: 10,
      fontWeight: '400',
      fontFamily: globals.fonts.primary.style.fontFamily,
      color: globals.styles.colors.colorBlack,
    },
    textInput: {
      flex: 1,
      fontSize: 20,
      color: globals.styles.colors.colorBlack,
    },
    saveButton: {
      backgroundColor: 'transparent',
      flexDirection: 'column',
      position: 'absolute',
      height: 143,
      zIndex: 18,
      paddingBottom: 30,
      selfAlign: 'stretch',
      alignItems: 'center',
      justifyContent: 'flex-end',
      left: 0,
      right: 0,
      bottom: 0,
    },
    shadowBtn: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    },
  })
