import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import globals from '../../../../config/globals'

interface ITimerProps {
  display: string
}
const Timer = ({ display }: ITimerProps) => {
  return (
    <View style={styles.timeContainer}>
      <Text style={styles.timer}>{display}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  timer: {
    fontSize: 71,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    lineHeight: 72,
    color: globals.styles.colors.colorBlack,
  },
})

export default React.memo(Timer)
