import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { OverlayBlend, LinearGradient } from 'react-native-image-filter-kit'
import { default as LG } from 'react-native-linear-gradient'
import { useHeaderHeight } from '@react-navigation/elements'
import * as Animatable from 'react-native-animatable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { vs, ms } from 'react-native-size-matters/extend'
import { SvgUri } from 'react-native-svg'
import moment from 'moment'

// Componenets
import { EnjoyModal, Result } from '../../../components/EnjoyModal'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'
import AndroidBackHandler from '../../../components/AndroidBackHandler'

// Assets
import ChevronRight from '../../../../assets/images/svg/icon/24px/circle/cheveron-right.svg'
import Close from '../../../../assets/images/svg/icon/40px/circle/close.svg'
import TipsIcon from '../../../../assets/images/svg/icon/24px/tips.svg'

// Utils
import { openEmail } from '../../../config/utilities'
import globals from '../../../config/globals'
import { resolveLocalUrl } from '../../../services/helpers'

// Data
import { getActivities, getMoods } from '../../../data/journal'
import { moodsSelector, activitiesSelector } from '../../../data/journal/selectors'
import { clearWorkoutProgress } from '../../../data/workout'
import { updateUserProfile } from '../../../data/user'

const Complete = ({ navigation, route }) => {
  const [currentWeek] = useState(route.params?.week)
  const [exercise] = useState(route.params?.exercise)
  const [category] = useState(route.params?.category)
  const [timings] = useState(route.params?.timings)

  // console.log('timings', timings)

  const [isEnjoyModalVisible, setIsEnjoyModalVisible] = useState(false)

  const currentProgram = useSelector((state) => state.data.workouts.currentProgram)
  const workout = useSelector((state) => state.data.workouts.currentWorkout)
  const elapsed = useMemo(() => route.params?.elapsed || timings[timings.length - 1].elapsed, [timings, route.params?.elapsed])

  const trainer = useSelector((state) => state.data.workouts.currentTrainer)
  const moods = useSelector(moodsSelector)
  const activities = useSelector(activitiesSelector)
  const level_id = useSelector((state) => state.data.user.meta.trainers[trainer.id]?.level_id)
  const user = useSelector((state) => state.data.user)
  const rehabCategory = useSelector((state) => state.data.media.categories.Guidance.find((c) => c.name === 'Rehabilitation'))

  const headerHeight = useHeaderHeight()
  const insets = useSafeAreaInsets()

  const isCardio = workout.cardio?.length > 0

  const { primaryColor, secondaryColor } = useMemo(
    () =>
      workout.is_challenge
        ? { primaryColor: currentProgram.color, secondaryColor: currentProgram.color_secondary }
        : { primaryColor: trainer.color, secondaryColor: trainer.secondary_color },
    [workout, currentProgram, trainer],
  )

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={() => navigation.navigate(workout.is_challenge ? 'Challenges' : 'Workouts', {})}>
          <Close color="white" />
        </HeaderButton>
      ),
      headerLeft: () => (
        <HeaderButton
          onPress={() =>
            navigation.navigate('Tooltips', { screen: 'Tooltip', params: { name: 'workout complete', openedManually: true } })
          }>
          <TipsIcon color={globals.styles.colors.colorWhite} />
        </HeaderButton>
      ),
      headerTitle: () => <SvgUri uri={resolveLocalUrl(trainer.logo_url)} color={globals.styles.colors.colorWhite} />,
    })

    clearWorkoutProgress()
  }, [navigation, trainer, workout])

  useEffect(() => {
    let showPopup = false
    if (user.meta.review && typeof user.meta.review === 'string') {
      // Meta review date set, show popup if after date
      showPopup = moment(user.meta.review).isBefore(moment())
    } else if (!user.meta.hasOwnProperty('review') || !user.meta.review) {
      // Never asked for review, check if trial is still going
      if (!user.has_ever_paid) {
        // Show popup after the 5th day of trial
        // console.log(moment.duration(moment().diff(moment(user.trial_plan_start_date))).asDays())
        showPopup = moment.duration(moment().diff(moment(user.trial_plan_start_date))).asDays() > 5
      } else {
        // Trial already ended, never been asked to review, ask now
        showPopup = true
      }
    }
    if (showPopup) {
      setIsEnjoyModalVisible(true)
    }
  }, [])

  useEffect(() => {
    // we load this here in case user goes directly to EditJournal
    // before moods or activities have been loaded
    if (!moods || moods.length < 1 || !activities || activities.length < 1) {
      getMoods()
      getActivities()
    }
  }, [moods, activities])

  useFocusEffect(
    useCallback(() => {
      bottomPanel.current.fadeInUp(0)
    }, []),
  )

  const bottomPanel = useRef(null)

  // console.log('currentProgram', currentProgram)
  const COLORS = [secondaryColor, primaryColor]

  function handleMyPerformancePress() {
    bottomPanel.current.fadeOutDown().then(() => {
      navigation.navigate('Performance', {
        timings,
        program: currentProgram,
        week: currentWeek,
        workout,
        exercise,
        elapsed,
        category,
      })
    })
  }

  function enjoyModalOnClose(result) {
    let value
    if (result == Result.NO || result == Result.NO_ENJOY) {
      value = false
    } else if (result == Result.DONE) {
      value = true
    } else if (result == Result.REMIND) {
      value = moment().add(14, 'days').toString()
    }
    const newUser = {
      id: user.id,
      meta: {
        ...user.meta,
        review: value,
      },
    }
    updateUserProfile(newUser)
    setIsEnjoyModalVisible(false)

    if (result == Result.NO_ENJOY) {
      openEmail('hello@fitbodyapp.com?subject=Question about my Fit Body app')
    }
  }

  return (
    <AndroidBackHandler>
      <OverlayBlend
        style={StyleSheet.absoluteFill}
        dstImage={
          <LinearGradient
            style={globals.styles.container}
            colors={COLORS}
            start={{ y: '100h', x: '0w' }}
            end={{ x: 0, y: '0h' }}
            stops={[0, 1]}
          />
        }
        resizeCanvasTo={'srcImage'}
        srcImage={
          <Image
            style={styles.fill}
            resizeMode={'cover'}
            resizeMethod="resize"
            source={{
              uri: resolveLocalUrl(currentProgram.background_image_url),
            }}
          />
        }
      />

      <View style={styles.timeContainer}>
        <View style={styles.timeContainerInner}>
          <Text style={styles.totalText}>TOTAL {workout.is_challenge ? '' : 'WORKOUT'} TIME</Text>
          <Text style={styles.time}>
            {Math.floor(elapsed / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.round(elapsed % 60)
              .toString()
              .padStart(2, '0')}
          </Text>
        </View>
      </View>

      <View
        pointerEvents="box-none"
        style={{
          marginTop: headerHeight + 24,
          flex: 1,
          position: 'absolute',
          height: Dimensions.get('window').height / 2 - vs(38) - headerHeight - 24,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          top: 0,
          flexDirection: 'column',
        }}>
        <View style={styles.alignCenter}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subTitle}>YOU HAVE COMPLETED</Text>
        </View>
        <View style={styles.cardioLabelContainer}>
          <Text style={styles.categoryLabel}>
            {workout.is_challenge ? workout.challenge_name.toUpperCase() : category.title.toUpperCase()}
          </Text>
          <Text style={styles.cardioLabel}>
            {isCardio ? workout.cardio.find((c) => c.level_id === level_id).cardioType.name : workout.title}
          </Text>
        </View>
      </View>

      <Animatable.View ref={bottomPanel} useNativeDriver={true} animation={'slideInUp'} duration={300} style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleMyPerformancePress}>
          <Text style={styles.buttonLabel}>MY PERFORMANCE</Text>
          <ChevronRight color={globals.styles.colors.colorGrayDark} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Guidance', {
              screen: 'GuidanceCategory',
              params: { title: 'Rehabilitation', headerImage: rehabCategory.header_image_url, categoryId: rehabCategory.id },
            })
          }>
          <Text style={styles.buttonLabel}>FOAM ROLLING + STRETCHING</Text>
          <ChevronRight color={globals.styles.colors.colorGrayDark} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('History', {
              screen: 'EditJournal',
              params: { date: moment().format('YYYY-MM-DD') },
            })
          }>
          <Text style={styles.buttonLabel}>TODAY'S JOURNAL</Text>
          <ChevronRight color={globals.styles.colors.colorGrayDark} />
        </TouchableOpacity>

        <View style={styles.paddedRow}>
          <TouchableOpacity
            style={[
              styles.inviteButton,
              {
                marginBottom: Math.max(insets.bottom, 10),
                shadowColor: primaryColor,
                marginRight: currentProgram.is_challenge ? 0 : 9,
              },
            ]}
            onPress={() => navigation.push('Modals', { screen: 'Invite' })}>
            <LG style={styles.inviteButtonGradient} colors={COLORS}>
              <Text style={styles.pillButtonLabel}>EARN REWARDS</Text>
            </LG>
          </TouchableOpacity>
          {!currentProgram.is_challenge && !currentProgram.hide_challenges && (
            <TouchableOpacity
              style={[
                styles.challengeButton,
                {
                  borderWidth: 1,
                  borderColor: primaryColor,
                  backgroundColor: globals.styles.colors.colorWhite,
                  marginBottom: Math.max(insets.bottom, 10),
                  shadowColor: primaryColor,
                  marginLeft: 9,
                },
              ]}
              onPress={() => navigation.navigate('Challenges', { program: currentProgram })}>
              <View>
                <Text style={[styles.pillButtonLabel, { color: primaryColor }]}>DAILY BURN</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animatable.View>
      <EnjoyModal isVisible={isEnjoyModalVisible} onClose={enjoyModalOnClose} />
    </AndroidBackHandler>
  )
}

