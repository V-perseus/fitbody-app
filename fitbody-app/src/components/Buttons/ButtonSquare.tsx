import React from 'react'
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native'
import globals from '../../config/globals'

interface IButtonSquareProps {
  style?: ViewStyle
  textStyle?: TextStyle
  onPress: () => void
  text: string
  useOpacity?: boolean
  pressedOpacity?: number
  loading?: boolean
  testID?: string
}
export const ButtonSquare: React.FC<IButtonSquareProps> = ({
  style,
  textStyle,
  onPress,
  text,
  useOpacity = true,
  pressedOpacity = 0.7,
  loading = false,
  ...rest
}) => {
  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed && useOpacity ? pressedOpacity : 1 }, styles.buttonStyle, style]}
      onPress={onPress}
      {...rest}>
      {loading ? (
        <ActivityIndicator size="small" color={globals.styles.colors.colorWhite} />
      ) : (
        <Text style={[styles.textStyle, textStyle]}>{text}</Text>
      )}
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
