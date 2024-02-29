import React from 'react'
import { Pressable, ViewStyle, Text, StyleSheet, TextStyle } from 'react-native'
import globals from '../../config/globals'

interface IButtonRoundProps {
  style?: ViewStyle
  textStyle?: TextStyle
  onPress: () => void
  text: string
  icon?: React.ReactNode
  useOpacity?: boolean
  pressedOpacity?: number
}
export const ButtonRound: React.FC<IButtonRoundProps> = ({
  style,
  textStyle,
  onPress,
  text,
  icon,
  useOpacity = true,
  pressedOpacity = 0.7,
  ...rest
}) => {
  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed && useOpacity ? pressedOpacity : 1 }, styles.buttonStyle, style]}
      onPress={onPress}
      {...rest}>
      {icon}
      <Text style={[styles.textStyle, textStyle]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    flexDirection: 'row',
    items: 'center',
    width: 114,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
  },
})
