import React, { useState, useEffect } from 'react'
import { View, Animated, StyleSheet, Text, ViewStyle, Pressable } from 'react-native'
import { CastButton } from 'react-native-google-cast'

import { PLAYER_STATES } from './playerStates'
import { Controls } from './Controls'
import { Slider } from './Slider'
import { Toolbar } from './Toolbar'
import { ButtonRound } from '../../../../components/Buttons/ButtonRound'

import { VIDEO_CATEGORIES } from '../../helpers'
import globals from '../../../../config/globals'

interface IControlsOverlayProps {
  children: React.ReactNode
  containerStyle?: ViewStyle
  duration: number
  fadeOutDelay?: number
  onReplay: () => void
  onSeekStart: () => void
  onSeekEnd: (value: number) => void
  onSeeking: (value: number) => void
  seekBack: () => void
  seekForward: () => void
  onFullScreen: () => void
  isFullScreen: boolean
  playerState: number
  progress: number
  showOnStart?: boolean
  onPaused: (value: number) => void
  hasCompleted: boolean
  type: string
  onClose: () => void
  toolbarStyle?: ViewStyle
}
export const ControlsOverlay = ({
  children,
  containerStyle: customContainerStyle = {},
  duration,
  fadeOutDelay = 5000,
  onReplay: onReplayCallback,
  onSeekStart,
  onSeekEnd,
  onSeeking,
  seekBack,
  seekForward,
  onFullScreen,
  isFullScreen,
  playerState,
  progress,
  showOnStart = true,
  onPaused,
  hasCompleted,
  type,
  onClose,
  toolbarStyle: customToolbarStyle = {},
}: IControlsOverlayProps) => {
  const [opacity] = useState(new Animated.Value(showOnStart ? 1 : 0))
  const [isVisible, setIsVisible] = useState(showOnStart ? true : false)

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

  useEffect(() => {
    fadeOutControls(fadeOutDelay)
  }, [])

  useEffect(() => {
    if (playerState === PLAYER_STATES.ENDED) {
      fadeInControls(false)
    }
  }, [playerState])

  const fadeOutControls = (delay = 0) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      delay,
      useNativeDriver: false, // these need to be false in order to use stopAnimation
    }).start((result) => {
      /* Noticed that sometimes the callback is called twice, when it is invoked and when it completely finished
      This prevents some flickering */
      if (result.finished) {
        setIsVisible(false)
      }
    })
  }

  const fadeInControls = (loop = true) => {
    setIsVisible(true)
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: 0,
      useNativeDriver: false, // these need to be false in order to use stopAnimation
    }).start(() => {
      if (loop) {
        fadeOutControls(fadeOutDelay)
      }
    })
  }

  function onReplay() {
    fadeOutControls(fadeOutDelay)
    onReplayCallback()
  }

  const cancelAnimation = () => opacity.stopAnimation(() => setIsVisible(true))

  function onPause() {
    const { PLAYING, PAUSED, ENDED } = PLAYER_STATES
    switch (playerState) {
      case PLAYING: {
        cancelAnimation()
        break
      }
      case PAUSED: {
        fadeOutControls(fadeOutDelay / 2)
        break
      }
      case ENDED:
        break
    }

    const newPlayerState = playerState === PLAYING ? PAUSED : PLAYING
    return onPaused(newPlayerState)
  }

  function handleSeekEnd(time: number) {
    fadeOutControls(fadeOutDelay / 2)
    onSeekEnd(time)
  }

  function toggleControls() {
    // value is the last value of the animation when stop animation was called.
    // As this is an opacity effect, the value (0 or 1) is used as a boolean
    opacity.stopAnimation((value) => {
      // TODO account for stopping animation while it is in progress. Maybe if value > 0 && < 1 then fade controls back in or explicity set opacity value to 1
      setIsVisible(!!value)
      return value ? fadeOutControls() : fadeInControls()
    })
  }

  return (
    <>
      <AnimatedPressable style={[styles.container, { opacity }]} onPress={toggleControls}>
        {isVisible && (
          <View style={[styles.container, customContainerStyle]}>
            <View style={[styles.controlsRow, customToolbarStyle]}>{children}</View>
            {hasCompleted && type === VIDEO_CATEGORIES.ON_DEMAND ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.classComplete}>CLASS COMPLETED</Text>
                <Text style={styles.classCompleteSubtext}>This class has been added to your Fit Body calendar.</Text>
                <ButtonRound style={styles.closeButton} onPress={onClose} text="CLOSE" textStyle={styles.closeButtonText} />
              </View>
            ) : (
              <Controls onPause={onPause} onReplay={onReplay} playerState={playerState} seekBack={seekBack} seekForward={seekForward} />
            )}
            <Slider
              progress={progress}
              duration={duration}
              playerState={playerState}
              onFullScreen={onFullScreen}
              onSeekStart={onSeekStart}
              onSeekEnd={handleSeekEnd}
              onSeeking={onSeeking}
              onPause={onPause}
              isFullScreen={isFullScreen}
            />
          </View>
        )}
      </AnimatedPressable>
      {/*
        This is a bit of a hack because on certain android devices (Pixels 3,4,6 at least) the
        CastButton press handler gets swallowed if it's a child of another pressable component.
      */}
      {isVisible && (
        <Animated.View style={[styles.castButtonContainer, { opacity }]}>
          <CastButton style={styles.castButton} />
        </Animated.View>
      )}
    </>
  )
}

ControlsOverlay.Toolbar = Toolbar

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(45, 59, 62, 0.4)',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingVertical: 23,
    borderRadius: 7,
    zIndex: 10,
  },
  controlsRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  classComplete: {
    color: globals.styles.colors.colorWhite,
    fontSize: 45,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  classCompleteSubtext: {
    color: globals.styles.colors.colorWhite,
    fontSize: 20,
    fontFamily: globals.fonts.primary.style.fontFamily,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 18,
    height: 56,
    width: 98,
    backgroundColor: globals.styles.colors.colorWhite,
    color: globals.styles.colors.colorBlack,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: globals.styles.colors.colorBlack,
  },
  castButtonContainer: {
    position: 'absolute',
    zIndex: 20,
    top: 24,
    right: 84,
  },
  castButton: {
    tintColor: globals.styles.colors.colorWhite,
    height: 28,
    width: 28,
  },
})
