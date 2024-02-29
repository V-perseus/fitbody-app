import React from 'react'
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import globals from '../../config/globals'

interface IButtonIconProps {
  style?: ViewStyle
  textStyle?: TextStyle
  onPress: (() => void) | null
  text: string
  useOpacity?: boolean
  pressedOpacity?: number
  rightIcon?: () => JSX.Element
  leftIcon?: () => JSX.Element
}
export const ButtonIcon: React.FC<IButtonIconProps> = ({
  style,
  textStyle,
  onPress,
  text,
  useOpacity = true,
  pressedOpacity = 0.7,
  rightIcon = null,
  leftIcon = null,
  ...rest
}) => {
  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed && useOpacity ? pressedOpacity : 1 }, styles.buttonStyle, style]}
      onPress={onPress}
      {...rest}>
      {leftIcon && leftIcon()}
      <Text style={[styles.textStyle, textStyle]}>{text}</Text>
      {rightIcon && rightIcon()}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    width: 114,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
  },
})
