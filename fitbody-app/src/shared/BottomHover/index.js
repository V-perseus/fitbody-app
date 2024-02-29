import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const BottomHover = (props) => {
  return (
    <LinearGradient
      colors={props.color ? [`${props.color}00`, `${props.color}ff`] : ['#ffffff00', '#ffffffff']}
      style={styles.hoverContainer}>
      {props.children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  hoverContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: Dimensions.get('window').width,
    zIndex: 10,
  },
})
export default BottomHover
