import React from 'react'
import { Pressable, StyleSheet, ViewStyle } from 'react-native'

interface IButtonOpacityProps {
  style?: ViewStyle
  children: React.ReactNode
  onPress: () => void
  useOpacity?: boolean
  pressedOpacity?: number
  testID?: string
}
export const ButtonOpacity: React.FC<IButtonOpacityProps> = ({
  style,
  children,
  onPress,
  useOpacity = true,
  pressedOpacity = 0.5,
  ...rest
}) => {
  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed && useOpacity ? pressedOpacity : 1 }, styles.buttonStyle, style]}
      onPress={onPress}
      hitSlop={16}
      {...rest}>
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
