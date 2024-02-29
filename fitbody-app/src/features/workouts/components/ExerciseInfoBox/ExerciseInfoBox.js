import React, { useCallback, useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { useTimer } from 'react-use-precision-timer'
import { Audio } from 'expo-av'
import BackgroundTimer from 'react-native-background-timer'
import { vs } from 'react-native-size-matters/extend'
import { useNavigation } from '@react-navigation/native'

import globals from '../../../../config/globals'

// Assets
import Close from '../../../../../assets/images/svg/icon/16px/close.svg'
import ResetIcon from '../../../../../assets/images/svg/icon/32px/circle/back.svg'
import PlusWhiteIcon from '../../../../../assets/images/svg/icon/12px/plus_white.svg'
import NextMove from '../../../../../assets/audio/next_move.mp4'
import SwitchSides from '../../../../../assets/audio/switch_sides.mp4'

const ExerciseInfoBox = (props) => {
  const { showTimer, exercise, isPaused, program, unit } = props
  const navigation = useNavigation()
  const audioEnabled = useSelector((state) => state.data.user.sound_alerts)

  const [sound, setSound] = useState(null)

  const timer = useTimer({
    delay: 500,
    startImmediately: showTimer && exercise.secondary_timer ? true : false,
  })

  // refs are used to hold audio cue timers
  const cueEnd = useRef(null)
  const cueHalfway = useRef(null)

  const triggerSeconds = (exercise.duration - 1) * 1000 // this amounts to an n second offset to acount for length of audio track

  const timeDisplay = `${Math.floor(timer.getElapsedRunningTime() / 1000 / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor((timer.getElapsedRunningTime() / 1000) % 60)
    .toString()
    .padStart(2, '0')}`

  function Timer(callback, delay) {
    let timerId,
      start,
      remaining = delay

    this.pause = function () {
      BackgroundTimer.clearTimeout(timerId)
      remaining -= new Date() - start
    }

    this.resume = function () {
      start = new Date()
      timerId && BackgroundTimer.clearTimeout(timerId)
      if (remaining > 0) {
        timerId = BackgroundTimer.setTimeout(callback, remaining)
      }
    }

    this.reset = function (newDelay) {
      timerId && BackgroundTimer.clearTimeout(timerId)
      timerId = BackgroundTimer.setTimeout(callback, newDelay)
    }

    this.stop = function () {
      BackgroundTimer.clearTimeout(timerId)
    }

    this.resume()
  }

  useFocusEffect(
    useCallback(() => {
      if (showTimer && audioEnabled && exercise.audio_alerts && exercise.duration > 0) {
        cueEnd.current = new Timer(() => {
          playSound(NextMove)
        }, triggerSeconds)
        if (exercise.if_each_side) {
          cueHalfway.current = new Timer(() => {
            playSound(SwitchSides)
          }, triggerSeconds / 2)
        }
      }
      return () => {
        // Cancel all audio timers
        cueEnd.current?.stop()
        cueHalfway.current?.stop()
        cueEnd.current = null
        cueHalfway.current = null
      }
    }, [exercise, showTimer, audioEnabled]),
  )

  useEffect(() => {
    if (showTimer && exercise.secondary_timer) {
      // console.log('starting timer?', props)
      timer.start()
    }
  }, [exercise])

  useEffect(() => {
    if (isPaused) {
      timer.pause()
      cueEnd.current?.pause()
      cueHalfway.current?.pause()
    } else if (showTimer && exercise.secondary_timer && timer.isPaused()) {
      timer.resume()
      cueEnd.current?.resume()
      cueHalfway.current?.resume()
    }
  }, [isPaused])

  useEffect(() => {
    return sound
      ? () => {
          // console.log('Unloading Sound')
          sound.unloadAsync()
        }
      : undefined
  }, [sound, exercise])

  function resetTimer() {
    if (isPaused) {
      return
    }
    cueEnd.current?.reset(triggerSeconds)
    cueHalfway.current?.reset(triggerSeconds / 2)
    timer.start()
  }

  async function playSound(fileRef) {
    const { sound: s } = await Audio.Sound.createAsync(fileRef, { shouldPlay: true }, (status) => {
      status.didJustFinish && s.unloadAsync()
    })
    setSound(s)
  }

  const navToWeightTrack = () => {
    navigation.navigate('WeightTracker', {
      title: exercise?.exercise?.title,
      primaryColor: program?.color,
      secondaryColor: program?.color_secondary,
      unit,
    })
  }

  return (
    <View style={styles.container(props.borderColor)}>
      <View style={styles.rowCentered}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: !exercise.weight && exercise.exercise.equipment.length == 0 ? 'center' : 'flex-end',
          }}>
          <Text
            style={{
              fontFamily: globals.fonts.secondary.style.fontFamily,
              color: props.program.is_challenge ? globals.styles.colors.colorPink : props.trainer.color,
              fontSize: 25,
            }}>
            {/* {((props.exercise.duration || "").toLowerCase().replace('each side', '') || "").trim().toUpperCase()} */}
            {exercise.reps
              ? exercise.reps.toString().replace('each side', '').trim().toUpperCase()
              : exercise.duration.toString().replace('each side', '').trim().toUpperCase()}
          </Text>
          {exercise.reps?.toString().includes('each side') ? <Text style={styles.sideText}> EACH SIDE </Text> : null}
        </View>
        {exercise.weight ? <Close style={styles.close} color={globals.styles.colors.colorBlackDark} /> : null}
        <View style={styles.rowCentered}>
          <View style={styles.weightView}>
            {exercise.weight ? (
              <Text
                style={{
                  fontFamily: globals.fonts.secondary.style.fontFamily,
                  fontSize: 25,
                  color: globals.styles.colors.colorBlack,
                  marginBottom: exercise.exercise.equipment.length > 0 ? -5 : 0,
                }}>
                {props.unit === 'kg' && exercise.weight_kg ? exercise.weight_kg.toUpperCase() : exercise.weight.toUpperCase()}
              </Text>
            ) : null}
            {exercise.exercise.equipment.map((eq, index) => (
              <Text key={`0x${index}`} style={styles.weightText}>{`${eq.adds_to_weight ? '+ ' : ''}${eq.name.toUpperCase()}`}</Text>
            ))}
          </View>
          <View>
            <TouchableOpacity
              style={[styles.leftMargin, styles.addBtn(props.program.is_challenge ? globals.styles.colors.colorPink : props.trainer.color)]}
              onPress={navToWeightTrack}>
              <PlusWhiteIcon height={11.2} width={11.2} color={globals.styles.colors.colorBlack} style={styles.resetIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {showTimer && exercise.secondary_timer && (
        <View style={styles.timerView}>
          <Text style={styles.timeDisplay}>{timeDisplay}</Text>
          <TouchableOpacity style={styles.leftMargin} onPress={resetTimer}>
            <ResetIcon height={30} width={30} color={globals.styles.colors.colorBlack} style={styles.resetIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: (borderColor) => ({
    borderRadius: 7.8,
    minHeight: vs(65),
    paddingTop: 11,
    paddingBottom: 11,
    borderWidth: 2,
    borderColor: borderColor || globals.styles.colors.colorGray,
    alignSelf: 'stretch',
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }),
  rowCentered: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sideText: {
    color: globals.styles.colors.colorGrayDark,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 12,
    marginTop: -5,
  },
  close: { marginLeft: 8 },
  weightView: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 9,
    color: globals.styles.colors.colorGrayDark,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 12,
  },
  weightText: { color: globals.styles.colors.colorGrayDark, fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12 },
  timerView: {
    borderTopWidth: 2,
    borderColor: globals.styles.colors.colorGrayDark,
    alignSelf: 'stretch',
    marginHorizontal: 24,
    marginTop: 5,
    paddingTop: 5,
    marginBottom: -5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  timeDisplay: { fontSize: 40, fontFamily: globals.fonts.secondary.style.fontFamily, color: globals.styles.colors.colorBlack },
  leftMargin: { marginLeft: 14 },
  resetIcon: { marginBottom: 2 },
  addBtn: (bgColor) => ({
    width: 32,
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 8, //Note: Avoid using padding to create the circle shape as the width and height of the icon do not match
    backgroundColor: bgColor,
    borderRadius: 32,
  }),
})

export default ExerciseInfoBox
