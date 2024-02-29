import React, { useState } from 'react'
import { ActivityIndicator, Image, ImageStyle, View, ViewProps } from 'react-native'

interface ILoadableImageProps {
  containerStyle?: ViewProps
  style?: ImageStyle
  src: string
}
export const LoadableImage: React.FC<ILoadableImageProps> = ({ containerStyle, style, src, ...rest }) => {
  const [loading, setLoading] = useState(true)

  return (
    <View style={containerStyle}>
      <Image source={{ uri: src }} onLoad={() => setLoading(true)} style={[style, { display: loading ? 'none' : 'flex' }]} {...rest} />
      <ActivityIndicator style={{ display: loading ? 'flex' : 'none' }} />
    </View>
  )
}
