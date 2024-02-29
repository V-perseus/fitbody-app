import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { View, Text, ImageBackground, Animated, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import LinearGradient2 from 'react-native-linear-gradient'
import { OverlayBlend, LinearGradient } from 'react-native-image-filter-kit'

// Components
import { SvgUriLocal } from '../../components/SvgUriLocal'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import { ButtonFloating } from '../../../../components/Buttons/ButtonFloating'
import AndroidBackHandler from '../../../../components/AndroidBackHandler'

// Services
import { resolveLocalUrl } from '../../../../services/helpers'
import { useStateSafe } from '../../../../services/hooks/useStateSafe'

// Assets
import globals from '../../../../config/globals'

// Data
import { currentCircuitSelector, currentWorkoutColorsSelector } from '../../../../data/workout/selectors'
import { useFocusEffect } from '@react-navigation/native'

const CircuitComplete = (props) => {
  const currentProgram = useSelector((state) => state.data.workouts.currentProgram)
  const workout = useSelector((state) => state.data.workouts.currentWorkout)
  const { primaryColor, secondaryColor } = useSelector(currentWorkoutColorsSelector)

  const [currentWeek] = useState(props.route.params?.week)
  const [category] = useState(props.route.params?.category)
  const [circuits] = useState(props.route.params?.circuits)
  const [timings] = useState(props.route.params?.timings)
  const [showBg, setShowBg] = useStateSafe(true)

  const currentCircuit = useSelector(currentCircuitSelector)

  console.log('currentCircuit', currentCircuit)

  const scrollY = useRef(new Animated.Value(0)).current

  const opacityInterpolation = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, 140, 190],
        outputRange: [0, 0, 1],
      }),
    [scrollY],
  )

  useEffect(() => {
    props.navigation.setOptions({
      headerTransparent: true,
      headerLeft: null,
      headerTitle: () => {
        return !currentProgram.is_challenge ? (
          <SvgUriLocal color={globals.styles.colors.colorWhite} fillAll={true} uri={currentProgram.logo_small_url} />
        ) : (
          <Text style={{ fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 25 }}>{workout.challenge_name}</Text>
        )
      },
      headerTitleStyle: { fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 25, color: globals.styles.colors.colorWhite },
      headerBackground: () => (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: opacityInterpolation,
              shadowColor: globals.styles.colors.colorBlackDark,
              shadowOpacity: 1,
              shadowRadius: 15,
              elevation: 8,
            },
          ]}>
          {currentProgram && <LinearGradient2 style={StyleSheet.absoluteFill} colors={[secondaryColor, primaryColor]} />}
        </Animated.View>
      ),
    })
  }, [currentProgram, workout, props.navigation, opacityInterpolation, primaryColor, secondaryColor])

  // const fadeAnim = useRef(new Animated.Value(1)).current

  const timeDisplay = `${Math.floor(timings[timings.length - 1].time / 60)
    .toString()
    .padStart(2, '0')}:${Math.round(timings[timings.length - 1].time % 60)
    .toString()
    .padStart(2, '0')}`

  function handleOnPress() {
    if (currentCircuit < circuits.length - 1) {
      props.navigation.navigate({
        name: 'CircuitRest',
        key: 'rest',
        params: {
          duration:
            circuits[currentCircuit].circuitMaster?.rest_after_circuit > 0
              ? circuits[currentCircuit].circuitMaster?.rest_after_circuit
              : 60,
          circuits,
        },
      })
    } else {
      props.navigation.navigate('Complete', {
        program: currentProgram,
        week: currentWeek,
        workout,
        category,
        timings,
      })
    }
  }

  useFocusEffect(
    // for some yet unknown reason, OverlayBlend causes crashes when the app is backgrounded
    // and there are multiple instances being rendered in a given stack.
    // Eg. in this screen and then the CircuitRest screen
    useCallback(() => {
      setShowBg(true)
      return () => {
        setShowBg(false)
      }
    }, []),
  )

  if (currentProgram) {
    return (
      <AndroidBackHandler>
        <FocusAwareStatusBar barStyle="light-content" />

        <View style={{ flex: 1, backgroundColor: globals.styles.colors.colorWhite }}>
          {/* Background images & coloring */}
          {showBg && (
            <OverlayBlend
              style={StyleSheet.absoluteFill}
              dstImage={
                <LinearGradient
                  style={{ flex: 1 }}
                  colors={[secondaryColor, primaryColor]}
                  start={{ y: '100h', x: '0w' }}
                  end={{ x: 0, y: '0h' }}
                  stops={[0, 1]}
                />
              }
              resizeCanvasTo={'dstImage'}
              srcImage={
                <ImageBackground
                  style={styles.imageBackground}
                  resizeMode={'cover'}
                  resizeMethod="resize"
                  source={{
                    uri: resolveLocalUrl(currentProgram.background_image_url),
                  }}
                />
              }
            />
          )}

          {/* Center screen text */}
          <View style={styles.textView}>
            <Text style={styles.textViewWorkoutTitle}>{workout.title}</Text>
            {workout.is_challenge && <Text style={styles.textViewWorkoutDayTitle}>{workout.day_title}</Text>}
            <Text style={styles.textViewCircuitTitle}>
              {workout.is_challenge ? 'SESSION' : circuits[currentCircuit].circuitMaster.circuits_title.toUpperCase()} COMPLETE
            </Text>
            <Text style={styles.textViewTimeDisplay}>{timeDisplay}</Text>
            <Text style={styles.textViewTotalText}>TOTAL {currentProgram.is_challenge ? '' : 'CIRCUIT'} TIME</Text>
          </View>

          {/* Bottom button container */}

          <LinearGradient2 colors={[primaryColor + '00', primaryColor, primaryColor]} style={styles.lg2container}>
            <ButtonFloating
              style={styles.startButton}
              onPress={handleOnPress}
              textStyle={{ color: primaryColor }}
              text={
                currentCircuit < circuits.length - 1
                  ? `START ${circuits[currentCircuit + 1].circuitMaster.circuits_title.toUpperCase()}`
                  : `FINISH ${currentProgram.is_challenge ? '' : 'WORKOUT'}`
              }
            />
          </LinearGradient2>
        </View>
      </AndroidBackHandler>
    )
  } else {
    return <View />
  }
}

const styles = {
  scrollContainer: { alignItems: 'center' },
  imageBackground: { width: '100%', height: '100%' },
  textView: {
    zIndex: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFill,
  },
  textViewWorkoutTitle: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 18,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  textViewWorkoutDayTitle: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 18,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
  textViewCircuitTitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 45,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
  textViewTimeDisplay: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    marginTop: 15,
    fontSize: 71,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
  textViewTotalText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 18,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
  lg2container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    position: 'absolute',
    height: 143,
    zIndex: 28,
    selfAlign: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    left: 0,
    right: 0,
    bottom: 0,
  },
  startButton: { backgroundColor: globals.styles.colors.colorWhite, marginBottom: 30 },
  startButtonLabel: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
  },
}

export default CircuitComplete
