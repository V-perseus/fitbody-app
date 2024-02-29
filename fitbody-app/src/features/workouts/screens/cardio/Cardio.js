import React, { useEffect, useMemo, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import { useSelector } from 'react-redux'
import LinearGradient2 from 'react-native-linear-gradient'
import { OverlayBlend, LinearGradient } from 'react-native-image-filter-kit'
import { SvgUri } from 'react-native-svg'
import * as Animatable from 'react-native-animatable'
import moment from 'moment'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'

import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

import Info from '../../../../../assets/images/svg/icon/24px/info.svg'
import TipsIcon from '../../../../../assets/images/svg/icon/24px/tips.svg'

import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import globals from '../../../../config/globals'

import { resolveLocalUrl } from '../../../../services/helpers'

import { setCurrentWorkout, submitCompletion, workoutStarted } from '../../../../data/workout'

const Cardio = (props) => {
  const currentProgram = useSelector((state) => state.data.workouts.currentProgram)

  const workout = useSelector((state) => state.data.workouts.currentWorkout)

  const categoryId = useSelector((state) => state.data.workouts.currentCategory)
  const category = useMemo(() => currentProgram.categories?.find((c) => c.id === categoryId), [categoryId, currentProgram])
  const currentTrainer = useSelector((state) => state.data.workouts.currentTrainer)
  const level_id = useSelector((state) => state.data.user.meta.trainers?.[currentTrainer.id]?.level_id)
  const level = useSelector((state) => state.data.workouts.levels?.[level_id])

  const current_week = useSelector((state) => state.data.user.meta.programs[currentProgram?.slug?.toLowerCase()]?.current_week) ?? 1

  const cardio_exercises = useSelector((state) => state.data.workouts.cardio_exercises)

  const cardio_type = workout.cardio.find((c) => c.level_id === level_id)

  const [lowerInfoButtonZindex, setLowerInfoButtonZindex] = useState(false)
  const [manualInput, setManualInput] = useState('')

  const fadeAnim = useRef(new Animated.Value(1)).current
  const fadeAnim2 = useRef(new Animated.Value(0.7)).current
  const fadeTop = useRef(new Animated.Value(0)).current

  const scrollView = useRef(null)
  const cards = useRef(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const opacityInterpolation = scrollY.interpolate({
    inputRange: [0, 140, 190],
    outputRange: [0, 0, 1],
  })

  useEffect(() => {
    function onTooltipPress() {
      props.navigation.navigate('Tooltips', { screen: 'Tooltip', params: { name: 'cardio', openedManually: true } })
    }

    props.navigation.setOptions({
      headerTransparent: true,
      headerLeft: ({ navigation }) => (
        <HeaderButton onPress={() => props.navigation.goBack()} iconColor={globals.styles.colors.colorWhite} />
      ),
      headerRight: () => (
        <HeaderButton onPress={onTooltipPress}>
          <TipsIcon color={globals.styles.colors.colorWhite} />
        </HeaderButton>
      ),
      // headerTitle: category?.title,
      headerTitleStyle: {
        fontFamily: globals.fonts.secondary.style.fontFamily,
        fontSize: 25,
        color: globals.styles.colors.colorWhite,
        opacity: opacityInterpolation,
      },
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
          {currentProgram && (
            <LinearGradient2 style={StyleSheet.absoluteFill} colors={[currentTrainer.secondary_color, currentTrainer.color]} />
          )}
        </Animated.View>
      ),
    })
  })

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

  function handleScroll(event) {
    const newY = event.nativeEvent.contentOffset.y
    if (newY < 20 && lowerInfoButtonZindex) {
      setLowerInfoButtonZindex(false)
    } else if (newY > 20 && !lowerInfoButtonZindex) {
      setLowerInfoButtonZindex(true)
    }
  }

  const toGuidanceScreen = () => {
    // bump this to the back of the event loop since it's
    // called from within a modal screen
    setTimeout(() => {
      props.navigation.navigate('Guidance', { screen: 'GuidanceCategories' })
    }, 400)
  }

  function handleCardioInfoPress() {
    props.navigation.navigate('Modals', {
      screen: 'ConfirmationDialog',
      params: {
        showCloseButton: true,
        yesLabel: 'VIEW GUIDANCE SECTION',
        noLabel: 'KEEP CHECK',
        hideNoButton: true,
        yesHandler: toGuidanceScreen,
        title: cardio_type.cardioType.name,
        body: cardio_type.cardioType.description,
      },
    })
  }

  function createManualCompletion() {
    if (!manualInput.trim()) {
      return
    }

    const completion = {
      server: {
        [workout.is_challenge ? 'challenge_id' : 'workout_id']: workout.id,
        manual: true,
        time: Number(manualInput) * 60,
        date: moment().format('YYYY-MM-DD'),
        meta: { circuits: [{ circuit_title: 'Manual', time: Number(manualInput) * 60 }], level_id: level.id },
      },
      local: {
        [workout.is_challenge ? 'challenge_id' : 'workout_id']: workout.id,
        time: Number(manualInput) * 60,
        date: moment().format('YYYY-MM-DD'),
        meta: { circuits: [{ circuit_title: 'Manual', time: Number(manualInput) * 60 }], level_id: level.id },
        hidden: false,
        manual: true,
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

    props.navigation.navigate('Complete', {
      program: currentProgram,
      workout,
      exercise: null,
      category,
      elapsed: Number(manualInput) * 60,
      timings: [{ circuit_title: 'Manual', time: Number(manualInput) * 60, elapsed: Number(manualInput) * 60 }],
    })
  }

  if (currentProgram) {
    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={20}
        style={{ flex: 1, position: 'relative', backgroundColor: globals.styles.colors.colorWhite }}>
        <FocusAwareStatusBar barStyle="light-content" />
        {/* <OverlayBlend
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
              style={styles.imageBackground}
              resizeMode={'cover'}
              resizeMethod="resize"
              source={{
                uri: resolveLocalUrl(currentProgram.background_image_url),
              }}
            />
          }
        /> */}
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: 300,
            zIndex: 0,
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
            style={{ height: 300 }}
            dstImage={
              <LinearGradient
                style={{ height: 300, opacity: 1 }}
                colors={[currentTrainer.secondary_color, currentTrainer.color]}
                start={{ y: '100h', x: '0w' }}
                end={{ x: 0, y: '0h' }}
                stops={[0, 1]}
              />
            }
            resizeCanvasTo={'srcImage'}
            srcImage={
              <Image
                style={{
                  opacity: 1,
                  width: '100%',
                  height: 300,
                }}
                resizeMode={'cover'}
                resizeMethod="resize"
                source={{
                  uri: resolveLocalUrl(workout.image_url),
                }}
              />
            }
          />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: 300,
            zIndex: 0,
            opacity: fadeAnim2,
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
            colors={[currentTrainer.secondary_color, currentTrainer.color]}
            start={{ y: '100h', x: '0w' }}
            end={{ x: 0, y: '0h' }}
            stops={[0, 1]}
          />
        </Animated.View>
        {/* Cardio type info section */}

        <View style={[styles.cardioTypeContainer, { zIndex: lowerInfoButtonZindex ? 0 : 20 }]}>
          <Text style={styles.cardioTypeTitle}>{category.title.toUpperCase()}</Text>
          <View style={styles.cardioTypeRow}>
            <Text style={styles.cardioTypeName}>{cardio_type.cardioType.name}</Text>
            <Pressable onPress={handleCardioInfoPress}>
              <Info color={globals.styles.colors.colorWhite} />
            </Pressable>
          </View>
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollView}
          style={{ flex: 1, zIndex: 0, paddingTop: 272, transform: [{ translateY: fadeTop }] }}
          contentContainerStyle={{ alignItems: 'center' }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrollY,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
              listener: handleScroll,
            },
          )}>
          <View style={styles.scrollViewInnerContainer}>
            <View style={styles.scrollViewHeaderContainer}>
              <View>
                <Text style={styles.minutes}>{workout.duration} MINUTES</Text>
                <Text style={styles.recommended}>RECOMMENDED TIME</Text>
              </View>
              <TouchableOpacity style={styles.levelButton} onPress={() => props.navigation.navigate('Level', { from: 'overview' })}>
                <Text style={styles.levelTitle}>{level.title.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: globals.fonts.primary.style.fontFamily,
                fontSize: 12,
                marginTop: 13,
                marginBottom: 20,
              }}>
              CHOOSE YOUR CARDIO
            </Text>
            <Animatable.View ref={cards} animation="fadeInUp" duration={350} useNativeDriver>
              <View style={styles.cardContainer}>
                {Object.keys(cardio_exercises)
                  .map((x) => cardio_exercises[x])
                  .map((exercise, index) => (
                    <Pressable
                      key={`${index}_cardio`}
                      onPress={() => {
                        Animated.stagger(100, [
                          Animated.parallel([
                            Animated.timing(fadeAnim, {
                              toValue: 0,
                              duration: 300,
                              useNativeDriver: true,
                            }),
                            Animated.timing(fadeAnim2, {
                              toValue: 0,
                              duration: 300 * 0.7,
                              useNativeDriver: true,
                            }),
                          ]),
                          Animated.timing(fadeTop, {
                            toValue: Dimensions.get('window').height - 272,
                            duration: 300,
                            useNativeDriver: true,
                          }),
                        ]).start(() => {
                          // workoutStarted just for segment analytics
                          workoutStarted({
                            ...workout,
                            level: level.title,
                          })
                          setCurrentWorkout({ workoutId: workout.id, currentProgram })
                          props.navigation.navigate('GetReady', { exercise })
                          setTimeout(() => {
                            fadeTop.setValue(0)
                            fadeAnim.setValue(1)
                            fadeAnim2.setValue(0.7)
                          }, 750)
                        })
                      }}
                      style={({ pressed }) => styles.container(pressed)}>
                      <View style={styles.card}>
                        <SvgUri color={globals.styles.colors.colorBlackDark} uri={resolveLocalUrl(exercise.icon_url)} />
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                      </View>
                    </Pressable>
                  ))}
              </View>
            </Animatable.View>
            <View style={styles.challengeButtonContainer}>
              <Text style={styles.challengeTitle}>ALREADY COMPLETED YOUR WORKOUT?</Text>
              <Text style={styles.challengeSubtitle}>Manually add your workout time</Text>
              <View style={styles.manualInputContainer}>
                <TextInput
                  placeholderTextColor={globals.styles.colors.colorGrayDark}
                  placeholder="Total Minutes"
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={setManualInput}
                  onFocus={() => scrollView.current?.scrollTo({ y: 0, animated: true })}
                  style={styles.manualTextInput}
                />
                <View style={styles.addTimeButtonContainer}>
                  <Pressable onPress={createManualCompletion}>
                    <Text style={styles.addTimeText}>ADD TIME</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    )
  } else {
    return <View />
  }
}

