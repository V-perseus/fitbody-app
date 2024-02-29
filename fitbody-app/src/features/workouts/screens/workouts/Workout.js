import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native'
import { shallowEqual, useSelector } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS, Video, ResizeMode } from 'expo-av'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import KeepAwake from 'react-native-keep-awake'
import { useTimer } from 'react-use-precision-timer'
import { ms, vs } from 'react-native-size-matters/extend'
import * as _ from 'lodash'
import moment from 'moment'

// Components
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import ExerciseInfoBox from '../../components/ExerciseInfoBox'
import { BottomPanel } from '../../components/BottomPanel/BottomPanel'
import { ButtonOpacity } from '../../../../components/Buttons/ButtonOpacity'
import { ButtonSquare } from '../../../../components/Buttons/ButtonSquare'
import Timer from '../../components/Timer'
import AndroidBackHandler from '../../../../components/AndroidBackHandler'
import { WorkoutOptionsPanel } from '../../components/WorkoutOptions/WorkoutOptions'
import ProperFormTips from '../../components/ProperFormTips/ProperFormTips'

// Assets
import globals from '../../../../config/globals'
import Left from '../../../../../assets/images/svg/icon/40px/cirlce/arrow-left-solid.svg'
import Pause from '../../../../../assets/images/svg/icon/56px/circle/pause-filled.svg'
import Right from '../../../../../assets/images/svg/icon/40px/cirlce/arrow-right-solid.svg'
import Menu from '../../../../../assets/images/svg/menu.svg'
import Edited from '../../../../../assets/images/svg/icon/16px/edited.svg'

// Services
import { resolveLocalUrl } from '../../../../services/helpers'
import { useSegmentLogger } from '../../../../services/hooks/useSegmentLogger'

// Data
import { updateUserProfile } from '../../../../data/user'
import { submitCompletion, updateWorkoutProgress, clearWorkoutProgress, setAlternativeExercisesMap } from '../../../../data/workout'
import { currentCircuitsSelector, currentCircuitSelector, currentExerciseIndexSelector } from '../../../../data/workout/selectors'

