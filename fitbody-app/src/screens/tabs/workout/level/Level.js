import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import TitleOption from '../../../../components/FoodQuestions/TitleOption'
import OptionButton from '../../../../components/FoodQuestions/OptionButton'

// Api
import { updateUserProfile } from '../../../../data/user'

const Level = ({ navigation, route }) => {
  const { navigate, goBack } = navigation

  const currentTrainer = useSelector((state) => state.data.workouts.currentTrainer)
  const user = useSelector((state) => state.data.user)
  // const week = useSelector((state) =>
  //   state.data.workout.weeks
  //     ? state.data.workout.weeks[
  //         `${state.data.user.workout_goal}_${state.data.user.resistance_bands}_${
  //           state.data.user.meta.programs[state.data.user.workout_goal.toLowerCase()].current_week
  //         }`
  //       ]
  //     : null,
  // )
  const level_id = user.meta.trainers?.[currentTrainer?.id]?.level_id

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const setUserLevel = (level) => () => {
    const newUserData = {
      id: user.id,
      meta: {
        ...user.meta,
        trainers: {
          ...user.meta.trainers,
          [currentTrainer.id]: {
            level_id: level,
          },
        },
      },
    }

    updateUserProfile(newUserData)

    if (route.params?.from === 'goal') {
      navigate('Categories')
    } else {
      goBack()
    }
  }

  // componentDidCatch(error, errorInfo) {
  //   Sentry.captureException(error, { logger: this.constructor.name });
  // }

  return (
    <LinearGradient style={styles.slide} colors={[globals.styles.colors.colorLavender, globals.styles.colors.colorSkyBlue]}>
      <View style={styles.container}>
        <TitleOption style={styles.titleOption} title={'SELECT YOUR LEVEL'} />
        <Text style={styles.subtitleText}>Change your level at anytime on the workout preview screen or within the program settings.</Text>
        <OptionButton active title="BEGINNER" selected={level_id === 1} handlePress={setUserLevel(1)} style={styles.button} />
        <OptionButton active title="INTERMEDIATE" selected={level_id === 2} handlePress={setUserLevel(2)} style={styles.button} />
        <OptionButton active title="ADVANCED" selected={level_id === 3} handlePress={setUserLevel(3)} style={styles.button} />
      </View>
    </LinearGradient>
  )
}

export default Level
