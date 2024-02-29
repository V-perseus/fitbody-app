import React, { useMemo, useState, useRef, useLayoutEffect } from 'react'
import { View, ImageBackground, Animated, StyleSheet, TouchableOpacity, Easing, Platform, Text } from 'react-native'
import { useSelector, shallowEqual } from 'react-redux'
import LinearGradient2 from 'react-native-linear-gradient'
import { OverlayBlend, LinearGradient } from 'react-native-image-filter-kit'
import * as Animatable from 'react-native-animatable'
import { ms } from 'react-native-size-matters/extend'

import ChevronDown from '../../../../assets/images/svg/icon/16px/cheveron/down.svg'
import Cog from '../../../../assets/images/svg/icon/24px/navigation/cog.svg'

import { WeekGoal } from '../components/Week/Goal'
import { Week_Challenge } from '../components/Week/Challenge'
import { WorkoutsHeader } from '../components/WorkoutsHeader/WorkoutsHeader'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'

import { resolveLocalUrl } from '../../../services/helpers'
import globals from '../../../config/globals'

import { setCurrentWorkout } from '../../../data/workout'
import { completedWorkoutsSelector } from '../../../data/workout/selectors'

const Workouts = ({ navigation }) => {
  const programs = useSelector((state) => state.data.workouts.programs, shallowEqual)
  const currentProgramSlug = useSelector((state) => state.data.user.workout_goal)
  const currentProgram = useMemo(() => (programs ? programs[currentProgramSlug] : null), [programs, currentProgramSlug])

  const currWeek = useSelector((state) => state.data.user.meta.programs[currentProgramSlug.toLowerCase()]?.current_week ?? 1)

  const currentTrainer = useSelector((state) => state.data.workouts.currentTrainer)
  const level_id = useSelector((state) => state.data.user.meta.trainers?.[currentTrainer.id]?.level_id)
  const level = useSelector((state) => state.data.workouts.levels?.[level_id])
  const cardioTypes = useSelector((state) => state.data.workouts.cardio_types, shallowEqual)
  const { completionsCount, completions, completionsReversed, workouts, category } = useSelector(completedWorkoutsSelector)

  const [zIndexWatcher, setZIndexWatcher] = useState(5)
  // const downloadsIntroViewed = useSelector((state) => state.data.workouts.downloadInfoViewed) || false

  const downloads = useSelector((state) => state.data.workouts.downloads || [])
  const download = useMemo(
    () => Object.values(downloads).find((d) => d.week === currWeek && d.program === currentProgram.id),
    [currWeek, currentProgram.id, downloads],
  )

  const scrollY = useRef(new Animated.Value(0)).current

  const opacityInterpolation = scrollY.interpolate({
    inputRange: [0, 80, 130],
    outputRange: [0, 0, 1],
  })

  const reverseOpacityInterpolation = scrollY.interpolate({
    inputRange: [0, 80, 130],
    outputRange: [1, 1, 0],
  })

  // useEffect(() => {
  //   const getWeek = async () => {
  //     if (categories.length === 0) {
  //       await dispatch(fetchWeek({ program: currentProgram.id, week_number: currWeek }))
  //     }
  //   }

  //   if (currentProgram) {
  //     getWeek()
  //   }
  // }, [currentProgram, categories, currWeek, dispatch])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderButton onPress={() => navigation.navigate('Categories')} iconColor={globals.styles.colors.colorWhite} />,
      headerTitle: currentProgram?.title,
      headerTitleStyle: {
        fontFamily: globals.fonts.accent.style.fontFamily,
        fontSize: 40,
        color: globals.styles.colors.colorWhite,
        opacity: opacityInterpolation,
      },
      headerRight: () => (
        <HeaderButton
          onPress={() =>
            navigation.navigate('Modals', {
              screen: 'ProgramSettings',
              params: { program: currentProgram, week: currWeek, weekNumber: currWeek },
            })
          }>
          <Cog color={globals.styles.colors.colorWhite} width={24} height={24} />
        </HeaderButton>
      ),
      headerBackground: () => (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: currentTrainer.secondary_color,
            opacity: opacityInterpolation,
            shadowColor: globals.styles.colors.colorBlackDark,
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 8,
          }}>
          {currentProgram && (
            <LinearGradient2 style={StyleSheet.absoluteFill} colors={[currentTrainer.secondary_color, currentTrainer.color]} />
          )}
        </Animated.View>
      ),
    })
  })

  // useEffect(() => {
  //   if (!downloadsIntroViewed) {
  //     dispatch(viewDownloadInfo())
  //     setTimeout(() => {
  //       props.navigation.navigate('Modals', {
  //         screen: 'ConfirmationDialog',
  //         params: {
  //           title: 'Automatic Downloads',
  //           body:
  //             'To optimize your workout experience, the whole week’s workouts will automatically download for offline use each time you open up a new week.\n\nHead to your settings to manage your download preferences.',
  //           yesLabel: 'GOT IT',
  //           noLabel: 'GO TO SETTINGS',
  //           yesHandler: () => {},
  //           noHandler: () => {
  //             props.navigation.navigate('Profile', { screen: 'Downloads' })
  //           },
  //           iconType: 'download',
  //         },
  //       })
  //     }, 250)
  //   }
  // }, [dispatch, downloadsIntroViewed, props.navigation])

  const paddingTopAnim = useRef(new Animated.Value(0)).current

  // const specialEquipment = useSelector((state) => state.data.user.resistance_bands)

  const scrollView = useRef(null)
  const cards = useRef(null)

  const showDownloadInfo = () => {
    navigation.navigate('Modals', {
      screen: 'ConfirmationDialog',
      params: {
        title: 'Automatic Downloads',
        body: 'To optimize your workout experience, the whole week’s workouts will automatically download for offline use each time you open up a new week.\n\nHead to your settings to manage your downloads.',
        yesLabel: 'GOT IT',
        noLabel: 'GO TO SETTINGS',
        yesHandler: () => {},
        noHandler: () => {
          navigation.navigate('Profile', { screen: 'Downloads' })
        },
        iconType: 'download',
      },
    })
  }

  function handleScroll(event) {
    // this swaps z-index so that the program selector is clickable
    // but then is lowered so it slides behind the card on scroll
    const newY = event.nativeEvent.contentOffset.y
    if (newY > 44 && zIndexWatcher === 5) {
      setZIndexWatcher(0)
    } else if (newY <= 44 && zIndexWatcher === 0) {
      setZIndexWatcher(5)
    }
  }

  function deriveCardioTypeFromWorkout(workout) {
    if (workout.cardio.length > 0) {
      const cardioType = workout.cardio.find((c) => c.level_id === level_id)
      return cardioTypes[cardioType.cardio_type_id] || null
    }
    return null
  }

  function handleWeekGoalPress(workout) {
    if (workout.cardio.length > 0) {
      cards.current?.fadeOutDown(100)
      Animated.timing(paddingTopAnim, {
        toValue: 60,
        duration: 100,
        easing: Easing.bounce, // Like a ball
        useNativeDriver: true,
      }).start(() => {
        setCurrentWorkout({ workoutId: workout.id, currentProgram })
        navigation.navigate('Cardio', {
          program: currentProgram,
          week: currWeek,
          workout,
          category,
        })
        paddingTopAnim?.setValue(0)
        cards.current?.fadeInUp(0)
      })
    } else {
      cards.current?.fadeOutDown(100)
      Animated.timing(paddingTopAnim, {
        toValue: 60,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentWorkout({ workoutId: workout.id, currentProgram })
        navigation.navigate('Overview', {
          program: currentProgram,
          week: currWeek,
          workout,
          category,
        })
        setTimeout(() => {
          paddingTopAnim?.setValue(0)
          cards.current?.fadeInUp(0)
        }, 500)
      })
    }
  }

  if (currentProgram) {
    return (
      <>
        <FocusAwareStatusBar barStyle="light-content" />
        <OverlayBlend
          style={styles.flex}
          dstImage={
            <LinearGradient
              style={styles.flex}
              colors={[
                currentTrainer.secondary_color,
                currentTrainer.color,
                currentTrainer.color,
                globals.styles.colors.colorWhite,
                globals.styles.colors.colorWhite,
              ]}
              start={{ y: '100h', x: '0w' }}
              end={{ x: 0, y: '0h' }}
              stops={[0, 0.35, 0.7, 0.7, 1]}
            />
          }
          resizeCanvasTo={'srcImage'}
          srcImage={
            <ImageBackground
              style={styles.fill}
              resizeMode={'cover'}
              resizeMethod="resize"
              source={{
                uri: resolveLocalUrl(currentProgram.background_image_url),
              }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 192,
                  opacity: reverseOpacityInterpolation,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  zIndex: zIndexWatcher,
                }}>
                <TouchableOpacity
                  style={styles.center}
                  onPress={() => {
                    navigation.navigate('Modals', { screen: 'ProgramSelector' })
                  }}>
                  <View style={{ height: 80 }}>
                    <Text style={styles.programName}>{currentProgram.title?.toUpperCase()}</Text>
                    <Text style={styles.trainerName}>{`WITH ${currentTrainer.name?.toUpperCase()}`}</Text>
                  </View>
                  <ChevronDown color={globals.styles.colors.colorWhite} style={styles.chevronDown} />
                </TouchableOpacity>
              </Animated.View>
              {/* panel scrollable container */}
              <Animated.ScrollView
                ref={scrollView}
                style={{ flex: 1, paddingTop: 212, transform: [{ translateY: paddingTopAnim }] }}
                showsVerticalScrollIndicator={false}
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
                )}
                scrollEventThrottle={16}>
                {/* panel */}
                <View style={styles.panelContainer}>
                  {/* panel header */}
                  <WorkoutsHeader
                    cardsRef={cards}
                    navigation={navigation}
                    category={category}
                    workouts={workouts}
                    completedCount={completionsCount}
                    checkColor={currentTrainer.color}
                  />
                  {/* panel list items container */}
                  <Animatable.View ref={cards} animation="fadeInUp" duration={300} useNativeDriver>
                    {workouts.map((workout) => {
                      return (
                        <WeekGoal
                          workout={workout}
                          currentTrainer={currentTrainer}
                          currentProgram={currentProgram}
                          level={level}
                          current_week={currWeek}
                          category={category}
                          categoryImage={{ uri: resolveLocalUrl(category?.image) }}
                          showCheckmarks={false}
                          key={workout.id}
                          progress={download?.progress ?? 0}
                          downloading={workout.downloading}
                          downloaded={workout.downloaded}
                          completions={completions}
                          id={workout.id}
                          title={workout.title}
                          subtitle={`${workout.duration} Minutes`}
                          titleStyle={{ color: currentTrainer.color }}
                          image={{ uri: resolveLocalUrl(workout.image_url) }}
                          cardioInfo={deriveCardioTypeFromWorkout(workout)}
                          programColor={currentTrainer.color}
                          onDownloadPress={showDownloadInfo}
                          completion={completionsReversed.find((x) => x.workout_id === workout.id)}
                          onPress={() => handleWeekGoalPress(workout)}
                        />
                      )
                    })}
                  </Animatable.View>
                  {!currentProgram.hide_challenges ? (
                    <View style={styles.challengeButtonContainer}>
                      <Week_Challenge onPress={() => navigation.navigate('Challenges', { program: currentProgram })} />
                    </View>
                  ) : (
                    <View style={styles.verticalSpacer} />
                  )}
                </View>
              </Animated.ScrollView>
            </ImageBackground>
          }
        />
      </>
    )
  } else {
    return <View />
  }
}

const styles = {
  challengeButtonContainer: {
    paddingHorizontal: 27,
    marginTop: 24,
    borderTopWidth: 2,
    borderTopColor: globals.styles.colors.colorGrayLight,
    paddingVertical: 24,
  },
  verticalSpacer: { height: 24 },
  flex: { flex: 1 },
  fill: { width: '100%', height: '100%' },
  center: { alignItems: 'center', justifyContent: 'center' },
  programName: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: ms(71),
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    lineHeight: 71,
  },
  trainerName: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    marginTop: -15,
  },
  chevronDown: { marginTop: 8 },
  rowItemsCenter: { flexDirection: 'row', alignItems: 'center' },
  categoryTitle: {
    marginLeft: 8,
    marginTop: Platform.select({ ios: 5, android: 0 }),
    textAlign: 'left',
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 30,
  },
  panelContainer: {
    flex: 1,
    // minHeight: 400,
    zIndex: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingBottom: 212,
  },
  panelHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    height: 65,
    borderBottomColor: globals.styles.colors.colorGray,
    borderBottomWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}

export default Workouts
