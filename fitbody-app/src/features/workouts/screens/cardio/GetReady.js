import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Image, StyleSheet, ImageBackground, View, Text, Dimensions, Pressable, Easing } from 'react-native'
import { useSelector } from 'react-redux'
import { LinearGradient, OverlayBlend } from 'react-native-image-filter-kit'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import * as Animatable from 'react-native-animatable'
import BackgroundTimer from 'react-native-background-timer'
import { Audio } from 'expo-av'
import KeepAwake from 'react-native-keep-awake'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { vs } from 'react-native-size-matters/extend'

// Assets
import Countdown from '../../../../../assets/audio/countdown_5.mp3'
import DashedCircle from '../../../../../assets/images/svg/dashed-circle.svg'

import { SvgUriLocal } from '../../components/SvgUriLocal'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import AndroidBackHandler from '../../../../components/AndroidBackHandler'

import globals from '../../../../config/globals'
import { resolveLocalUrl } from '../../../../services/helpers'
import { useStateSafe } from '../../../../services/hooks/useStateSafe'

const GetReady = (props) => {
  const insets = useSafeAreaInsets()

  const startValue = props.route.params?.duration ?? 10
  const circuitIdx = props.route.params?.circuitIdx
  const exerciseIdx = props.route.params?.exerciseIdx ?? 0

  const categoryId = useSelector((state) => state.data.workouts.currentCategory)
  const workout = useSelector((state) => state.data.workouts.currentWorkout)
  const currentTrainer = useSelector((state) => state.data.workouts.currentTrainer)
  const level_id = useSelector((state) => state.data.user.meta.trainers?.[currentTrainer.id]?.level_id)
  const currentProgram = useSelector((state) => state.data.workouts.currentProgram)
  const specialEquipment = useSelector((state) => state.data.user.resistance_bands)
  const audioEnabled = useSelector((state) => state.data.user.sound_alerts)
  const alternativeExercisesMap = useSelector((state) => state.data.workouts.alternativeExercisesMap) || {}

  const category = useMemo(() => currentProgram.categories?.find((c) => c.id === categoryId), [categoryId, currentProgram])

  const [isRest] = useState(props.route.params?.isRest)
  const [exercise] = useState(props.route.params?.exercise) //todo: currentExercise for cardio in redux
  const [remaining, setRemaining] = useState(startValue)
  const [sound, setSound] = useState(null)
  const [stopped, setStopped] = useStateSafe(false)

  // const currentCircuit = useSelector((state) => state.data.workouts.progress?.currentCircuit) ?? 0
  // const currentExerciseIndex = useSelector((state) => state.data.workouts.progress?.currentExerciseIndex) ?? 0

  const timer1 = useRef(null)
  const timer2 = useRef(null)

  const circuitsByLevel = useMemo(
    () =>
      workout.circuits.filter(
        (c) =>
          (c.special_equipment === specialEquipment ||
            (currentProgram.special_equipment_enabled === false && c.special_equipment === false)) &&
          c.level_id === level_id,
      ),
    [level_id, specialEquipment, workout, currentProgram.special_equipment_enabled],
  )
  const nextExercise = alternativeExercisesMap[circuitIdx]?.[exerciseIdx]
    ? alternativeExercisesMap[circuitIdx]?.[exerciseIdx] ?? circuitsByLevel[circuitIdx]?.exercises?.[exerciseIdx]
    : null

  const isCardio = workout.cardio?.length > 0

  useEffect(() => {
    const stopAndBack = () => {
      BackgroundTimer.stopBackgroundTimer()
      props.navigation.goBack()
    }

    props.navigation.setOptions({
      headerTitle: () => {
        if (currentProgram.is_challenge) {
          return (
            <Text style={{ fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 25, color: globals.styles.colors.colorWhite }}>
              {workout.challenge_name}
            </Text>
          )
        } else {
          return <SvgUriLocal color={globals.styles.colors.colorWhite} fillAll={true} uri={currentProgram?.logo_small_url} />
        }
      },
      headerLeft: () => {
        if (isRest) {
          return <View />
        }
        return <HeaderButton onPress={stopAndBack} iconColor={globals.styles.colors.colorWhite} />
      },
    })
  })

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  useEffect(() => {
    // console.log('i am called on getready')
    BackgroundTimer.runBackgroundTimer(() => {
      setRemaining((c) => {
        if (c - 1 === 3 && !stopped) {
          playSound()
        }
        return c - 1
      })
    }, 1000)

    return () => {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [])

  async function playSound() {
    if (audioEnabled) {
      const { sound: s } = await Audio.Sound.createAsync(Countdown, { shouldPlay: true }, (status) => {
        status.didJustFinish && s.unloadAsync()
      })
      setSound(s)
    }
  }

  const moveOn = useCallback(() => {
    BackgroundTimer.stopBackgroundTimer()
    timer1.current.zoomOut(100)
    timer2.current.zoomOut(100).then(() => {
      setRemaining(startValue)
      setStopped(true)
      if (isCardio) {
        props.navigation.navigate('Exercise', { exercise })
      } else {
        props.navigation.navigate('SingleWorkout', { exercise })
      }
      setTimeout(() => {
        timer1.current?.zoomIn(1)
        timer2.current?.zoomIn(1)
      }, 200)
    })
  }, [exercise, isCardio, props.navigation, startValue])

  useEffect(() => {
    if (remaining === 0) {
      moveOn()
    }
  }, [moveOn, remaining])

  function onPressSkip() {
    moveOn()
  }

  const gradientProps = {
    style: { flex: 1 },
    colors: workout.is_challenge
      ? [currentProgram.color_secondary, currentProgram.color]
      : [currentTrainer.secondary_color, currentTrainer.color],
    start: { y: '100h', x: '0w' },
    end: { x: 0, y: '0h' },
    stops: [0, 1],
  }

  const backgroundImageProps = {
    style: { width: '100%', height: '100%' },
    resizeMode: 'cover',
    resizeMethod: 'resize',
    source: { uri: resolveLocalUrl(currentProgram.background_image_url) },
  }

  return (
    <AndroidBackHandler>
      <KeepAwake />
      <View style={{ flex: 1, backgroundColor: globals.styles.colors.colorWhite }}>
        {/*
            For some unknown reason this is causing a crash if not unrendered
            Issue raised here: https://github.com/iyegoroff/react-native-image-filter-kit/issues/104
        */}
        {!stopped && (
          <OverlayBlend
            style={StyleSheet.absoluteFill}
            dstImage={<LinearGradient {...gradientProps} />}
            resizeCanvasTo={'dstImage'}
            srcImage={<ImageBackground {...backgroundImageProps} />}
            disableCache={true}
          />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {isCardio
              ? workout.cardio.find((c) => c.level_id === level_id).cardioType.name
              : workout.is_challenge
              ? workout.day_title.toUpperCase()
              : category.title.toUpperCase()}
          </Text>
          <Text style={styles.subtitle}>{isCardio ? exercise.name : workout.title}</Text>
        </View>

        <Animatable.View ref={timer1} style={styles.centerTimer}>
          <DashedCircle height={globals.window.width * 0.7} width={globals.window.width * 0.7} />
        </Animatable.View>
        <Animatable.View ref={timer2} style={styles.centerTimer}>
          <AnimatedCircularProgress
            duration={1000}
            easing={Easing.linear}
            width={6}
            fill={100 - ((remaining - 1) / (startValue - 1)) * 100}
            rotation={0}
            size={globals.window.width * 0.7}
            tintColor={globals.styles.colors.colorWhite}>
            {(fill) => (
              <View style={styles.timeContainer}>
                <Text style={styles.time}>
                  {remaining >= 60
                    ? `${Math.floor(remaining / 60)
                        .toString()
                        .padStart(1, '0')}:${(Math.round(remaining) % 60).toString().padStart(2, '0')}`
                    : Math.max(remaining, 1)}
                </Text>
                <Text style={styles.type}>{props.route.params?.text ?? 'GET READY'}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </Animatable.View>

        <View style={[styles.skipContainer, { marginBottom: (nextExercise ? 117 : 32) + insets.bottom }]}>
          <Pressable onPress={onPressSkip} hitSlop={12}>
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        </View>

        {nextExercise && (
          <Animatable.View
            animation="fadeInUp"
            delay={500}
            useNativeDriver={true}
            style={[styles.nextExerciseView, { height: 85 + insets.bottom }]}>
            <View style={styles.nextExerciseTextView}>
              <Text style={styles.nextExerciseNextText}>NEXT</Text>
              <Text style={styles.nextExerciseTitle}>{nextExercise.exercise.title.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Image
                height={85}
                width={85}
                style={styles.nextExerciseImage}
                source={{ uri: resolveLocalUrl(nextExercise.exercise.image_url) }}
              />
            </View>
          </Animatable.View>
        )}
      </View>
    </AndroidBackHandler>
  )
}

const styles = {
  backArrow: { padding: 8, paddingLeft: 16 },
  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    height: Dimensions.get('window').height / 2 - 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 18, color: globals.styles.colors.colorWhite },
  subtitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: vs(45),
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  centerTimer: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  type: {
    fontSize: 25,
    marginTop: -25,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  time: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 120,
    lineHeight: 125,
    textAlignVertical: 'bottom',
    color: globals.styles.colors.colorWhite,
  },
  skipContainer: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'flex-end' },
  skipText: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 18, color: globals.styles.colors.colorWhite },
  nextExerciseView: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: globals.window.width,
    borderWidth: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: globals.styles.colors.colorWhite,
  },
  nextExerciseTextView: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 3,
  },
  nextExerciseNextText: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 12, textAlign: 'right' },
  nextExerciseTitle: { fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 20, textAlign: 'right', marginLeft: 30 },
  nextExerciseImage: { borderWidth: 0, height: 85, width: 85 },
}

export default GetReady
