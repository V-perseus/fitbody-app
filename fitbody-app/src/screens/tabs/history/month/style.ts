import { StyleSheet } from 'react-native'
import globals from '../../../../config/globals'

const styles = StyleSheet.create({
  backgroundImage: {
    width: globals.window.width,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  daysScroll: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: 18,
    marginBottom: 18,
  },
})

export default styles
