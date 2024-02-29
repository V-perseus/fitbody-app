import React, { useEffect, useMemo, useCallback, useState, useRef, useLayoutEffect } from 'react'
import { View, Text, Image, Animated, StyleSheet } from 'react-native'
import LinearGradient2 from 'react-native-linear-gradient'
import { OverlayBlend, LinearGradient } from 'react-native-image-filter-kit'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { useFocusEffect } from '@react-navigation/native'

// Assets
import ChevronRight from '../../../../../assets/images/svg/icon/16px/cheveron/right.svg'
import TipsIcon from '../../../../../assets/images/svg/icon/24px/tips.svg'
import BackgroundImage from '../../../../../assets/images/backgrounds/cardio_burn_default_bg.png'

// Components
import WorkoutOverviewEquipment from '../../components/WorkoutOverviewEquipment'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import { ButtonIcon } from '../../../../components/Buttons/ButtonIcon'
import { ButtonFloating } from '../../../../components/Buttons/ButtonFloating'
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import CircuitCarousel from '../../components/OverviewCircuitCarousel'

// Styles
import globals from '../../../../config/globals'

// Data and services
import { currentCategorySelector, currentTrainerLevelSelector, currentWorkoutColorsSelector } from '../../../../data/workout/selectors'
import { resolveLocalUrl } from '../../../../services/helpers'
import { clearWorkoutProgress, updateWorkoutProgress, workoutStarted } from '../../../../data/workout'
import { useAppSelector } from '../../../../store/hooks'

// Types
import { ICircuit } from '../../../../data/workout/types'
import { WorkoutOverviewScreenNavigationProps } from '../../../../config/routes/routeTypes'

const SPLIT_PER_EXERCISES = 4

