import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataWrapper: {
    paddingHorizontal: 22,
    marginTop: 16,
    backgroundColor: '#fff',
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  calendarIcon: {
    paddingRight: 16,
  },
  dateText: {
    fontSize: 20,
    fontFamily: globals.styles.fonts.primary.style.fontFamily,
    color: globals.styles.colors.colorBlack,
    fontWeight: '700',
  },
})
