import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'
import { scale } from 'react-native-size-matters/extend'
import LinearGradient from 'react-native-linear-gradient'

import ChevronUp from '../../../assets/images/svg/icon/16px/cheveron/up.svg'
import ChevronDown from '../../../assets/images/svg/icon/16px/close.svg'
import globals from '../../config/globals'

interface IBottomUpPanelProps {
  isOpen: boolean
  startHeight?: number
  topEnd: number
  content: () => ReactNode
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  customHeader?: () => ReactNode
  header?: () => ReactNode
  onAnimationStart?: (val: boolean) => void
  onAnimationComplete?: (val: boolean) => void
  showHorizontalScrollIndicator?: boolean
  showVerticalScrollIndicator?: boolean
  disabled?: boolean
  fadeScrollContent?: boolean
  bounces?: boolean
}
export const BottomUpPanel = ({
  isOpen = true,
  startHeight = 25,
  topEnd,
  content,
  customHeader = undefined,
  containerStyle = {},
  contentContainerStyle = {},
  header = undefined,
  onAnimationStart = () => {},
  onAnimationComplete = () => {},
  showHorizontalScrollIndicator = false,
  showVerticalScrollIndicator = false,
  disabled = false,
  fadeScrollContent = false,
  bounces = false,
}: IBottomUpPanelProps) => {
  const [open, setOpen] = useState(isOpen)

  const scrollViewRef = useRef<null | ScrollView>(null)

  const config = {
    position: {
      max: globals.window.height,
      start: globals.window.height - startHeight,
      end: topEnd,
    },
  }

  const animatedPosition = useRef(new Animated.Value(isOpen ? config.position.end : config.position.start)).current

  useEffect(() => {
    if (open && !disabled) {
      openPanel()
    } else {
      closePanel()
    }
  }, [open, disabled])

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const openPanel = () => {
    onAnimationStart(true)
    Animated.timing(animatedPosition, {
      toValue: config.position.end,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      onAnimationComplete(true)
    })
  }

  const closePanel = () => {
    onAnimationStart(false)
    scrollViewRef.current?.scrollTo({ y: 0 })
    Animated.timing(animatedPosition, {
      toValue: config.position.start,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      onAnimationComplete(false)
    })
  }

  function toggle() {
    setOpen(!open)
  }

  return (
    <View style={[styles.wrapper, containerStyle]} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.content,
          {
            paddingBottom: topEnd,
            transform: [{ translateY: animatedPosition }, { translateX: 0 }],
          },
        ]}>
        {/*Section for header or button to open the panel*/}
        {header ? (
          <Pressable onPress={toggle} hitSlop={12}>
            <View style={{ height: startHeight - 117, alignItems: 'center' }}>
              <View style={styles.toggleWrapper}>
                <View style={styles.toggleCircle}>
                  {open ? (
                    <ChevronDown color={globals.styles.colors.colorGrayDark} />
                  ) : (
                    <ChevronUp color={globals.styles.colors.colorGrayDark} />
                  )}
                </View>
              </View>
              {header()}
            </View>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={toggle} hitSlop={18}>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleHandle} />
                {customHeader ? customHeader() : null}
              </View>
            </Pressable>
          </>
        )}
        <View style={contentContainerStyle}>
          <ScrollView
            ref={scrollViewRef}
            scrollEnabled={open}
            showsHorizontalScrollIndicator={showHorizontalScrollIndicator}
            showsVerticalScrollIndicator={showVerticalScrollIndicator}
            scrollEventThrottle={16}
            indicatorStyle="black"
            contentContainerStyle={{ flexGrow: 1, backgroundColor: globals.styles.colors.colorWhite }}
            bounces={bounces}>
            {content()}
          </ScrollView>
          {fadeScrollContent && (
            <>
              <LinearGradient
                style={styles.gradientBottom}
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                pointerEvents={'none'}
              />
              <LinearGradient
                style={styles.gradientTop}
                colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
                pointerEvents={'none'}
              />
            </>
          )}
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // top: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    height: globals.window.height,
    paddingBottom: 0,
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: globals.window.width,
    backgroundColor: globals.styles.colors.colorWhite,
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    shadowOffset: { width: 0, height: 0 },
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOpacity: 0.17,
    shadowRadius: 10,
    elevation: 7,
  },
  toggleHandle: {
    width: 32,
    height: 5,
    marginVertical: 10,
    borderRadius: 2.5,
    backgroundColor: globals.styles.colors.colorGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleWrapper: {
    width: 48,
    height: 48,
    marginBottom: -24,
    borderRadius: 24,
    backgroundColor: 'white',
    zIndex: 10,
    elevation: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 35,
    height: 35,
    borderWidth: 1.7,
    borderRadius: 17.5,
    borderColor: globals.styles.colors.colorGrayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainerStyle: {
    position: 'relative',
    flex: 1,
  },
  gradientBottom: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 10,
    bottom: 0,
    width: globals.window.width,
    height: 10,
  },
  gradientTop: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 10,
    top: 0,
    width: globals.window.width,
    height: 10,
  },
})
