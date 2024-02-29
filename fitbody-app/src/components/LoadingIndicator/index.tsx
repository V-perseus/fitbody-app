import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

import LoadingGif from '../../../assets/gif/loading.gif'
import globals from '../../config/globals'
import { useAppSelector } from '../../store/hooks'

const LoadingIndicator = () => {
  const isLoading = useAppSelector((state) => state.services.loading.isVisible)

  return isLoading ? (
    <View style={styles.container}>
      <Image source={LoadingGif} style={styles.gifSize} resizeMode="contain" />
    </View>
  ) : null
}

const styles = StyleSheet.create({
  container: {
    width: globals.window.width,
    height: globals.window.height,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gifSize: {
    height: 100,
  },
})

export default LoadingIndicator