interface IOverviewProps extends WorkoutOverviewScreenNavigationProps {}
const Overview: React.FC<IOverviewProps> = ({ navigation }) => {
  const currentProgram = useAppSelector((state) => state.data.workouts.currentProgram)
  const currentTrainer = useAppSelector((state) => state.data.workouts.currentTrainer)
  const workout = useAppSelector((state) => state.data.workouts.currentWorkout)
  const isOnline = useAppSelector((state) => state.offline.online)
  const { levelId, level } = useAppSelector(currentTrainerLevelSelector)
  const exercise_weight_unit = useAppSelector((state) => state.data.user.exercise_weight_unit)
  const specialEquipment = useAppSelector((state) => state.data.user.resistance_bands)
  const { primaryColor, secondaryColor } = useAppSelector(currentWorkoutColorsSelector)
  const category = useAppSelector(currentCategorySelector)

  const [circuits, setCircuits] = useState<ICircuit[]>([])
  const [showCarousel, setShowCarousel] = useState(true)
  const [useDefaultImage, setUseDefaultImage] = useState(false)

  // console.log(workout.circuits)
  // console.log(level_id)
  // console.log(specialEquipment)
  // console.log(currentProgram.special_equipment_enabled)

  useEffect(() => {
    const splitCircuits: ICircuit[] = []

    const split = (circuit: ICircuit, first = false) => {
      if (circuit.exercises.length > SPLIT_PER_EXERCISES) {
        splitCircuits.push({
          ...circuit,
          circuitMaster: {
            ...circuit.circuitMaster!,
            circuits_title: first === true ? circuit.circuitMaster!.circuits_title : `${circuit.circuitMaster!.circuits_title} (CONTD.)`,
          },
          exercises: circuit.exercises.slice(0, SPLIT_PER_EXERCISES),
        })
        split({ ...circuit, exercises: circuit.exercises.slice(SPLIT_PER_EXERCISES) }, false)
      } else {
        splitCircuits.push({
          ...circuit,
          circuitMaster: {
            ...circuit.circuitMaster!,
            circuits_title: first === true ? circuit.circuitMaster!.circuits_title : `${circuit.circuitMaster!.circuits_title} (CONTD.)`,
          },
        })
      }
    }

    // this filters out circuits when special equipment is enabled for that program and user
    const circs = workout?.circuits.filter(
      (c) =>
        (c.special_equipment === specialEquipment ||
          (currentProgram?.special_equipment_enabled === false && c.special_equipment === false)) &&
        c.level_id === levelId,
    )

    // splits longer circuits for performance and layout uniformity when displayed in carousel
    circs?.forEach((c) => {
      if (workout?.is_challenge) {
        splitCircuits.push(c)
        return
      }
      if (c.exercises.length > SPLIT_PER_EXERCISES) {
        split(c, true)
      } else {
        splitCircuits.push(c)
      }
    })
    setCircuits(splitCircuits)
  }, [levelId, specialEquipment, workout?.circuits, workout?.is_challenge, currentProgram?.special_equipment_enabled])

  // console.log('CIRCUITS', JSON.stringify(circuits))

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
    clearWorkoutProgress()

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers, // Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      // playsInSilentLockedModeIOS: true, // the important field
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!showCarousel) {
        setShowCarousel(true)
      }
    }, [showCarousel]),
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          onPress={() => {
            setShowCarousel(false)
            workout?.is_challenge ? navigation.navigate('Challenges') : navigation.navigate('Workouts')
          }}
          iconColor={globals.styles.colors.colorWhite}
          style={{ zIndex: 3 }}
        />
      ),
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate('Tooltips', { screen: 'Tooltip', params: { name: 'workout overview', openedManually: true } })}
          style={{ zIndex: 3 }}>
          <TipsIcon color={globals.styles.colors.colorWhite} />
        </HeaderButton>
      ),
      headerTitle: workout?.title,
      headerTitleStyle: {
        fontFamily: globals.fonts.secondary.style.fontFamily,
        fontSize: 25,
        color: 'white',
        opacity: opacityInterpolation,
      },
      headerBackground: () => (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            opacity: opacityInterpolation,
            shadowColor: globals.styles.colors.colorBlackDark,
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 8,
          }}>
          {currentProgram && <LinearGradient2 style={StyleSheet.absoluteFill} colors={[secondaryColor, primaryColor]} />}
        </Animated.View>
      ),
    })
  })

  const fadeAnim = useRef(new Animated.Value(1)).current
  const fadeTop = useRef(new Animated.Value(0)).current
  const scrollView = useRef(null)

  const scrollPanelStyle = useMemo(() => ({ flexGrow: 1, zIndex: 0, paddingTop: 272, transform: [{ translateY: fadeTop }] }), [fadeTop])

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

  function handleStartButtonPress() {
    if (level?.title) {
      workoutStarted()
    }
    setShowCarousel(false)
    updateWorkoutProgress({ currentSet: 1, currentExerciseIndex: 0, currentCircuit: 0 })
    navigation.navigate('GetReady', { circuitIdx: 0 })
  }

  if (currentProgram && currentTrainer && workout) {
    return (
      <View style={{ flexGrow: 1, backgroundColor: globals.styles.colors.colorWhite }}>
        <FocusAwareStatusBar barStyle="light-content" />
        <Animated.View
          pointerEvents={'none'}
          style={{
            position: 'absolute',
            width: '100%',
            height: 300,
            // zIndex: -1,
            opacity: fadeAnim,
            transform: [
              {
                scaleX: scrollY.interpolate({
                  inputRange: [-200, 0],
                  outputRange: [2.3, 1],
                  extrapolate: 'clamp',
                }),
              },
              {
                scaleY: scrollY.interpolate({
                  inputRange: [-200, 0],
                  outputRange: [2.3, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}>
          <OverlayBlend
            style={{ height: 300, zIndex: 5 }}
            dstImage={
              <LinearGradient
                style={{ height: 300, opacity: 1 }}
                colors={[secondaryColor, primaryColor]}
                start={{ y: '100h', x: '0w' }}
                end={{ x: 0, y: '0h' }}
                stops={[0, 1]}
              />
            }
            resizeCanvasTo={'srcImage'}
            srcImage={
              <Image
                style={styles.workoutImage}
                resizeMode={'cover'}
                resizeMethod="resize"
                source={
                  useDefaultImage
                    ? BackgroundImage
                    : {
                        uri: resolveLocalUrl(workout?.image_url),
                      }
                }
                onError={() => {
                  setUseDefaultImage(true)
                }}
              />
            }
          />
        </Animated.View>
        <Animated.View
          pointerEvents={'none'}
          style={{
            position: 'absolute',
            width: '100%',
            height: 300,
            // zIndex: 0,
            opacity: 0.7,
            transform: [
              {
                scaleX: scrollY.interpolate({
                  inputRange: [-200, 0],
                  outputRange: [2.3, 1],
                  extrapolate: 'clamp',
                }),
              },
              {
                scaleY: scrollY.interpolate({
                  inputRange: [-200, 0],
                  outputRange: [2.3, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}>
          <LinearGradient
            style={{ height: 300, opacity: 1 }}
            colors={[secondaryColor, primaryColor]}
            start={{ y: '100h', x: '0w' }}
            end={{ x: 0, y: '0h' }}
            stops={[0, 1]}
          />
        </Animated.View>
        <View style={styles.titleView}>
          <Text style={styles.titleCategory}>
            {workout?.is_challenge ? workout?.day_title?.toUpperCase() : category?.title.toUpperCase()}
          </Text>
          <Text style={styles.title}>{workout?.title}</Text>
        </View>
        <Animated.ScrollView
          // pointerEvents="box-only"
          showsVerticalScrollIndicator={false}
          ref={scrollView}
          style={scrollPanelStyle}
          horizontal={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: workout?.is_challenge ? 267 : 67 }}
          onScroll={onScroll}
          scrollEventThrottle={16}>
          <View style={styles.scrollPanel}>
            <View style={styles.scrollPanelHeader}>
              <View>
                <Text style={styles.scrollPanelHeaderTitle}>{`${workout?.duration} MINUTES`}</Text>
                <Text style={styles.scrollPanelHeaderSubtitle}>ESTIMATED TIME</Text>
              </View>
              {!workout?.is_challenge && (
                <ButtonIcon
                  onPress={isOnline ? () => navigation.navigate('Level', { from: 'overview' }) : null}
                  style={{
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    height: 40,
                    width: 'auto',
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: isOnline ? currentTrainer?.color : globals.styles.colors.colorGrayDark,
                  }}
                  pressedOpacity={0.5}
                  text={level?.title.toUpperCase()}
                  textStyle={{ color: currentTrainer?.color, fontSize: 12, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily }}
                  rightIcon={() => <ChevronRight color={currentTrainer?.color} />}
                />
              )}
            </View>

            <WorkoutOverviewEquipment isChallenge={workout?.is_challenge} workout={workout} programColor={primaryColor} />

            <CircuitCarousel
              showCarousel={showCarousel}
              circuits={circuits}
              currentProgram={currentProgram}
              currentTrainer={currentTrainer}
              exercise_weight_unit={exercise_weight_unit!}
              primaryColor={primaryColor}
            />
          </View>
        </Animated.ScrollView>
        <LinearGradient2
          colors={[globals.styles.colors.colorTransparentWhite15, globals.styles.colors.colorWhite, globals.styles.colors.colorWhite]}
          style={styles.startButtonGradient}>
          <ButtonFloating
            style={{ backgroundColor: primaryColor ?? globals.styles.colors.colorBlackDark, marginBottom: 30 }}
            text={`START ${workout?.is_challenge ? 'CARDIO BURN' : 'WORKOUT'}`}
            onPress={handleStartButtonPress}
          />
        </LinearGradient2>
      </View>
    )
  } else {
    return <View />
  }
}

const styles = StyleSheet.create({
  workoutImage: {
    opacity: 1,
    width: '100%',
    height: 300,
  },
  titleView: { marginLeft: 24, zIndex: 0, borderWidth: 0, position: 'absolute', alignSelf: 'stretch', top: 200 },
  titleCategory: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 16, color: globals.styles.colors.colorWhite },
  title: { fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 35, color: globals.styles.colors.colorWhite },
  scrollPanel: {
    flexGrow: 1,
    width: globals.window.width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: globals.styles.colors.colorWhite,
    // paddingBottom: 300,
  },
  scrollPanelHeader: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    height: 87,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollPanelHeaderTitle: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 20 },
  scrollPanelHeaderSubtitle: { fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12, marginTop: -3 },
  paginationContainer: {
    paddingVertical: 24,
  },
  startButtonGradient: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    position: 'absolute',
    height: 143,
    zIndex: 18,
    selfAlign: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default Overview
