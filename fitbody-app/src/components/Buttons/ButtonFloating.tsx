import React from 'react'
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import globals from '../../config/globals'

interface IButtonFloatingProps {
  style?: ViewStyle
  textStyle?: TextStyle
  onPress: () => void
  text: string
  gradientColors?: string[]
  pgColor?: string
}
export const ButtonFloating: React.FC<IButtonFloatingProps> = ({ style, textStyle, onPress, text, gradientColors, pgColor, ...rest }) => {
  const shadowColor = pgColor || gradientColors?.[0] || globals.styles.colors.colorGrayDark

  return (
    <Pressable
      style={({ pressed }) => [styles.buttonStyle(pressed, pgColor), { shadowColor }, style]}
      onPress={onPress}
      {...rest}
      testID="button_floating">
      {gradientColors && gradientColors?.length > 1 ? (
        <LinearGradient colors={gradientColors} style={styles.innerButton}>
          <Text style={[styles.textStyle, textStyle]}>{text}</Text>
        </LinearGradient>
      ) : (
        <View style={styles.innerButton}>
          <Text style={[styles.textStyle, textStyle]}>{text}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = {
  buttonStyle: (pressed: boolean, pgColor: string | undefined): ViewStyle => ({
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    marginHorizontal: 24,
    shadowOpacity: pressed ? 0.3 : 0.7,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: pressed ? (pgColor ? 5 : 5) : pgColor ? 5 : 15,
    elevation: pressed ? 4 : 13,
    backgroundColor: globals.styles.colors.colorPink,
  }),
  innerButton: {
    flex: 1,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  textStyle: {
    color: globals.styles.colors.colorWhite,
    fontSize: 16,
    ...globals.styles.fonts.primary.semiboldStyle,
  } as ViewStyle,
}
