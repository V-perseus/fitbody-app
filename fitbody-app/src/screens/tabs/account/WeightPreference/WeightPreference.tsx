import React, { useLayoutEffect, useState } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'

// Assets
import styles from './styles'
import globals from '../../../../config/globals'

// Components
import TitleOption from '../../../../components/FoodQuestions/TitleOption'
import OptionButton from '../../../../components/FoodQuestions/OptionButton'

// Api and data
import { updateUserProfileOnline } from '../../../../data/user'
import { ExerciseWeightUnit } from '../../../../data/user/types'
import { userSelector } from '../../../../data/user/selectors'

// TODO type this properly when navigation gets typed
interface IWeightPreferenceProps {
  navigation: any
  route: any
}
export default function WeightPreference({ navigation, route }: IWeightPreferenceProps) {
  const user = useSelector(userSelector)

  const [step, setStep] = useState(0)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerStyle: {
        backgroundColor: 'transparent',
      },
    })
  }, [navigation])

  /**
   * Set the user's preference in the API and route
   * to the next appropriate screen
   */
  async function updatePreference(pref: ExerciseWeightUnit) {
    const { goBack } = navigation
    const profile = route.params?.fromProfile
    try {
      await updateUserProfileOnline({
        id: user.id,
        exercise_weight_unit: pref,
      })

      if (profile) {
        goBack()
      }
      setStep(1)
    } catch (error) {}
  }

  return (
    <LinearGradient style={styles.slide} colors={[globals.styles.colors.colorLavender, globals.styles.colors.colorSkyBlue]}>
      {step === 0 ? (
        <View style={styles.container}>
          <TitleOption title={'What is your weight preference?'} />
          <OptionButton
            active
            title="Pounds"
            selected={user.exercise_weight_unit === ExerciseWeightUnit.lbs}
            handlePress={() => {
              user.exercise_weight_unit === ExerciseWeightUnit.lbs ? navigation.goBack() : updatePreference(ExerciseWeightUnit.lbs)
            }}
            style={styles.optionButton}
          />
          <OptionButton
            active
            title="Kilograms"
            selected={user.exercise_weight_unit === ExerciseWeightUnit.kg}
            handlePress={() => {
              user.exercise_weight_unit === ExerciseWeightUnit.kg ? navigation.goBack() : updatePreference(ExerciseWeightUnit.kg)
            }}
            style={styles.optionButton}
          />
        </View>
      ) : null}
    </LinearGradient>
  )
}
