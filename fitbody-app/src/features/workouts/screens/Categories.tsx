import React, { useEffect, useCallback, useState, useRef } from 'react'
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { CompositeNavigationProp, NavigationProp, useFocusEffect } from '@react-navigation/native'
import { SharedElement } from 'react-navigation-shared-element'
import { shallowEqual } from 'react-redux'
import LinearGradient2 from 'react-native-linear-gradient'
import { OverlayBlend, LinearGradient } from 'react-native-image-filter-kit'
import * as Animatable from 'react-native-animatable'
import moment from 'moment'
import { ms } from 'react-native-size-matters/extend'
import REAnimated, {
  useSharedValue,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'

// assets
import ChevronDown from '../../../../assets/images/svg/icon/16px/cheveron/down.svg'
import Cog from '../../../../assets/images/svg/icon/24px/navigation/cog.svg'

// components
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import { CategoriesLoader } from '../components/CategoriesLoader'
import { Week_Challenge } from '../components/Week/Challenge'
import { Week_Header } from '../components/Week/Header'
import { WeekGoal } from '../components/Week/Goal'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// services
import { resolveLocalUrl } from '../../../services/helpers'
import { useInit } from '../../../services/hooks/useInit'
import { useAppSelector } from '../../../store/hooks'

// data
import { updateUserProfile, updateWeekDisclaimersViewed, updateCurrentWeek } from '../../../data/user'
import { categoriesSelector, currentProgramFromWorkoutGoalSelector, currentProgramWeekSelector } from '../../../data/workout/selectors'
import {
  fetchTrainersPrograms,
  fetchWeek,
  setCurrentCategory,
  fetchCompletions,
  fetchChallenges,
  clearWorkoutProgress,
} from '../../../data/workout'

// styles
import globals from '../../../config/globals'

// types
import { ICategory } from '../../../data/workout/types'
import { MainStackParamList, WorkoutsStackParamList } from '../../../config/routes/routeTypes'

type WeekPopupContentType = {
  title: string
  body: string
}

interface ICategoriesProps {
  navigation: CompositeNavigationProp<NavigationProp<MainStackParamList>, NavigationProp<WorkoutsStackParamList>>
}
const Categories: React.FC<ICategoriesProps> = ({ navigation }) => {
  const completions = useAppSelector((state) => state.data.workouts.completions, shallowEqual) ?? []
  const user = useAppSelector((state) => state.data.user)
  const userId = useAppSelector((state) => state.data.user.id)
  const isOnline = useAppSelector((state) => state.offline.online)
  const progress = useAppSelector((state) => state.data.workouts.progress)
  const currentMonth = useAppSelector((state) => state.data.workouts.challengeMonth?.month)
  const currentYear = useAppSelector((state) => state.data.workouts.challengeMonth?.year)
  const workoutGoal = useAppSelector((state) => state.data.user.workout_goal)
  const currentTrainer = useAppSelector((state) => state.data.workouts.currentTrainer, shallowEqual)
  const currentProgram = useAppSelector(currentProgramFromWorkoutGoalSelector)
  const current_week = useAppSelector(currentProgramWeekSelector)
  const categories = useAppSelector(categoriesSelector)

  const [zIndexWatcher, setZIndexWatcher] = useState(5)
  const [weeksPopupContent, setWeeksPopupContent] = useState<WeekPopupContentType | null>(null) // {title: string, body: string}

  const scrollOffset = useSharedValue(0)

  const down = useRef<boolean | null>(null)
  const scrollView = useRef<REAnimated.ScrollView>(null)
  const cards = useRef<Animatable.View & View>(null)
  const panel = useRef<Animatable.View & View>(null)

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [0, 80, 130], [0, 0, 1])
    return { opacity }
  })

  const reverseAnimatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [0, 60, 130], [1, 1, 0])
    return { opacity }
  })

  const programCategories = currentProgram?.categories
    .slice()
    .filter((c) => Object.keys(categories).length === 0 || categories?.[c.id]?.length > 0)
    .sort((a, b) => a.sort_order - b.sort_order)

  useEffect(() => {
    if (progress) {
      navigation.navigate('Modals', {
        screen: 'ConfirmationDialog',
        params: {
          yesLabel: 'YES!',
          noLabel: 'NO THANKS!',
          backOnYes: false,
          backOnNo: true,
          yesHandler: () => {
            navigation.navigate('SingleWorkout', { continuePrevious: true })
          },
          noHandler: () => {
            clearWorkoutProgress()
          },
          title: 'You had a workout in progress.\nWould you like to resume?',
        },
      })
    }
  }, [])

  useInit(fetchCompletions)
  useInit(fetchTrainersPrograms)

  useEffect(() => {
    const now = moment()
    const year = now.year()
    const month = now.month() + 1

    if (year !== currentYear || month !== currentMonth) {
      fetchChallenges(now.format('YYYY-MM-DD'))
    }
  }, [currentMonth, currentYear])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          onPress={() => navigation.navigate('ProgramDetails', { fromCategories: true, slug: currentProgram.slug })}
          iconColor={globals.styles.colors.colorWhite}
        />
      ),
      headerRight: currentProgram
        ? () => (
            <HeaderButton
              onPress={() =>
                navigation.navigate('Modals', {
                  screen: 'ProgramSettings',
                  params: { program: currentProgram, weekNumber: current_week },
                })
              }>
              <Cog color={globals.styles.colors.colorWhite} width={24} height={24} />
            </HeaderButton>
          )
        : null,
      headerTitle: () => (
        <REAnimated.Text
          style={[
            { fontFamily: globals.fonts.accent.style.fontFamily, fontSize: 40, color: globals.styles.colors.colorWhite },
            animatedHeaderStyle,
          ]}>
          {currentProgram?.title}
        </REAnimated.Text>
      ),
      headerBackground: () => (
        <REAnimated.View
          pointerEvents={'none'}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: currentProgram?.color_secondary,
              shadowColor: globals.styles.colors.colorBlackDark,
              shadowOpacity: 1,
              shadowRadius: 15,
              elevation: 18,
            },
            animatedHeaderStyle,
          ]}>
          {currentProgram && currentTrainer && (
            <LinearGradient2 style={StyleSheet.absoluteFill} colors={[currentTrainer.secondary_color, currentTrainer.color]} />
          )}
        </REAnimated.View>
      ),
    })
  })

  const getWeek = async () => {
    if (Object.keys(categories).length === 0 && isOnline) {
      fetchWeek({ program: currentProgram.id, week_number: current_week })
    }
  }

  useEffect(() => {
    if (currentProgram && current_week) {
      getWeek()

      if (cards.current && down.current) {
        cards.current!.fadeInUp?.(350)
      }
    }
  }, [currentTrainer, currentProgram, current_week, isOnline])

  useFocusEffect(
    useCallback(() => {
      const up = async () => {
        if (cards.current && down.current) {
          await cards.current!.fadeInUp?.(350)
        }
      }
      up()
    }, []),
  )

  const checkForWeeksDisclaimer = () => {
    const meta = (currentProgram?.week_meta || []).find((wm) => wm.week_id === current_week)
    if (!meta || currentProgram.disclaimers.length < 1) {
      return
    }
    const disclaimer_id = meta.disclaimer_id
    const disclaimer_slug = `${currentProgram.slug}_${disclaimer_id}`
    if (user.week_disclaimers_viewed?.[disclaimer_slug]) {
      return
    }
    const disclaimer = currentProgram.disclaimers.find((d) => d.id === disclaimer_id)
    if (disclaimer) {
      setTimeout(
        () =>
          navigation.navigate('Modals', {
            screen: 'Disclaimer',
            params: {
              title: disclaimer.title,
              body: disclaimer.text,
              approvalRequired: false,
              acceptHandler: () => {
                updateWeekDisclaimersViewed(disclaimer_slug)
                navigation.navigate('Categories')
              },
            },
          }),
        750,
      )
    }
  }

  const handleInitialPopups = () => {
    const slug = workoutGoal?.toLowerCase()
    const hasBeenSelected = slug ? user.meta?.programs[slug]?.program_selected : false
    // if program requires initial week selection and has not been viewed before
    if (
      currentProgram?.week_selection_required &&
      currentProgram?.week_selection_title &&
      currentProgram?.week_selection_text &&
      !hasBeenSelected
    ) {
      // show weeks selector as popup by setting weeksPopupContent
      setTimeout(() => {
        setWeeksPopupContent({
          title: currentProgram?.week_selection_title!,
          body: currentProgram?.week_selection_text!,
        })
      }, 500)
    } else {
      // if program does not require initial week selection but has not been viewed before, set it as viewed
      if (!hasBeenSelected && slug) {
        const newUserData = {
          id: userId,
          meta: {
            ...user.meta,
            programs: {
              ...user.meta?.programs,
              [slug]: {
                ...user.meta?.programs[slug],
                program_selected: true,
              },
            },
          },
        }
        updateUserProfile(newUserData)
      }
      // and check for week based disclaimer popups
      checkForWeeksDisclaimer()
    }
  }

  // Weekly popups
  useEffect(() => {
    handleInitialPopups()
  }, [current_week, workoutGoal])

  useFocusEffect(
    useCallback(() => {
      // this is to ensure that the SharedElement transistion looks correct
      scrollView.current?.scrollTo({ y: 0 })
    }, []),
  )

  const createNewUser = (wk: number) => {
    const slug = workoutGoal?.toLowerCase()
    if (!slug) {
      return {
        id: userId,
        workout_goal: workoutGoal,
        meta: {
          ...user.meta,
          programs: {
            ...user.meta?.programs,
          },
        },
      }
    }
    return {
      id: userId,
      workout_goal: workoutGoal,
      meta: {
        ...user.meta,
        programs: {
          ...user.meta?.programs,
          [slug]: {
            ...user.meta?.programs[slug],
            current_week: wk,
            program_selected: true,
          },
        },
      },
    }
  }

  const setCurrentWeek = useCallback(
    (wk: number) => {
      cards.current?.fadeOutDown?.(350).then(() => {
        cards.current?.fadeInUp?.(200)
        updateCurrentWeek({ week: wk })
      })
      const newUserData = createNewUser(wk)
      updateUserProfile(newUserData)
    },
    [workoutGoal, userId],
  )

  const setCurrentWeekFromPopup = useCallback(
    (wk: number) => {
      setWeeksPopupContent(null)
      const newUserData = createNewUser(wk)
      updateUserProfile(newUserData)

      setTimeout(() => {
        checkForWeeksDisclaimer()
      }, 300)
    },
    [workoutGoal, userId],
  )

  const onPickWeek = useCallback(
    (val: number) => {
      if (weeksPopupContent) {
        setCurrentWeekFromPopup(val + 1)
      } else {
        setCurrentWeek(val + 1)
      }
    },
    [setCurrentWeek, setCurrentWeekFromPopup, weeksPopupContent],
  )

  function onWeekHeaderPopupCancelled() {
    setTimeout(() => {
      checkForWeeksDisclaimer()
    }, 300)
  }

  const onPressNext = useCallback(() => {
    setCurrentWeek(current_week + 1)
  }, [current_week, setCurrentWeek])

  const onPressPrevious = useCallback(() => {
    setCurrentWeek(current_week - 1)
  }, [current_week, setCurrentWeek])

  function handleOpenProgramSelector() {
    navigation.navigate('Modals', { screen: 'ProgramSelector' })
  }

  function handleChallengePress() {
    navigation.navigate('Challenges', { program: currentProgram })
  }

  const onGoalPress = (c: ICategory) => {
    if (categories?.[c.id]?.length > 0) {
      scrollView.current?.scrollTo({ y: 0 })
      setCurrentCategory({ categoryId: c.id })
      cards.current?.fadeOutDown?.(350).then(() => {
        down.current = true
        navigation.navigate('Workouts')
      })
    }
  }

  const scrollHandleWorklet = (newY: number) => {
    // this swaps z-index so that the program selector is clickable
    // but then is lowered so it slides behind the card on scroll
    if (newY > 36 && zIndexWatcher === 5) {
      setZIndexWatcher(0)
    } else if (newY <= 36 && zIndexWatcher === 0) {
      setZIndexWatcher(5)
    }
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y
    },
  })

  useDerivedValue(() => {
    runOnJS(scrollHandleWorklet)(scrollOffset.value)
  })

  const getCompletions = (cat: ICategory) => {
    const reversed = [...completions].reverse()
    const filteredCompletions = categories?.[cat.id]?.map((w) => reversed.find((c) => c.workout_id === w)).filter((c) => c && !c.hidden)
    const completedCount = filteredCompletions?.length ?? 0
    return completedCount
  }

  if (currentProgram && currentTrainer) {
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
              resizeMode="cover"
              resizeMethod="resize"
              source={{
                uri: resolveLocalUrl(currentProgram.background_image_url),
              }}>
              <REAnimated.View
                style={[
                  {
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: 192,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    zIndex: zIndexWatcher,
                  },
                  reverseAnimatedHeaderStyle,
                ]}>
                <TouchableOpacity style={styles.center} onPress={handleOpenProgramSelector}>
                  <SharedElement id={'bg_header_text'}>
                    <View style={{ height: 80 }}>
                      <Text style={styles.programName} testID="program_name">
                        {currentProgram.title?.toUpperCase()}
                      </Text>
                      <Text style={styles.trainerName}>{`WITH ${currentTrainer?.name?.toUpperCase()}`}</Text>
                    </View>
                  </SharedElement>
                  <ChevronDown color={globals.styles.colors.colorWhite} style={styles.chevronDown} />
                </TouchableOpacity>
              </REAnimated.View>
              <REAnimated.ScrollView
                ref={scrollView}
                style={styles.animatedScrollview}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                testID="category_scrollview"
                scrollEventThrottle={16}>
                <Animatable.View ref={panel} style={styles.panel} useNativeDriver>
                  <Week_Header
                    showAllWeeks={currentProgram.all_weeks_available}
                    showRounds={!currentProgram.hide_rounds}
                    onPickWeek={onPickWeek}
                    round={Math.ceil(current_week / 12)}
                    week={current_week}
                    additionalContent={weeksPopupContent || undefined}
                    onPressNext={onPressNext}
                    onPressPrevious={onPressPrevious}
                    onClose={onWeekHeaderPopupCancelled}
                    currentProgram={currentProgram}
                  />
                  <Animatable.View ref={cards} useNativeDriver>
                    {programCategories.map((c, index) => {
                      const image = { uri: resolveLocalUrl(c.image) }

                      return (
                        <WeekGoal
                          key={`category_card_${index}`}
                          showCheckmarks={true}
                          downloaded={categories?.[c.id]?.length > 0}
                          image={image}
                          categoryImage={image}
                          title={c.title}
                          category={c}
                          workoutCount={categories?.[c.id]?.length ?? 0}
                          completedCount={getCompletions(c)}
                          programColor={currentTrainer.color}
                          currentTrainer={currentTrainer}
                          subtitle={
                            categories?.[c.id] ? `${categories?.[c.id]?.length} Session${categories?.[c.id]?.length !== 1 ? 's' : ''}` : ' '
                          }
                          onPress={() => onGoalPress(c)}
                        />
                      )
                    })}
                  </Animatable.View>
                  {!currentProgram.hide_challenges ? (
                    <View style={styles.challengeButtonContainer}>
                      <Week_Challenge onPress={handleChallengePress} />
                    </View>
                  ) : (
                    <View style={styles.fillHeight} />
                  )}
                </Animatable.View>
              </REAnimated.ScrollView>
            </ImageBackground>
          }
        />
      </>
    )
  } else {
    return <CategoriesLoader />
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  relative: { position: 'relative' },
  fill: { width: '100%', height: '100%' },
  center: { alignItems: 'center', justifyContent: 'center' },
  programName: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: ms(71),
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    lineHeight: ms(71),
  },
  trainerName: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    marginTop: -15,
  },
  chevronDown: { marginTop: 8 },
  animatedScrollview: { flex: 1, paddingTop: 212 },
  panel: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: globals.styles.colors.colorWhite,
    paddingBottom: 212,
  },
  challengeButtonContainer: {
    paddingHorizontal: 27,
    marginTop: 24,
    borderTopWidth: 2,
    borderTopColor: globals.styles.colors.colorGrayLight,
    paddingVertical: 24,
  },
  fillHeight: { height: 24 },
})

export default Categories