const styles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
  },
  alignCenter: {
    alignItems: 'center',
  },
  title: {
    fontFamily: globals.fonts.accent.style.fontFamily,
    fontSize: ms(80),
    color: globals.styles.colors.colorWhite,
  },
  subTitle: {
    fontSize: ms(16),
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
    marginLeft: ms(75),
    marginTop: -25,
  },
  cardioLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: ms(18),
    color: globals.styles.colors.colorWhite,
  },
  cardioLabel: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    textAlign: 'center',
    fontSize: vs(50),
    color: globals.styles.colors.colorWhite,
  },
  timeContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  timeContainerInner: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: globals.styles.colors.colorTransparentWhite30,
    height: vs(76),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    fontSize: 16,
    color: globals.styles.colors.colorWhite,
  },
  time: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: ms(45),
    color: globals.styles.colors.colorWhite,
    marginTop: 3,
  },
  bottomButtonContainer: {
    position: 'absolute',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: { height: 0, width: 0 },
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 50,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignSelf: 'stretch',
    backgroundColor: globals.styles.colors.colorWhite,
    elevation: 3,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: globals.styles.colors.colorGray,
    paddingHorizontal: 24,
    paddingVertical: vs(24),
  },
  buttonLabel: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    color: globals.styles.colors.colorBlack,
  },
  paddedRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  pillButtonLabel: {
    fontSize: 14,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  inviteButton: {
    flex: 1,
    height: 56,
    borderRadius: 27.5,
    marginBottom: 30,
    marginTop: 5,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 5, // pressed ? 2 : 7,
    },
    shadowOpacity: 0.7,
    shadowRadius: 9.54,
    elevation: 8,
  },
  inviteButtonGradient: {
    flex: 1,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeButton: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    marginBottom: 30,
    marginTop: 5,
    shadowColor: globals.styles.colors.colorBlackDark,
    shadowOffset: {
      width: 0,
      height: 5, // pressed ? 2 : 7,
    },
    shadowOpacity: 0.7,
    shadowRadius: 9.54,
    elevation: 8,
  },
})

Complete.displayName = 'Complete'

export default Complete
