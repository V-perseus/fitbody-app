import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  View,
  Text,
  Dimensions,
  Pressable,
  AppState,
  Switch,
  Platform,
} from 'react-native'
import { useSelector } from 'react-redux'
import { LinearGradient, OverlayBlend } from 'react-native-image-filter-kit'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import * as Animatable from 'react-native-animatable'
import KeepAwake from 'react-native-keep-awake'
import { useTimer } from 'react-use-precision-timer'
import { vs } from 'react-native-size-matters/extend'
import moment from 'moment'
import { Audio } from 'expo-av'
import { SvgUri } from 'react-native-svg'
import { SafeAreaView } from 'react-native-safe-area-context'

// Assets
import Menu from '../../../../../assets/images/svg/menu.svg'
import SoundOn from '../../../../../assets/images/svg/icon/24px/sound-on.svg'
import SoundOff from '../../../../../assets/images/svg/icon/24px/sound-off.svg'
import Walkthrough from '../../../../../assets/images/svg/icon/24px/walkthrough-.svg'
import Left from '../../../../../assets/images/svg/icon/40px/cirlce/arrow-left-solid.svg'
import Pause from '../../../../../assets/images/svg/icon/56px/circle/pause-filled.svg'
import Right from '../../../../../assets/images/svg/icon/40px/cirlce/arrow-right-solid.svg'
import DashedCircle from '../../../../../assets/images/svg/dashed-circle.svg'
import globals from '../../../../config/globals'

import { submitCompletion } from '../../../../data/workout'

import { resolveLocalUrl } from '../../../../services/helpers'
import { BottomPanel } from '../../components/BottomPanel/BottomPanel'
import { SlideMenu } from '../../../../components/SlideMenu/SlideMenu'
import { ButtonSquare } from '../../../../components/Buttons/ButtonSquare'
import AndroidBackHandler from '../../../../components/AndroidBackHandler'
import AudioDucking from '../../../../nativeModules/audioDucking'

