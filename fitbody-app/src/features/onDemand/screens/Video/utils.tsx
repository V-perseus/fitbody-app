import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'
import React from 'react'
import globals from '../../../../config/globals'
import { ms } from 'react-native-size-matters/extend'

export const ErrorMessage = ({ message, style }: { message: string; style: TextStyle }) => (
  <View style={styles.errorWrapper}>
    <Text style={style}>{message}</Text>
  </View>
)

export const getMinutesSecondsFromMilliseconds = (ms: number) => {
  const totalSeconds = ms / 1000
  const seconds = String(Math.floor(totalSeconds % 60))
  const minutes = String(Math.floor(totalSeconds / 60))

  return minutes.padStart(1, '0') + ':' + seconds.padStart(2, '0')
}

export const { width, height, scale, fontScale } = Dimensions.get('window')

export function roundUp(number: number, near: number) {
  if (number % near === 0) {
    return number
  }
  return (number / near) * near + near
}

type ButtonProps = (TouchableNativeFeedbackProps | TouchableOpacityProps) & {
  children: React.ReactNode
}
export const TouchableButton = (props: ButtonProps) =>
  Platform.OS === 'android' ? (
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('white', true)} {...props} />
  ) : (
    <TouchableOpacity {...props} />
  )

// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6#gistcomment-3585151
export const deepMerge = (target: { [x: string]: any }, source: { [x: string]: any }) => {
  const result = { ...target, ...source }
  const keys = Object.keys(result)

  for (const key of keys) {
    const tprop = target[key]
    const sprop = source[key]
    if (typeof tprop === 'object' && typeof sprop === 'object') {
      result[key] = deepMerge(tprop, sprop)
    }
  }

  return result
}

/**
 * Format a time string as mm:ss
 *
 * @param {int} time time in milliseconds
 * @return {string} formatted time string in mm:ss format
 */
export const formatTime = ({ time = 0, symbol = '', duration = 0, showHours = false }) => {
  time = Math.min(Math.max(time, 0), duration)

  if (!showHours) {
    const formattedMinutes = Math.floor(time / 60)
      .toFixed(0)
      .padStart(2, '0')
    const formattedSeconds = Math.floor(time % 60)
      .toFixed(0)
      .padStart(2, '0')

    return `${symbol}${formattedMinutes}:${formattedSeconds}`
  }

  const formattedHours = Math.floor(time / 3600)
    .toFixed(0)
    .padStart(2, '0')
  const formattedMinutes = (Math.floor(time / 60) % 60).toFixed(0).padStart(2, '0')
  const formattedSeconds = Math.floor(time % 60)
    .toFixed(0)
    .padStart(2, '0')

  return `${symbol}${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export const secondToTime = (seconds: number): string => {
  const hour = Math.floor(seconds / 3600)
  const residualFromHour = seconds % 3600
  const minute = `${Math.floor(residualFromHour / 60)}`.padStart(2, '0')
  const second = `${Math.floor(residualFromHour % 60)}`.padStart(2, '0')
  let output = `${minute}:${second}`
  hour && (output = `${hour}:${output}`)
  return output
}

/**
 * Format a time string as mm:ss
 *
 * @param {int} time time in milliseconds
 * @return {string} formatted time string in mm:ss format
 */
export const formatTimeToMins = (duration: number) => {
  const formattedMinutes = (Math.floor(duration / 60) % 60).toFixed(0).padStart(2, '0')
  const formattedSeconds = Math.floor(duration % 60)
    .toFixed(0)
    .padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

export const styles = StyleSheet.create({
  errorWrapper: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  controlView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
    justifyContent: 'center',
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  iconWrapper: {
    borderRadius: 100,
    overflow: 'hidden',
    padding: 10,
  },
  bottomInfoWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    bottom: 36,
    left: 24,
    right: 24,
    zIndex: 999,
  },
  topInfoWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 12,
  },
  timeLeft: { backgroundColor: 'transparent', textAlign: 'center', width: 50 },
  timeRight: { backgroundColor: 'transparent', textAlign: 'center', width: 50 },
  slider: { flex: 1, paddingHorizontal: 10 },
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
  toolbar: {
    flex: 1,
    width: '100%',
    marginTop: 36,
  },
  toolbarInner: {
    flexDirection: 'row',
    flex: 1,
    height: 30,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  videoName: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: ms(28),
  },
  toolbarRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
