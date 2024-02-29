import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import RNSlider from '@react-native-community/slider'

import { PLAYER_STATES } from './playerStates'
import { formatVideoDuration } from '../../helpers'

import globals from '../../../../config/globals'
import FullscreenIcon from '../../../../../assets/images/svg/icon/24px/fullscreen.svg'
import ExitFullscreenIcon from '../../../../../assets/images/svg/icon/24px/exit-fullscreen.svg'

interface ISliderProps {
  duration: number
  onFullScreen: () => void
  onSeekStart: () => void
  onPause: () => void
  onSeekEnd: (value: number) => void
  onSeeking: (value: number) => void
  playerState: number
  isFullScreen: boolean
  progress: number
}
export const Slider = (props: ISliderProps) => {
  const { duration, onFullScreen, onSeekStart, onPause, progress, onSeekEnd, onSeeking, playerState, isFullScreen } = props

  function onSlideStart() {
    onSeekStart()
    if (playerState !== PLAYER_STATES.PAUSED) {
      onPause()
    }
  }

  function dragging(value: number) {
    onSeeking(value)
  }

  function seekVideoEnd(value: number) {
    onSeekEnd(value)
  }

  return (
    <View style={styles.controlsRow}>
      <View style={styles.progressColumnContainer}>
        <View style={styles.controlsTop}>
          <View style={styles.timerLabelsContainer}>
            <Text style={styles.timerLabel}>{formatVideoDuration(progress)}/</Text>
            <Text style={styles.timerLabel}>{formatVideoDuration(duration)}</Text>
          </View>
          <Pressable style={styles.fullScreenButton} onPress={onFullScreen} hitSlop={8}>
            {isFullScreen ? (
              <ExitFullscreenIcon color={globals.styles.colors.colorWhite} height={24} width={24} />
            ) : (
              <FullscreenIcon color={globals.styles.colors.colorWhite} height={24} width={24} />
            )}
          </Pressable>
        </View>
        <RNSlider
          style={styles.progressSlider}
          onValueChange={dragging}
          onSlidingStart={onSlideStart}
          onSlidingComplete={seekVideoEnd}
          maximumValue={Math.floor(duration)}
          // tapToSeek={true} // not working properly
          // value={Math.floor(progress)}
          value={progress}
          thumbTintColor={globals.styles.colors.colorWhite}
          minimumTrackTintColor={globals.styles.colors.colorWhite}
          maximumTrackTintColor={globals.styles.colors.colorGrayDark}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  controlsRow: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'flex-end',
  },
  progressColumnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controlsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  timerLabelsContainer: {
    flexDirection: 'row',
  },
  fullScreenButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  progressSlider: {
    alignSelf: 'stretch',
  },
  timerLabel: {
    color: globals.styles.colors.colorWhite,
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
})
