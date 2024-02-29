import React, { forwardRef } from 'react'
import { View, StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient'

import globals from '../../../../config/globals'

export const BottomPanel = forwardRef((props, ref) => {
  const { children, immediate = false, gradientColors, zIndex = 12, height = 112, duration = 300 } = props

  const blankAnim = {
    from: {
      translateY: height,
    },
    to: {
      translateY: height,
    },
  }

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, { zIndex: zIndex, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 0 }]}>
      <Animatable.View
        pointerEvents="box-none"
        ref={ref}
        useNativeDriver={true}
        animation={immediate ? 'slideInUp' : blankAnim}
        duration={duration}
        style={{
          shadowColor: globals.styles.colors.colorBlackDark,
          shadowOffset: {
            width: 0,
            height: 0, // pressed ? 2 : 7,
          },
          shadowOpacity: 0.3,
          shadowRadius: 6.27,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: globals.styles.colors.colorWhite,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: height,
        }}>
        <LinearGradient style={styles.gradient} colors={gradientColors}>
          {children}
        </LinearGradient>
      </Animatable.View>
    </View>
  )
})

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
})
