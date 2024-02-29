import React, { useEffect, useMemo, useState } from 'react'
import { shallowEqual } from 'react-redux'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'
import { FlatList } from 'react-native-gesture-handler'

// Components
import { SvgUriLocal } from '../components/SvgUriLocal'
import { ChallengeDayListItem } from '../components/ChallengeDayListItem/ChallengeDayListItem'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// Assets
import globals from '../../../config/globals'
import TipsIcon from '../../../../assets/images/svg/icon/24px/tips.svg'
import BackgroundImage from '../../../../assets/images/backgrounds/cardio_burn_default_bg.png'

// Services
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'

import { setCurrentWorkout } from '../../../data/workout'

import { resolveLocalUrl } from '../../../services/helpers'
import { useAppSelector } from '../../../store/hooks'
import { currentTrainerLevelSelector } from '../../../data/workout/selectors'
import { IChallengeDay, ICircuitExercise } from '../../../data/workout/types'

interface IChallengesProps {
  navigation: any
}
const Challenges: React.FC<IChallengesProps> = ({ navigation }) => {
  const isConnected = useAppSelector((state) => state.offline.online)
  const challengeMonth = useAppSelector((state) => state.data.workouts.challengeMonth)
  const completions = useAppSelector((state) => state.data.workouts.completions, shallowEqual) || []
  const trainer = useAppSelector((state) => state.data.workouts.currentTrainer)
  // const level_id = useAppSelector((state) => state.data.user.meta.trainers?.[trainer.id]?.level_id)
  const { levelId } = useAppSelector(currentTrainerLevelSelector)
  const special_equipment = useAppSelector((state) => state.data.user.resistance_bands)
  const progs = useAppSelector((state) => state.data.workouts.programs, shallowEqual)
  const currentProgramSlug = useAppSelector((state) => state.data.user.workout_goal)

  const programs = useMemo(() => Object.values(progs), [progs])
  const program = useMemo(() => (programs ? programs.find((p) => p.slug === currentProgramSlug) : null), [programs, currentProgramSlug])

  const [useDefaultImage, setUseDefaultImage] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <SvgUriLocal color={trainer?.color!} uri={program?.logo_small_url!} />,
      headerLeft: () => <HeaderButton onPress={navigation.goBack} />,
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate('Tooltips', { screen: 'Tooltip', params: { name: 'cardio burn', openedManually: true } })}>
          <TipsIcon color={globals.styles.colors.colorBlack} />
        </HeaderButton>
      ),
    })
  })

  /**
   * Go to the Workout Overview
   */
  const handleNavigation = async (day: IChallengeDay) => {
    const challengeDay = challengeMonth?.days.find((d) => d.date === day.date)

    console.log(challengeDay)

    const payload = {
      currentProgram: {
        color: globals.styles.colors.colorBlack,
        color_secondary: globals.styles.colors.colorBlack,
        is_challenge: true,
        background_image_url: challengeMonth?.bg_image_url,
      },
      currentWorkout: {
        id: day.id,
        day_title: 'DAY ' + moment(day.date).date(),
        day_number: moment(day.date).date(),
        title: challengeDay?.day_subtitle,
        challenge_name: challengeMonth?.title,
        duration: challengeDay?.challenge_duration,
        is_challenge: true,
        image_url: challengeMonth?.bg_image_url,
        equipment: challengeDay?.equipment,
        circuits: [
          {
            id: 1,
            special_equipment: special_equipment!,
            level_id: levelId,
            exercises: challengeDay?.exercises.map((e) => ({
              ...e,
              exercise: challengeMonth?.exercises.find((ex) => ex.id === e.exercise_id),
            })) as ICircuitExercise[],
            rounds_or_reps: challengeDay?.reps_and_rounds!,
            circuits_masters_id: 1,
            circuitMaster: {
              id: 1,
              circuits_title: 'CHALLENGE',
            },
          },
        ],
      },
    }

    setCurrentWorkout({ currentProgram: payload.currentProgram, currentWorkout: payload.currentWorkout })

    navigation.navigate('Overview')
  }

  const renderChallengeDay = (day: IChallengeDay) => {
    let rest = day.id === 0
    let downloaded = day.downloaded
    let available = isConnected || downloaded
    let isToday = moment().isSame(moment(day.date), 'day')
    let downloading = day.downloading
    let day_number = moment(day.date).date()
    const thisMonth = moment().month()
    const thisYear = moment().year()
    let completion = completions.find(
      (x) => x.challenge_id === day.id && x.challenge_day === day_number && thisYear === moment(x.date).year(),
    )
    const completionMonth = moment(completion?.date).month()
    const completionYear = moment(completion?.date).year()
    const isCompleted = !!completion && thisMonth === completionMonth && thisYear === completionYear

    return (
      <ChallengeDayListItem
        onPress={() => (rest || !available ? null : handleNavigation(day))}
        day={day}
        rest={rest}
        available={available}
        isToday={isToday}
        downloaded={downloaded}
        downloading={downloading}
        color={trainer?.color}
        isCompleted={isCompleted}
      />
    )
  }

  if (challengeMonth) {
    return (
      <ImageBackground
        source={
          useDefaultImage
            ? BackgroundImage
            : {
                uri: resolveLocalUrl(challengeMonth.bg_image_url),
              }
        }
        onError={() => {
          setUseDefaultImage(true)
        }}
        style={{ flexGrow: 1 }}>
        <FocusAwareStatusBar barStyle="dark-content" />
        <View style={[styles.container, { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <LinearGradient
            colors={[trainer!.secondary_color, trainer!.color]}
            style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.challengeTitleText}>{challengeMonth.title}</Text>
          </LinearGradient>
          <FlatList
            data={challengeMonth.days}
            keyExtractor={(item) => `0x${moment(item.date).format('X').toString()}`}
            renderItem={({ item }) => renderChallengeDay(item)}
          />
        </View>
      </ImageBackground>
    )
  } else {
    return <View />
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingTop: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  challengeTitleText: {
    fontSize: 17,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
})

export default Challenges
