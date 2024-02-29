import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Animated, StyleSheet, ImageBackground, View, Text, Easing, Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { LinearGradient, OverlayBlend } from 'react-native-image-filter-kit'
import LinearGradient2 from 'react-native-linear-gradient'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import * as Animatable from 'react-native-animatable'
import BackgroundTimer from 'react-native-background-timer'
import { Audio } from 'expo-av'
import KeepAwake from 'react-native-keep-awake'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ms } from 'react-native-size-matters/extend'

// Assets
import Countdown from '../../../../../assets/audio/countdown_5.mp3'
import DashedCircle from '../../../../../assets/images/svg/dashed-circle.svg'
import globals from '../../../../config/globals'

// Components
import { SvgUriLocal } from '../../components/SvgUriLocal'
import CircuitCard from '../../components/CircuitCard'
import { ButtonFloating } from '../../../../components/Buttons/ButtonFloating'

// Services
import { resolveLocalUrl } from '../../../../services/helpers'
import AndroidBackHandler from '../../../../components/AndroidBackHandler'

// Hooks
import { useStateSafe } from '../../../../services/hooks/useStateSafe'

const INTERPOLATION_INPUT_RANGE = [0, 140, 190]
const HEADER_CONTAINER_HEIGHT = 280

export const CircuitRest = ({ navigation, route }) => {
  const insets = useSafeAreaInsets()

  const workout = useSelector((state) => state.data.workouts.currentWorkout)
  const currentTrainer = useSelector((state) => state.data.workouts.currentTrainer)
  const currentProgram = useSelector((state) => state.data.workouts.currentProgram)
  const currentCircuit = useSelector((state) => state.data.workouts.progress?.currentCircuit) ?? 0
  const exercise_weight_unit = useSelector((state) => state.data.user.exercise_weight_unit)

  const { primaryColor, secondaryColor } = useMemo(
    () =>
      workout.is_challenge
        ? { primaryColor: currentProgram.color, secondaryColor: currentProgram.color_secondary }
        : { primaryColor: currentTrainer.color, secondaryColor: currentTrainer.secondary_color },
    [workout, currentProgram, currentTrainer],
  )

  // const [exercise] = useState(route.params?.exercise) //todo: currentExercise for cardio in redux
  const [circuits] = useState(route.params?.circuits)

  // const currentCircuit = useSelector((state) => state.data.workouts.progress?.currentCircuit) ?? 0
  // const currentExerciseIndex = useSelector((state) => state.data.workouts.progress?.currentExerciseIndex) ?? 0

  // const circuitIdx = route.params?.circuitIdx
  // const exerciseIdx = route.params?.exerciseIdx ?? 0
  const startValue = route.params?.duration ?? 10

  const [remaining, setRemaining] = useStateSafe(startValue)
  const [sound, setSound] = useState(null)
  const [stopped, setStopped] = useState(false)

  const isCardio = workout.cardio?.length > 0

  const scrollY = useRef(new Animated.Value(0)).current
  const timer1 = useRef(null)
  const scrollView = useRef(null)

  const opacityInterpolation = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: INTERPOLATION_INPUT_RANGE,
        outputRange: [1, 0, 0],
      }),
    [scrollY],
  )

  // moves header up when scrolled
  const headerPositionInterpolation = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: INTERPOLATION_INPUT_RANGE,
        outputRange: [0, -90, -90],
      }),
    [scrollY],
  )
  // shrinks timer when scrolled
  const headerScaleInterpolation = useMemo(
    () =>
      headerPositionInterpolation.interpolate({
        inputRange: [0, 45, 90],
        outputRange: [1, 1.2, 1.3],
      }),
    [headerPositionInterpolation],
  )

  const cardPositionInterpolation = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: INTERPOLATION_INPUT_RANGE,
        outputRange: [ms(340), 200, 200],
      }),
    [scrollY],
  )

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: scrollY,
          },
        },
      },
    ],
    { useNativeDriver: true },
  )

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  useEffect(() => {
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
    const { sound: s } = await Audio.Sound.createAsync(Countdown, { shouldPlay: true }, (status) => {
      status.didJustFinish && s.unloadAsync()
    })
    setSound(s)
    await s.playAsync()
  }

  useEffect(() => {
    if (remaining === 0) {
      BackgroundTimer.stopBackgroundTimer()
      timer1.current?.zoomOut(100).then(() => {
        setRemaining(startValue)
        navigation.navigate(isCardio ? 'Exercise' : 'SingleWorkout')
        // setTimeout(() => {
        //   timer1.current?.zoomIn(100)
        // }, 500)
      })
    }
  }, [isCardio, navigation, remaining, startValue, stopped])

  const onPressSkip = useCallback(() => {
    BackgroundTimer.stopBackgroundTimer()
    setStopped(true)
    timer1.current?.zoomOut(100).then(() => {
      setRemaining(startValue)
      navigation.navigate(isCardio ? 'Exercise' : 'SingleWorkout')
      // setTimeout(() => {
      //   timer1.current?.zoomIn(100)
      // }, 500)
    })
  }, [isCardio, navigation, startValue])

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
      {/* Background images & coloring */}
      <OverlayBlend
        style={StyleSheet.absoluteFill}
        dstImage={<LinearGradient {...gradientProps} />}
        resizeCanvasTo={'dstImage'}
        srcImage={<ImageBackground {...backgroundImageProps} />}
      />

      {/* Timer top section */}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          alignItems: 'center',
          justifyContent: 'flex-start',
          top: insets.top,
          transform: [{ translateY: headerPositionInterpolation }, { scale: headerScaleInterpolation }],
          height: HEADER_CONTAINER_HEIGHT,
        }}>
        {/* Screen title */}
        <Animated.View style={{ marginTop: Platform.OS === 'android' ? 12 : 0, opacity: opacityInterpolation }}>
          {currentProgram.is_challenge ? (
            <Text style={{ fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 25, color: globals.styles.colors.colorWhite }}>
              {workout.challenge_name}
            </Text>
          ) : (
            <SvgUriLocal color={globals.styles.colors.colorWhite} fillAll={true} uri={currentProgram?.logo_small_url} />
          )}
        </Animated.View>
        {/* Dashed circle timer */}
        <Animatable.View ref={timer1} style={[styles.centerTimer, { opacity: 1 }]}>
          <>
            {/* Dashed circle background */}
            <View style={{ position: 'absolute' }}>
              <DashedCircle height={globals.window.width * 0.5} width={globals.window.width * 0.5} />
            </View>
            {/* Solid Progress circle */}
            <AnimatedCircularProgress
              duration={1000}
              easing={Easing.linear}
              width={6}
              fill={100 - ((remaining - 1) / (startValue - 1)) * 100}
              rotation={0}
              size={globals.window.width * 0.5}
              tintColor={globals.styles.colors.colorWhite}
            />
          </>
          {/* Timer */}
          <View style={{ position: 'absolute' }}>
            <Text style={styles.time}>
              {remaining >= 60
                ? `${Math.floor(remaining / 60)
                    .toString()
                    .padStart(1, '0')}:${(Math.round(remaining) % 60).toString().padStart(2, '0')}`
                : Math.max(remaining, 1)}
            </Text>
            <Text style={styles.type}>REST</Text>
          </View>
        </Animatable.View>
      </Animated.View>

      {/* Scrolling card list section */}
      {currentCircuit < circuits?.length - 1 && (
        <Animated.View
          style={{
            zIndex: 10,
            transform: [{ translateY: cardPositionInterpolation }],
            height: globals.window.height - HEADER_CONTAINER_HEIGHT,
            width: '100%',
          }}>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={56}
            ref={scrollView}
            contentContainerStyle={styles.scrollContainer}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            <CircuitCard
              style={{
                paddingHorizontal: 0,
                width: globals.window.width * 0.85,
                marginBottom: circuits[currentCircuit + 1].exercises.length < 2 ? 185 : 56,
              }}
              active={true}
              color={primaryColor}
              unit={exercise_weight_unit}
              title={circuits[currentCircuit + 1].circuitMaster.circuits_title}
              trainer={currentTrainer}
              program={currentProgram}
              exercises={circuits[currentCircuit + 1].exercises}
              repsRounds={circuits[currentCircuit + 1].rounds_or_reps}
            />
          </Animated.ScrollView>
        </Animated.View>
      )}

      {/* Bottom floating button */}
      <LinearGradient2 colors={[primaryColor + '00', primaryColor, primaryColor]} style={styles.lg2container}>
        <ButtonFloating style={styles.skipButton} onPress={onPressSkip} textStyle={{ color: primaryColor }} text="SKIP REST" />
      </LinearGradient2>
    </AndroidBackHandler>
  )
}

const styles = {
  backArrow: { padding: 8, paddingLeft: 16 },
  centerTimer: { ...StyleSheet.absoluteFillObject, top: 60, alignItems: 'center', justifyContent: 'center' },
  time: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 96,
    lineHeight: 96,
    textAlignVertical: 'bottom',
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  type: {
    fontSize: 20,
    height: 27,
    marginTop: -20,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
  scrollContainer: { alignItems: 'center' },
  lg2container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    position: 'absolute',
    height: 123,
    zIndex: 18,
    selfAlign: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    left: 0,
    right: 0,
    bottom: 0,
  },
  skipButton: { backgroundColor: globals.styles.colors.colorWhite, marginBottom: 30 },
}
