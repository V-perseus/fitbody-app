import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import BackArrowIcon from '../../../assets/images/svg/icon/24px/arrow-left.svg'
import globals from '../../config/globals'

interface IHeaderButtonProps {
  style?: StyleProp<ViewStyle>
  iconColor?: string
  onPress: () => void
  pressedOpacity?: number
  pressColor?: string
  children?: React.ReactNode
}
export const HeaderButton = ({
  style,
  iconColor = globals.styles.colors.colorBlack,
  onPress,
  pressedOpacity = 0.7,
  pressColor = 'rgba(0, 0, 0, 0.05)',
  children,
  ...rest
}: IHeaderButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        { backgroundColor: pressed ? pressColor : 'transparent', opacity: pressed ? pressedOpacity : 1 },
        styles.buttonStyle,
        style,
      ]}
      hitSlop={16}
      onPress={onPress}
      {...rest}>
      {children ? children : <BackArrowIcon color={iconColor} testID="back_arrow"/>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    display: 'flex',
    width: 42,
    height: 42,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
  },
})
