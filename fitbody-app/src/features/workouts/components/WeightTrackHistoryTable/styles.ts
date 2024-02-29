import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'
export const createStyles = (bgColor: string | undefined) =>
  StyleSheet.create({
    container: {},
    tableHeader: {
      backgroundColor: `${bgColor}40`,
    },
    headerText: {
      fontFamily: globals.styles.fonts.primary.semiboldStyle.fontFamily,
      color: globals.styles.colors.colorBlack,
      fontWeight: '600',
      lineHeight: 24,
      fontSize: 16,
    },
    textWrapper: {
      paddingHorizontal: 16,
      paddingVertical: 4,
      flex: 1,
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flex: 3,
    },
    tableText: {
      fontSize: 16,
      fontFamily: globals.styles.fonts.primary.style.fontFamily,
      lineHeight: 24,
    },
  })
