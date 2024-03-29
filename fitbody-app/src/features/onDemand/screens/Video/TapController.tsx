import React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

const hitSlop = { left: 8, bottom: 4, right: 8, top: 4 }

type TapControllerProps = {
  onPress: () => void
  style?: StyleProp<ViewStyle>
  children: JSX.Element
}

export const TapController: React.FC<TapControllerProps> = ({ onPress, style, children }) => {
  const gesture = Gesture.Tap().onEnd((_e, success) => {
    if (success) {
      onPress()
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View hitSlop={hitSlop} style={style}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