const Exercise = ({ route, navigation }) => {
  const currentProgram = useSelector((state) => state.data.workouts.currentProgram)

  const workout = useSelector((state) => state.data.workouts.currentWorkout)

  const categoryId = useSelector((state) => state.data.workouts.currentCategory)
  const category = useMemo(() => currentProgram.categories?.find((c) => c.id === categoryId), [categoryId, currentProgram])

  const [exercise] = useState(route.params?.exercise)
  const currentTrainer = useSelector((state) => state.data.workouts.currentTrainer)
  const level_id = useSelector((state) => state.data.user.meta.trainers?.[currentTrainer.id]?.level_id)
  const level = useSelector((state) => state.data.workouts.levels?.[level_id])

  const current_week = useSelector((state) => state.data.user.meta.programs[currentProgram?.slug?.toLowerCase()]?.current_week) ?? 1

  const cardio = useMemo(() => workout.cardio.find((c) => c.level_id === level_id), [workout, level_id])

  const appState = useRef(AppState.currentState)

  const optionsPanel = useRef(null)
  const bottomPanel = useRef(null)
  const pausePanel = useRef(null)
  const exitPanel = useRef(null)
  const finishButton = useRef(null)
  const menuButton = useRef(null)
  const timerCircle = useRef(null)
  const timerCountdown = useRef(null)
  const header = useRef(null)

  const timerTranslate = useRef(new Animated.Value(0)).current
  const menuPanelTranslate = useRef(new Animated.Value(254)).current
  const popupTranslate = useRef(new Animated.Value(100)).current

  const [initial, setInitial] = useState(true)
  const [enabled, setEnabled] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [finishModalShowing, setFinishModalShowing] = useState(false)
  const [confirmQuitShowing, setConfirmQuitShowing] = useState(false)
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const [walkthrough] = useState(cardio.walkthroughs.find((w) => w.cardio_exercise_id === exercise.id))
  const [currentWalkthroughDirectiveIndex, setIndex] = useState(0)
  const [directive, setDirective] = useState(null)

  const timer = useTimer({
    delay: 900,
    callback: () => setElapsed(timer.getElapsedRunningTime() / 1000),
    startImmediately: true,
  })

  useEffect(() => {
    async function play() {
      const { sound: s } = await Audio.Sound.createAsync({ uri: directive.audio_file_url }, { shouldPlay: true }, (status) => {
        if (status.didJustFinish) {
          s.unloadAsync()
          AudioDucking.removeAudioDucking()
        }
      })
    }

    if (autoplayEnabled && directive?.audio_file_url?.length > 50) {
      play()
    }
  }, [autoplayEnabled, directive])

  useEffect(() => {
    if (elapsed === workout.duration?.toFixed(0) * 60) {
      finishButton.current?.bounce()
    }
    // if (enabled) {
    if (walkthrough && directive && elapsed >= directive.start_time + directive.directive_length) {
      setDirective(null)
      if (
        !walkthrough.directives[currentWalkthroughDirectiveIndex] ||
        (walkthrough.directives[currentWalkthroughDirectiveIndex] &&
          walkthrough.directives[currentWalkthroughDirectiveIndex].start_time - elapsed > 5)
      ) {
        Animated.timing(timerTranslate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start()
      }
    }
    if (
      walkthrough &&
      walkthrough.directives[currentWalkthroughDirectiveIndex] &&
      elapsed >= walkthrough.directives[currentWalkthroughDirectiveIndex].start_time
    ) {
      Animated.timing(timerTranslate, {
        toValue: enabled ? -100 : 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setDirective(walkthrough.directives[currentWalkthroughDirectiveIndex])
        setIndex((c) => c + 1)
      })
      // }
    }
  }, [elapsed])

  useEffect(() => {
    if (initial) {
      setInitial(false)
    } else {
      Animated.timing(timerTranslate, {
        toValue: enabled && directive ? -100 : 0,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }
  }, [enabled])

  useEffect(() => {
    const listener = AppState.addEventListener('change', _handleAppStateChange)

    return () => {
      listener.remove()
    }
  }, [])

  const _handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active' && elapsed >= workout.duration * 60) {
      finishButton.current?.bounce()
    }

    appState.current = nextAppState
  }

  function completeWorkout() {
    const timings = [{ circuit_title: exercise.name, time: elapsed, elapsed: elapsed }]

    const completion = {
      server: {
        [workout.is_challenge ? 'challenge_id' : 'workout_id']: workout.id,
        time: elapsed,
        date: moment().format('YYYY-MM-DD'),
        meta: { circuits: timings.map((t) => ({ circuit_id: 1, circuit_title: t.circuit_title, time: t.time })), level_id: level.id },
      },
      local: {
        [workout.is_challenge ? 'challenge_id' : 'workout_id']: workout.id,
        time: timings[timings.length - 1].elapsed,
        date: moment().format('YYYY-MM-DD'),
        meta: { circuits: timings.map((t) => ({ circuit_id: 1, circuit_title: t.circuit_title, time: t.time })), level_id: level.id },
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

    submitCompletion(completion)

    bottomPanel.current.slideOutDown(600)
    menuButton.current.slideOutDown(600)
    timerCircle.current.zoomOut(500)
    timerCountdown.current.zoomOut(500)
    header.current.slideOutUp(500)
    Animated.timing(popupTranslate, { toValue: 100, duration: 200, useNativeDriver: true }).start()
    setDirective(null)
    setTimeout(() => {
      // we need to replace in order to unmount <OverlayBlend />
      // which causes issues if mutiple instances are mounted
      navigation.replace('Complete', { program: currentProgram, workout, exercise, timings: timings, category })
    }, 600)
  }

  function handlePause() {
    timer.pause()
    setPaused(true)
    bottomPanel.current?.slideOutDown(800)
    pausePanel.current?.slideInUp(800)
  }

  function handleResume() {
    timer.resume()
    setPaused(false)
    pausePanel.current?.slideOutDown(800)
    bottomPanel.current?.slideInUp(800)
  }

  function handleKeepSweating() {
    timer.resume()
    setPaused(false)
    setFinishModalShowing(false)
    setConfirmQuitShowing(false)
    exitPanel.current?.slideOutDown(800)
    bottomPanel.current?.slideInUp(800)
  }

  function handleQuit() {
    setConfirmQuitShowing(true)
    pausePanel.current?.slideOutDown(800)
    exitPanel.current?.slideInUp(800)
  }

  function handleResumeFromQuit() {
    timer.resume()
    setPaused(false)
    setFinishModalShowing(false)
    Animated.timing(popupTranslate, { toValue: 100, duration: 200, useNativeDriver: true }).start()
  }

  return (
    <AndroidBackHandler
      handlePress={
        finishModalShowing ? handleResumeFromQuit : confirmQuitShowing ? handleKeepSweating : paused ? handleResume : handlePause
      }>
      <KeepAwake />
      {/* colored backgorund image */}
      <OverlayBlend
        style={StyleSheet.absoluteFill}
        dstImage={
          <LinearGradient
            style={{ flex: 1 }}
            colors={[currentTrainer.secondary_color, currentTrainer.color]}
            start={{ y: '100h', x: '0w' }}
            end={{ x: 0, y: '0h' }}
            stops={[0, 1]}
          />
        }
        resizeCanvasTo={'dstImage'}
        srcImage={
          <ImageBackground
            style={{ width: '100%', height: '100%' }}
            resizeMode={'cover'}
            resizeMethod="resize"
            source={{
              uri: resolveLocalUrl(currentProgram.background_image_url),
            }}
          />
        }
      />

      {/* Dashed Circle */}
      <Animatable.View
        ref={timerCircle}
        useNativeDriver={true}
        duration={300}
        animation={'zoomIn'}
        View
        style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', marginBottom: 112 }]}>
        <Animated.View style={{ transform: [{ translateY: timerTranslate }] }}>
          <DashedCircle height={vs(300)} width={vs(300)} />
        </Animated.View>
      </Animatable.View>

      {/* Timer and ProgressCircle */}
      <Animatable.View
        ref={timerCountdown}
        useNativeDriver={true}
        duration={300}
        animation={'zoomIn'}
        style={[
          StyleSheet.absoluteFill,
          { alignItems: 'center', justifyContent: 'center', marginBottom: 112, transform: [{ translateY: timerTranslate }] },
        ]}>
        <Animated.View style={{ transform: [{ translateY: timerTranslate }] }}>
          <AnimatedCircularProgress
            duration={1000}
            width={6.8}
            fill={(elapsed / (workout.duration * 60)) * 100}
            rotation={0}
            size={vs(300)}
            tintColor={globals.styles.colors.colorWhite}
            // ref={(ref) => (this.circularProgress = ref)}
          >
            {(fill) => (
              <View style={styles.timeContainer}>
                <Text style={styles.time}>
                  {Math.floor(elapsed / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(Math.round(elapsed) % 60).toString().padStart(2, '0')}
                </Text>
                {/* {this.state.time - Math.round((this.state.time * fill) / 100) <= 0
                ? this._handleNavigate()
                : null} */}
                <Text style={styles.type}>TOTAL TIME: {workout.duration}:00</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </Animated.View>
      </Animatable.View>

      {/* Header */}
      <SafeAreaView pointerEvents="box-none" style={[StyleSheet.absoluteFill, { zIndex: 5 }]}>
        <Animatable.View
          ref={header}
          useNativeDriver={true}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 24 }}>
            <Text style={{ fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 35, color: globals.styles.colors.colorWhite }}>
              {exercise.name}
            </Text>
          </TouchableOpacity>
          <SvgUri color={globals.styles.colors.colorWhite} uri={resolveLocalUrl(exercise.icon_url)} style={{ marginRight: 24 }} />
        </Animatable.View>
      </SafeAreaView>

      {/* Options popup */}
      <SlideMenu
        ref={optionsPanel}
        height={254}
        zIndex={9}
        onCancel={() => {
          Animated.timing(menuPanelTranslate, {
            toValue: 254,
            duration: 300,
            useNativeDriver: true,
          }).start()
        }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', margin: 24 }}>
          <Walkthrough color={globals.styles.colors.colorBlack} />
          <View style={{ marginHorizontal: 16, width: '100%', flex: 1 }}>
            <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 14 }}>Cardio Walkthrough</Text>
            <Text
              style={{
                fontFamily: globals.fonts.primary.style.fontFamily,
                flexShrink: 1,
                fontSize: 12,
                color: globals.styles.colors.colorGrayDark,
                flexWrap: 'wrap',
              }}>
              Directives while you do your cardio.
            </Text>
          </View>
          <Switch
            style={{ marginLeft: 24 }}
            trackColor={{ false: globals.styles.colors.colorGrayDark, true: currentTrainer.color }}
            thumbColor={Platform.OS === 'android' ? currentTrainer.color : ''}
            ios_backgroundColor={globals.styles.colors.colorGrayDark}
            onValueChange={() => {
              if (!directive) {
                setDirective(walkthrough.directives[currentWalkthroughDirectiveIndex])
              }
              setEnabled((c) => !c)
            }}
            value={enabled}
          />
        </View>
      </SlideMenu>

      {/* Options popup background */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: globals.styles.colors.colorBlackDark,
            opacity: menuPanelTranslate.interpolate({
              inputRange: [0, 254],
              outputRange: [0.5, 0],
            }),
            zIndex: 8,
          },
        ]}
      />

      {/* Quit workout popup */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            zIndex: popupTranslate.interpolate({
              inputRange: [0, 1, 100],
              outputRange: [29, 29, 0],
            }),
          },
        ]}>
        <Animated.View
          style={{
            flex: 1,
            marginHorizontal: 16,
            padding: 32,
            paddingBottom: 24,
            backgroundColor: globals.styles.colors.colorWhite,
            borderRadius: 8,
            opacity: popupTranslate.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 0],
            }),
            shadowColor: globals.styles.colors.colorBlackDark,
            shadowOffset: {
              width: 0,
              height: 0, // pressed ? 2 : 7,
            },
            shadowOpacity: 0.3,
            shadowRadius: 6.27,
            transform: [{ translateY: popupTranslate }],
          }}>
          <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 18, textAlign: 'center' }}>
            Are you sure you want to complete your workout?
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 22 }}>
            <ButtonSquare
              onPress={completeWorkout}
              style={[
                styles.resumeButton,
                { backgroundColor: globals.styles.colors.colorPink, width: (Dimensions.get('window').width - 48 - 48 - 16 - 16) / 2 },
              ]}
              text={'YES'}
              textStyle={styles.resumeButtonText}
            />
            <ButtonSquare
              pressedOpacity={0.5}
              onPress={handleResumeFromQuit}
              style={[
                styles.quitButton,
                { borderColor: globals.styles.colors.colorPink, width: (Dimensions.get('window').width - 48 - 48 - 16 - 16) / 2 },
              ]}
              text={'NO'}
              textStyle={[styles.quitButtonText, { color: globals.styles.colors.colorPink }]}
            />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Quit workout background overlay */}
      <Animated.View
        // pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: globals.styles.colors.colorBlackDark,
            opacity: popupTranslate.interpolate({
              inputRange: [0, 100],
              outputRange: [0.5, 0],
            }),
            zIndex: popupTranslate.interpolate({
              inputRange: [0, 1, 100],
              outputRange: [28, 28, 0],
            }),
          },
        ]}
      />

      {/* Directives info & timer */}
      {directive && enabled && (
        <Animated.View pointerEvents="box-none" style={styles.directiveContainer}>
          <Animatable.View animation="fadeIn" useNativeDriver={true} style={styles.directiveContainerFade}>
            {directive.audio_file_url?.length > 50 && (
              <View style={styles.directivePlayButtonContainer}>
                <Pressable onPress={() => setAutoplayEnabled((c) => !c)}>
                  {autoplayEnabled ? <SoundOn color="#000" /> : <SoundOff color="#000" />}
                </Pressable>
              </View>
            )}
            <Text style={{ textAlign: 'center', fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: vs(25) }}>
              {directive.caption.toUpperCase()}{' '}
              <Text style={{ fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: vs(25), color: currentTrainer.color }}>
                {directive.time_caption.toUpperCase()}
              </Text>
            </Text>
            <View style={{ marginVertical: vs(12), height: 3, width: '100%', backgroundColor: globals.styles.colors.colorGray }}>
              <Animated.View
                style={
                  ([StyleSheet.absoluteFill],
                  {
                    height: 3,
                    backgroundColor: currentTrainer.color,
                    width: `${((elapsed - directive.start_time) / directive.directive_length) * 100}%`,
                  })
                }
              />
            </View>
            <Text style={{ textAlign: 'center', fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: vs(35) }}>
              {Math.floor((elapsed - directive.start_time) / 60)
                .toString()
                .padStart(2, '0')}
              :
              {Math.round((elapsed - directive.start_time) % 60)
                .toString()
                .padStart(2, '0')}
            </Text>
          </Animatable.View>
        </Animated.View>
      )}

      <BottomPanel
        immediate={true}
        zIndex={14}
        ref={bottomPanel}
        gradientColors={[globals.styles.colors.colorWhite, globals.styles.colors.colorWhite]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
          <View style={{ marginLeft: 25, marginTop: 29 }}>
            <Text style={{ fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 25, lineHeight: 25 }}>
              {cardio.cardioType.name}
            </Text>
            <Text style={{ fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 14, marginTop: -2 }}>
              {workout.duration} MINUTES
            </Text>
          </View>
          <View style={{ height: 56, marginTop: 24, flexDirection: 'row', alignItems: 'center' }}>
            <Left color={currentTrainer.color} style={{ marginRight: 16, opacity: 0.5 }} />
            <TouchableOpacity onPress={handlePause}>
              <Pause color={currentTrainer.color} style={{ marginRight: 16 }} />
            </TouchableOpacity>
            <Right color={currentTrainer.color} style={{ marginRight: 24, opacity: 0.5 }} />
          </View>
        </View>
      </BottomPanel>

      <BottomPanel ref={pausePanel} zIndex={15} gradientColors={[globals.styles.colors.colorWhite, globals.styles.colors.colorWhite]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
          <ButtonSquare
            pressedOpacity={0.5}
            onPress={handleQuit}
            style={[styles.quitButton, { borderColor: currentTrainer.color }]}
            text={'QUIT'}
            textStyle={[styles.quitButtonText, { color: currentTrainer.color }]}
          />
          <ButtonSquare
            onPress={handleResume}
            style={[styles.resumeButton, { backgroundColor: currentTrainer.color }]}
            text={'RESUME'}
            textStyle={styles.resumeButtonText}
          />
        </View>
      </BottomPanel>

      <BottomPanel
        ref={exitPanel}
        height={128}
        zIndex={16}
        gradientColors={[globals.styles.colors.colorWhite, globals.styles.colors.colorWhite]}>
        <View>
          <Text style={{ fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 14, textAlign: 'center' }}>
            Are you sure you want to quit workout?
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <ButtonSquare
              pressedOpacity={0.5}
              onPress={() => navigation.navigate('Cardio')}
              style={[styles.resumeButton, { backgroundColor: currentTrainer.color }]}
              text={"Yes, I'm done"}
              textStyle={styles.resumeButtonText}
            />
            <ButtonSquare
              onPress={handleKeepSweating}
              style={[styles.quitButton, { borderColor: currentTrainer.color }]}
              text={'No, keep sweating!'}
              textStyle={[styles.quitButtonText, { color: currentTrainer.color }]}
            />
          </View>
        </View>
      </BottomPanel>

      <View
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          { alignItems: 'flex-start', justifyContent: 'flex-end', marginBottom: 128, marginHorizontal: 24 },
        ]}>
        <Animatable.View
          useNativeDriver={true}
          ref={menuButton}
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: walkthrough ? 'space-between' : 'flex-end',
            alignItems: 'flex-end',
            marginBottom: vs(10),
          }}
          pointerEvents="box-none"
          animation={'slideInUp'}
          duration={450}
          delay={50}>
          {walkthrough && (
            <Pressable
              onPress={() => {
                optionsPanel?.current?.slideInUp(300)
                Animated.timing(menuPanelTranslate, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start()
              }}>
              <Menu color={globals.styles.colors.colorWhite} height={56} width={56} />
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              if (elapsed <= workout.duration * 60) {
                timer.pause()
                setPaused(true)
                setFinishModalShowing(true)
                Animated.timing(popupTranslate, { toValue: 0, duration: 200, useNativeDriver: true }).start()
              } else {
                // Finish for real
                completeWorkout()
              }
            }}>
            <Animatable.View
              useNativeDriver={true}
              ref={finishButton}
              style={{
                height: 48,
                borderRadius: 40,
                paddingHorizontal: 24,
                borderWidth: 2,
                borderColor: globals.styles.colors.colorWhite,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: globals.styles.colors.colorWhite,
                  fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
                  fontSize: 14,
                }}>
                FINISH WORKOUT
              </Text>
            </Animatable.View>
          </Pressable>
        </Animatable.View>
      </View>
    </AndroidBackHandler>
  )
}

const styles = {
  type: {
    fontSize: vs(18),
    marginTop: vs(-20),
    fontFamily: globals.fonts.primary.style.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  time: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: vs(110),
    textAlignVertical: 'bottom',
    color: globals.styles.colors.colorWhite,
  },
  quitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: (Dimensions.get('window').width - 64) / 2,
    borderWidth: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  quitButtonText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
  },
  resumeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: (Dimensions.get('window').width - 64) / 2,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  resumeButtonText: { color: globals.styles.colors.colorWhite, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 16 },
  directiveContainer: {
    flex: 1,
    position: 'absolute',
    height: vs(410),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 112,
    bottom: 0,
    zIndex: 7,
  },
  directiveContainerFade: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 48,
    borderRadius: 8,
    paddingHorizontal: vs(28),
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0, // pressed ? 2 : 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    paddingBottom: vs(12),
    paddingTop: 27,
  },
  directivePlayButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -19,
    left: Dimensions.get('window').width / 2 - 26 - 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    backgroundColor: globals.styles.colors.colorWhite,
  },
}

export default Exercise
