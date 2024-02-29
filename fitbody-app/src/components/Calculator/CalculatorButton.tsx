import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

import globals from '../../config/globals'

interface ICalculatorButtonProps {
  active: boolean
  handlePress: () => void
  title: string
}
const CalculatorButton: React.FC<ICalculatorButtonProps> = (props) => (
  <TouchableOpacity
    style={[styles.button, props.active ? styles.activeButton : styles.inactiveButton]}
    onPress={props.handlePress}
    testID="calc_btn">
    <Text style={props.active ? styles.activeLabel : styles.inactiveLabel}>{props.title}</Text>
  </TouchableOpacity>
)

export default CalculatorButton

const styles = StyleSheet.create({
  button: {
    // height: 20,
    width: globals.window.width * 0.2,
    borderRadius: 50,
    borderColor: globals.styles.colors.colorGray,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: globals.styles.colors.colorPink,
  },
  inactiveButton: {
    backgroundColor: globals.styles.colors.colorWhite,
    borderColor: globals.styles.colors.colorGrayDark,
    borderWidth: 1,
  },
  activeLabel: {
    fontSize: 10,
    color: globals.styles.colors.colorWhite,
  },
  inactiveLabel: {
    fontSize: 10,
    color: globals.styles.colors.colorGrayDark,
  },
})