const styles = {
  container: (pressed) => ({
    width: (Dimensions.get('window').width - 64) / 2,
    height: ((Dimensions.get('window').width - 64) / 2 / 175) * 132,
    marginBottom: 16,
    borderRadius: 7.7,
    flexDirection: 'column',
    marginHorizontal: 8,
    backgroundColor: globals.styles.colors.colorWhite,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 0, // pressed ? 2 : 7,
    },
    shadowOpacity: pressed ? 0.08 : 0.15,
    shadowRadius: pressed ? 3.84 : 6.27,

    elevation: pressed ? 5 : 10,
  }),
  imageBackground: { width: '100%', height: '100%' },
  scrollViewInnerContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingBottom: 272,
  },
  scrollViewHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    height: 87,
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minutes: { fontFamily: globals.fonts.primary.boldStyle.fontFamily, fontSize: 20 },
  recommended: { fontFamily: globals.fonts.primary.style.fontFamily, fontSize: 12, marginTop: -3 },
  cardContainer: { marginHorizontal: 14, flexDirection: 'row', flexWrap: 'wrap' },
  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: { marginTop: 6, fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 20, lineHeight: 20 },
  levelButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorBlack,
  },
  levelTitle: { color: globals.styles.colors.colorBlack, fontSize: 12, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily },
  challengeButtonContainer: {
    paddingHorizontal: 27,
    marginTop: 24,
    borderTopWidth: 2,
    borderTopColor: globals.styles.colors.colorGrayLight,
    paddingVertical: 24,
  },
  challengeTitle: { textAlign: 'center', fontFamily: globals.fonts.secondary.style.fontFamily, fontSize: 25 },
  challengeSubtitle: {
    textAlign: 'center',
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 16,
    color: globals.styles.colors.colorGrayDark,
  },
  manualInputContainer: { flexDirection: 'row', marginTop: 21, marginBottom: 10 },
  grayscale: {
    opacity: 1,
    position: 'relative',
  },
  grayscaleAnimatedImage: {
    opacity: 1,
    width: '100%',
    height: 300,
  },
  cardioTypeContainer: {
    position: 'absolute',
    top: 200,
    // bottom: 40,
    left: 22,
  },
  cardioTypeTitle: { color: globals.styles.colors.colorWhite, fontSize: 16, fontFamily: globals.fonts.primary.semiboldStyle.fontFamily },
  cardioTypeRow: { flexDirection: 'row', alignItems: 'center' },
  cardioTypeName: {
    color: globals.styles.colors.colorWhite,
    fontSize: 35,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    letterSpacing: 0,
    marginRight: 4,
  },
  manualTextInput: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorBlack,
    fontSize: 12,
    flex: 1,
    height: 40,
    borderRadius: 24,
    paddingHorizontal: 16,
    backgroundColor: globals.styles.colors.colorGrayLight,
  },
  addTimeButtonContainer: {
    marginLeft: -40,
    height: 40,
    borderRadius: 24,
    backgroundColor: globals.styles.colors.colorPink,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addTimeText: { fontFamily: globals.fonts.primary.semiboldStyle.fontFamily, fontSize: 12, color: globals.styles.colors.colorWhite },
}

export default Cardio
