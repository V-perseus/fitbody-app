/* eslint-disable no-undef */
// Allows for adding props like 'testID' to svg components
declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  import { ViewStyle } from 'react-native'
  interface CustomSvgProps extends SvgProps {
    testID?: string
    style?: ViewStyle | ViewStyle[]
    color?: string
  }

  const content: React.FC<CustomSvgProps>
  export default content
}

declare module '*.gif'

declare module '*.jpg' {
  import { ImageSourcePropType } from 'react-native'
  const value: ImageSourcePropType
  export default value
}

declare module '*.png' {
  import { ImageSourcePropType } from 'react-native'
  const value: ImageSourcePropType
  export default value
}

// For react-native-reanimated-carousel
declare namespace global {
  function __reanimatedWorkletInit(): void
}