const Workout = ({ navigation, route }) => {
  const { logEvent } = useSegmentLogger()
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers, // Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true, // the important field
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
    })
  }, [])

  const currentProgram = useSelector((state) => state.data.workouts.currentProgram, shallowEqual)
  const currentTrainer = useSelector((state) => state.data.workouts.currentTrainer, shallowEqual)
  const workout = useSelector((state) => state.data.workouts.currentWorkout, shallowEqual)
  const categoryId = useSelector((state) => state.data.workouts.currentCategory, shallowEqual)
  const level_id = useSelector((state) => state.data.user.meta.trainers?.[currentTrainer.id]?.level_id)
  const level = useSelector((state) => state.data.workouts.levels?.[level_id])
  const current_week = useSelector((state) => state.data.user.meta.programs[currentProgram?.slug?.toLowerCase()]?.current_week) ?? 1
  const exercise_weight_unit = useSelector((state) => state.data.user.exercise_weight_unit)
  const currentCircuit = useSelector(currentCircuitSelector)
  const currentSet = useSelector((state) => state.data.workouts.progress?.currentSet) || 0
  const currentExerciseIndex = useSelector(currentExerciseIndexSelector)
  const userId = useSelector((state) => state.data.user.id)
  const previousElapsed = useSelector((state) => state.data.workouts.progress?.elapsed) ?? 0
  const sound_alerts = useSelector((state) => state.data.user.sound_alerts)
  const form_tips_audio = useSelector((state) => state.data.user.form_tips_audio)
  const previousTimings = useSelector((state) => state.data.workouts.progress?.timings) ?? []
  const alternativeExercisesMap = useSelector((state) => state.data.workouts.alternativeExercisesMap || {})
  const circuits = useSelector(currentCircuitsSelector)

  const [audioEnabled, setAudioEnabled] = useState(sound_alerts)
  const [autoplayEnabled, setAutoplayEnabled] = useState(form_tips_audio)
  const [isPaused, setIsPaused] = useState(false)
  const [showVideo, setShowVideo] = useState(true)
  const [delta, setDelta] = useState(0)
  const [continuePrevious] = useState(route.params?.continuePrevious ?? false)
  const [quitPanelShowing, setQuitPanelShowing] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [isAlternate, setIsAlternate] = useState(false)
  const [timings, setTimings] = useState(previousTimings)
  const [formTipsOpen, setFormTipsOpen] = useState(false)

  const bottomPanel = useRef(null)
  const pausePanel = useRef(null)
  const exitPanel = useRef(null)
  const contextRef = useRef(null)

  const timer = useTimer({
    delay: 500,
    startImmediately: true,
  })

  useEffect(() => {
    if (continuePrevious && delta === 0) {
      setDelta(previousElapsed)
    }
  }, [continuePrevious, delta])

  useFocusEffect(
    useCallback(() => {
      if (timer && timer.isPaused()) {
        console.log('resuming timer')
        timer.resume()
      }
    }, [currentSet, currentCircuit, currentExerciseIndex]),
  )

  const timeDisplay = `${Math.floor((timer.getElapsedRunningTime() / 1000 + delta) / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor((timer.getElapsedRunningTime() / 1000 + delta) % 60)
    .toString()
    .padStart(2, '0')}`

  const category = useMemo(() => currentProgram.categories?.find((c) => c.id === categoryId), [categoryId, currentProgram])

  // @DEV even though we want to show alternate exercises, we still need to track the current parent exercise
  const currentParentExercise = useMemo(
    () => circuits[currentCircuit].exercises[currentExerciseIndex],
    [circuits, currentCircuit, currentExerciseIndex],
  )

  // @DEV this will find an alt exercise if one is in state, set a flag<bool> hasAlt, and return either the alt or parent exercise
  const currentExercise = useMemo(() => {
    const hasAlt = alternativeExercisesMap[currentCircuit]?.[currentExerciseIndex]
    setIsAlternate(!!hasAlt)
    return hasAlt ? hasAlt : circuits[currentCircuit].exercises[currentExerciseIndex]
  }, [currentCircuit, currentExerciseIndex, alternativeExercisesMap, circuits])

  // @DEV computes currentExerciseIndex and elapsed time accounting for the case of an interrupted in-progress workout via delta time
  const setCurrentExerciseIndex = useCallback(
    (val) => updateWorkoutProgress({ currentExerciseIndex: val, elapsed: timer.getElapsedRunningTime() / 1000 + delta }),
    [timer, timings],
  )

  // @DEV computes currentCircuit and elapsed time accounting for the case of an interrupted in-progress workout via delta time
  const setCurrentCircuit = useCallback(
    (val) => updateWorkoutProgress({ currentCircuit: val, elapsed: timer.getElapsedRunningTime() / 1000 + delta, timings }),
    [timer, timings],
  )

  // @DEV computes currentSet and elapsed time accounting for the case of an interrupted in-progress workout via delta time
  const setCurrentSet = useCallback(
    (val) => updateWorkoutProgress({ currentSet: val, elapsed: timer.getElapsedRunningTime() / 1000 + delta }),
    [timer],
  )

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      setShowVideo(true)
      if (timer.getElapsedRunningTime() / 1000 > 1) {
        if (currentExerciseIndex === circuits[currentCircuit].exercises.length - 1) {
          setCurrentExerciseIndex(0)
        } else {
          setCurrentExerciseIndex(currentExerciseIndex + 1)
          return
        }
        if (currentSet < circuits[currentCircuit].rounds_or_reps) {
          setCurrentSet(currentSet + 1)
        } else if (currentCircuit < circuits.length) {
          setCurrentCircuit(currentCircuit + 1)
          setCurrentSet(1)
        }
      }
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [circuits, currentCircuit, currentSet, setCurrentExerciseIndex, setCurrentSet, setCurrentCircuit, currentExerciseIndex, navigation])

  function handler() {
    console.log('onpress called', currentSet)

    if (_.isEqual(contextRef.current, [currentCircuit, currentSet, currentExerciseIndex])) {
      console.log('been there, done that')
      return
    }

    contextRef.current = [currentCircuit, currentSet, currentExerciseIndex]

    if (currentExerciseIndex === circuits[currentCircuit].exercises.length - 1) {
      // Last exercise of the set
      if (currentSet === circuits[currentCircuit].rounds_or_reps) {
        // timer.pause()
        // Last exercise of the last set -> finish circuit
        const previousTime = timings.length > 0 ? timings[timings.length - 1].elapsed : 0
        const timing = timer.getElapsedRunningTime() / 1000 + delta - previousTime

        console.log('hello, adding a timing entry...')

        const timings2 = [
          ...timings,
          {
            circuit_id: circuits[currentCircuit].id,
            circuit: circuits[currentCircuit].circuitMaster.circuits_title,
            time: timing,
            elapsed: timer.getElapsedRunningTime() / 1000 + delta,
          },
        ]

        // console.log(timings2)

        setTimings(timings2)

        // console.log('currentCircuit', currentCircuit)

        if (currentCircuit === circuits.length - 1) {
          console.log('laatste?')
          timer.pause()

          const completion = {
            server: {
              [workout.is_challenge ? 'challenge_id' : 'workout_id']: workout.id,
              time: timings2[timings2.length - 1].elapsed,
              date: moment().format('YYYY-MM-DD'),
              meta: { circuits: timings2.map((t) => ({ circuit_id: t.circuit_id, time: t.time })) },
            },
            local: {
              [workout.is_challenge ? 'challenge_id' : 'workout_id']: workout.id,
              time: timings2[timings2.length - 1].elapsed,
              date: moment().format('YYYY-MM-DD'),
              meta: { circuits: timings2.map((t) => ({ circuit_id: t.circuit_id, circuit: t.circuit, time: t.time })) },
              hidden: false,
              manual: false,
              category_icon_url: workout.is_challenge ? null : category.icon_url,
              program_color: workout.is_challenge ? null : currentProgram.color,
              program_color_secondary: workout.is_challenge ? null : currentProgram.color_secondary,
              trainer_color: workout.is_challenge ? null : currentTrainer.color,
              trainer_color_secondary: workout.is_challenge ? null : currentTrainer.secondary_color,
              workout_title: workout.title,
              workout_category: workout.is_challenge ? null : category.title,
              level_title: workout.is_challenge ? null : level.title,
              week_number: workout.is_challenge ? null : current_week,
              program_id: workout.is_challenge ? null : currentProgram.id,
              trainer_id: 1,
              challenge_name: workout.is_challenge ? workout.challenge_name : null,
              is_challenge: workout.is_challenge,
              challenge_day: workout.is_challenge ? workout.day_number : null,
              challenge_background_img: workout.is_challenge ? workout.image_url : null,
            },
          }

          if (workout.is_challenge) {
            completion.server.meta.challenge_day_number = workout.day_number
            completion.local.meta.challenge_day_number = workout.day_number
          } else {
            completion.server.meta.level_id = level.id
            completion.local.meta.level_id = level.id
          }

          console.log('completion', completion)

          //Workout complete
          submitCompletion(completion)
        }
        setShowVideo(false)
        // if we're finishing the last circuit, we want to skip the CircuitComplete screen
        if (currentCircuit < circuits.length - 1) {
          navigation.navigate({
            name: 'CircuitComplete',
            params: {
              program: currentProgram,
              workout,
              category,
              circuits,
              timings: timings2,
              currentCircuit,
              circuitIdx: currentCircuit + 1,
            },
          })
        } else {
          navigation.navigate('Complete', {
            program: currentProgram,
            workout,
            category,
            timings: timings2,
          })
        }
        // CircuitComplete screen will either redirect to timer, then back here, or complete workout
      } else {
        // Rest
        // timer.pause()
        setShowVideo(false)
        navigation.navigate({
          name: 'GetReady',
          key: circuits[currentCircuit].circuitMaster.circuits_title + '_' + currentSet,
          params: {
            duration:
              circuits[currentCircuit].circuitMaster?.rest_after_set > 0 ? circuits[currentCircuit].circuitMaster.rest_after_set : 30,
            text: 'REST',
            isRest: true,
            circuitIdx: currentCircuit,
          },
        })
      }
    } else {
      // Not the last exercise -> next exercise
      const cm = circuits[currentCircuit].circuitMaster
      const restBetweenExercises = cm?.rest_after_n_exercises
      const shouldRest = restBetweenExercises > 0 ? (currentExerciseIndex + 1) % restBetweenExercises === 0 : false
      const restDuration = cm?.rest_between_exercise ?? 0

      if (restDuration > 0 && shouldRest) {
        // Rest
        navigation.navigate({
          name: 'GetReady',
          key: circuits[currentCircuit].circuitMaster.circuits_title + '_' + currentSet,
          params: {
            duration: restDuration,
            text: 'REST',
            isRest: true,
            circuitIdx: currentCircuit,
            exerciseIdx: currentExerciseIndex + 1,
          },
        })
      } else {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
      }
    }
  }

  function handleGoToPrevious() {
    setCurrentExerciseIndex(currentExerciseIndex - 1)
    contextRef.current = [currentCircuit, currentSet, currentExerciseIndex]
  }

  function handlePause() {
    timer.pause()
    setIsPaused(true)
    pausePanel.current?.slideInUp(800)
    bottomPanel.current?.slideOutDown(800)
  }

  function handleQuit() {
    setQuitPanelShowing(true)
    exitPanel.current?.slideInUp(800)
    pausePanel.current?.slideOutDown(800)
  }

  function handleResume() {
    timer.resume()
    setIsPaused(false)
    pausePanel.current?.slideOutDown(800)
    bottomPanel.current?.slideInUp(800)
  }

  function handleQuitWorkout() {
    exitPanel.current?.slideOutDown(1000)
    setShowVideo(false)
    navigation.navigate('Overview')
    clearWorkoutProgress()
  }

  function handleExitPanelResume() {
    timer.resume()
    setIsPaused(false)
    setQuitPanelShowing(false)
    bottomPanel.current?.slideInUp(800)
    exitPanel.current?.slideOutDown(800)
  }

  async function handleAudioToggle(value) {
    setAudioEnabled(value)
    try {
      updateUserProfile({
        id: userId,
        sound_alerts: value,
      })
    } catch (error) {}
  }

  async function handleAutoplayToggle(value) {
    setAutoplayEnabled(value)
    try {
      updateUserProfile({
        id: userId,
        form_tips_audio: value,
      })
    } catch (error) {}
  }

  /*
   @DEV only alternative items have a replacement_id property.
   If the item selected is the original item, then remove from alternativesMap
   */
  function handleAlternateReplace(item) {
    setAlternativeExercisesMap({ currentCircuit, currentExerciseIndex, exercise: item })
  }

  function handleSettingsPress() {
    logEvent(null, 'Popup Shown', {
      name: 'Exercise Settings',
      workoutId: workout.id,
      exerciseId: currentExercise.exercise_id,
    })
    setShowOptions(true)
  }

  function closeAllMenus() {
    setShowOptions(false)
    setFormTipsOpen(false)
  }

  useEffect(() => {
    if (workout) {
      const updatedWorkoutLogState = {
        workoutLog: {},
      }
      // need to filter the circuits like on workout overview.
      
      workout.circuits.forEach((circuit) => {
        const circuitId = circuit.id
        const circuitExercises = {}

        circuit.exercises.forEach((exercise, index) => {
          const exerciseId = exercise.exercise_id
          const exerciseSets = {}

          for (let i = 1; i <= circuit.rounds_or_reps; i++) {
            const setId = `set${i}`
            const set = {
              reps: '',
              weight: exercise.weight ? '' : null,
            }

            exerciseSets[setId] = set
          }

          circuitExercises[exerciseId] = exerciseSets
        })

        updatedWorkoutLogState.workoutLog[circuitId] = circuitExercises
      })

      console.log('updatedWorkoutLogState')
      console.log(updatedWorkoutLogState)

      // Dispatch the updated workout logs state to Redux
      // dispatch(setWorkoutLog(updatedWorkoutLogState))
    }
  }, [workout])

  return (
    <AndroidBackHandler handlePress={quitPanelShowing ? handleExitPanelResume : isPaused ? handleResume : handlePause}>
      <KeepAwake />
      <FocusAwareStatusBar barStyle="dark-content" />
      <View pointerEvents="box-none" style={styles.absoluteBg} />

      {/* <View> */}
      <SafeAreaView style={styles.header}>
        {/* Workout name */}
        <Animatable.View animation="fadeInDown" useNativeDriver={true}>
          <View>
            <Text style={styles.workoutText}>{currentExercise?.exercise?.title?.toUpperCase()}</Text>
            {isAlternate && (
              <View style={styles.alternateLabel}>
                <Edited color={currentTrainer.color || globals.styles.colors.colorGrayDark} />
                <Text style={[styles.alternateLabelText, { color: currentTrainer.color }]}>{currentExercise.type}</Text>
              </View>
            )}
          </View>
        </Animatable.View>

        {/* Timer */}
        <Timer display={timeDisplay} />
      </SafeAreaView>

      <View style={styles.exerciseView}>
        {/* Video */}
        <View
          style={[
            styles.video,
            currentExercise.secondary_timer ? { width: globals.window.height * 0.37, height: globals.window.height * 0.37 } : {},
          ]}>
          {showVideo && (
            <Video
              style={StyleSheet.absoluteFillObject}
              source={{
                uri: resolveLocalUrl(currentExercise?.exercise?.video_url, true),
              }}
              isLooping={true}
              shouldPlay={true}
              isMuted={true}
              rate={1.0}
              resizeMode={ResizeMode.COVER}
            />
          )}
        </View>
        <View style={styles.infoBoxView}>
          {showVideo && (
            <ExerciseInfoBox
              currentExerciseIndex={contextRef.current}
              unit={exercise_weight_unit}
              exercise={currentExercise}
              showTimer={true}
              program={currentProgram}
              trainer={currentTrainer}
              isPaused={isPaused}
            />
          )}
        </View>

        {/* Next Exercise Row */}
        <Animatable.View animation="fadeInUp" delay={1000} useNativeDriver={true} style={styles.nextExerciseView}>
          <ButtonOpacity onPress={handleSettingsPress}>
            <Menu color={globals.styles.colors.colorBlack} height={ms(56)} width={ms(56)} />
          </ButtonOpacity>
          {alternativeExercisesMap[currentCircuit]?.[currentExerciseIndex + 1] ??
          circuits[currentCircuit].exercises[currentExerciseIndex + 1] ? (
            <View style={styles.nextExerciseRight}>
              <View style={styles.nextExerciseTextView}>
                <Text style={styles.next}>NEXT</Text>
                <Text style={styles.nextExerciseTitle}>
                  {(
                    (
                      alternativeExercisesMap[currentCircuit]?.[currentExerciseIndex + 1] ??
                      circuits[currentCircuit].exercises[currentExerciseIndex + 1]
                    ).exercise.title || ''
                  ).toUpperCase()}
                </Text>
              </View>
              <Image
                height={85}
                width={85}
                style={styles.nextExerciseImage}
                source={{
                  uri: resolveLocalUrl(
                    (
                      alternativeExercisesMap[currentCircuit]?.[currentExerciseIndex + 1] ??
                      circuits[currentCircuit].exercises[currentExerciseIndex + 1]
                    ).exercise.image_url,
                  ),
                }}
              />
            </View>
          ) : (
            <View style={styles.nextExerciseSpacer} />
          )}
        </Animatable.View>
      </View>

      <ProperFormTips
        content={currentExercise.exercise.proper_form_tip?.description ?? ''}
        audioUrl={currentExercise.exercise.proper_form_tip?.sound_file}
        autoplayEnabled={autoplayEnabled}
        onOpenStateChange={setFormTipsOpen}
        open={formTipsOpen}
        disabled={!currentExercise?.exercise?.proper_form_tip}
      />

      <WorkoutOptionsPanel
        showOptions={showOptions}
        onClose={() => setShowOptions(false)}
        audioEnabled={audioEnabled}
        autoplayEnabled={autoplayEnabled}
        handleAudioToggle={handleAudioToggle}
        handleAutoplayToggle={handleAutoplayToggle}
        currentTrainer={currentTrainer}
        alternatives={currentParentExercise.replacements?.map((r) =>
          r.replacement_id === currentExercise.replacement_id ? currentParentExercise : r,
        )}
        initialIndex={currentParentExercise.replacements?.findIndex((r) => r.replacement_id === currentExercise.replacement_id)}
        onReplace={handleAlternateReplace}
        workoutId={workout.id}
        exerciseId={currentExercise.exercise_id}
      />

      {/* white overlay to cover proper form tips when BottomPanels are animating */}
      <View style={styles.properFormTipsMask} />

      <BottomPanel
        ref={bottomPanel}
        immediate={true}
        zIndex={11}
        height={vs(112)}
        gradientColors={
          workout.is_challenge
            ? [currentProgram.color_secondary, currentProgram.color]
            : [currentTrainer.secondary_color, currentTrainer.color]
        }>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
          <View style={styles.bottomPanelSetView}>
            <Text style={styles.setViewCircuitTitle}>
              {workout.is_challenge ? 'CARDIO BURN' : circuits[currentCircuit].circuitMaster.circuits_title}
            </Text>
            <Text style={styles.setViewSetCount}>
              SET {currentSet} OF {circuits[currentCircuit].rounds_or_reps}
            </Text>
          </View>
          <View style={styles.bottomPanelButtonContainer}>
            <ButtonOpacity onPress={showOptions || formTipsOpen ? closeAllMenus : handleGoToPrevious} disabled={currentExerciseIndex < 1}>
              <Left color={'white'} style={{ marginRight: 16, opacity: currentExerciseIndex > 0 ? 1 : 0.5 }} />
            </ButtonOpacity>
            <ButtonOpacity onPress={handlePause}>
              <Pause color={'white'} style={styles.pauseButton} />
            </ButtonOpacity>
            <ButtonOpacity onPress={showOptions || formTipsOpen ? closeAllMenus : handler}>
              <Right color={'white'} style={styles.nextButton} />
            </ButtonOpacity>
          </View>
        </View>
      </BottomPanel>

      <BottomPanel
        ref={pausePanel}
        zIndex={12}
        height={vs(112)}
        gradientColors={
          workout.is_challenge
            ? [currentProgram.color_secondary, currentProgram.color]
            : [currentTrainer.secondary_color, currentTrainer.color]
        }>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <ButtonSquare
            pressedOpacity={0.5}
            onPress={handleQuit}
            style={styles.quitButton}
            text={'QUIT'}
            textStyle={styles.quitButtonText}
          />
          <ButtonSquare
            onPress={handleResume}
            style={styles.resumeButton}
            text={'RESUME'}
            textStyle={{
              color: workout.is_challenge ? currentProgram.color : currentTrainer.color,
              fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
              fontSize: 16,
            }}
          />
        </View>
      </BottomPanel>

      <BottomPanel
        zIndex={14}
        ref={exitPanel}
        height={vs(128)}
        gradientColors={
          workout.is_challenge
            ? [currentProgram.color_secondary, currentProgram.color]
            : [currentTrainer.secondary_color, currentTrainer.color]
        }>
        <View>
          <Text style={styles.quitText}>Are you sure you want to quit workout?</Text>
          <View style={styles.exitPanelButtonView}>
            <ButtonSquare
              onPress={handleQuitWorkout}
              style={styles.exitPanelDoneButton}
              text={"Yes, I'm done"}
              textStyle={{
                color: workout.is_challenge ? currentProgram.color : currentTrainer.color,
                fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
                fontSize: 16,
              }}
            />
            <ButtonSquare
              onPress={handleExitPanelResume}
              style={styles.exitPanelResumeButton}
              text={'No, keep sweating!'}
              textStyle={styles.exitPanelResumeButtonText}
              pressedOpacity={0.5}
            />
          </View>
        </View>
      </BottomPanel>
    </AndroidBackHandler>
  )
}

const styles = {
  absoluteBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    height: vs(194),
    zIndex: 10,
  },
  exerciseView: { flex: 1, marginTop: vs(154), marginBottom: vs(172), paddingBottom: 8, justifyContent: 'space-between' },
  infoBoxView: { backgroundColor: globals.styles.colors.colorWhite },
  workoutText: {
    width: globals.window.width * 0.47,
    color: globals.styles.colors.colorBlack,
    lineHeight: 32,
    fontSize: 30,
    fontFamily: globals.fonts.secondary.style.fontFamily,
  },
  alternateLabel: { flexDirection: 'row', alignItems: 'center' },
  alternateLabelText: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorGrayDark,
    marginLeft: 4,
  },
  video: {
    width: globals.window.height * 0.43,
    height: globals.window.height * 0.43,
    alignSelf: 'center',
  },
  nextExerciseView: {
    alignItems: 'center',
    height: vs(85),
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  nextExerciseRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  nextExerciseTextView: { flexDirection: 'column', alignItems: 'flex-end' },
  next: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 13 },
  nextExerciseTitle: { width: 200, fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 19, textAlign: 'right' },
  nextExerciseImage: { marginLeft: 15, borderWidth: 0, height: vs(85), width: vs(85) },
  nextExerciseSpacer: { height: 85 },
  properFormTipsMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(112),
    backgroundColor: globals.styles.colors.colorWhite,
    zIndex: 10,
  },
  bottomPanelSetView: { marginLeft: 25, marginTop: 29 },
  setViewCircuitTitle: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 25,
    lineHeight: 25,
    color: globals.styles.colors.colorWhite,
  },
  setViewSetCount: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 14,
    marginTop: -2,
    color: globals.styles.colors.colorWhite,
  },
  bottomPanelButtonContainer: { height: 56, marginTop: vs(24), flexDirection: 'row', alignItems: 'center' },
  pauseButton: { marginRight: 16 },
  nextButton: { marginRight: 24 },
  quitGradient: {
    ...StyleSheet.absoluteFill,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  quitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: (Dimensions.get('window').width - 64) / 2,
    borderWidth: 1,
    marginHorizontal: 8,
    borderColor: globals.styles.colors.colorWhite,
    borderRadius: 8,
  },
  quitButtonText: { color: globals.styles.colors.colorWhite, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 16 },
  resumeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: (Dimensions.get('window').width - 64) / 2,
    marginHorizontal: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 8,
  },
  quitText: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 14,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
  },
  exitPanelButtonView: { flexDirection: 'row', marginTop: 16 },
  exitPanelDoneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: (Dimensions.get('window').width - 64) / 2,
    marginHorizontal: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 8,
  },
  exitPanelResumeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: (Dimensions.get('window').width - 64) / 2,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorWhite,
    borderRadius: 8,
  },
  exitPanelResumeButtonText: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    textAlign: 'center',
  },
}

export default Workout
