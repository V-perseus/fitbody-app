import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { Pagination } from 'react-native-snap-carousel'
import { useHeaderHeight } from '@react-navigation/elements'

// Assets
import globals from '../../../config/globals'

// Components
import TitleOption from '../../../components/FoodQuestions/TitleOption'
import OptionButton from '../../../components/FoodQuestions/OptionButton'
import { ButtonFloating } from '../../../components/Buttons/ButtonFloating'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'
import BottomHover from '../../../shared/BottomHover'

// Data
import { updateUserProfile } from '../../../data/user'
import { userQuizSelector, userSelector } from '../../../data/user/selectors'
import { IQuiz } from '../../../data/user/types'

// Api & Services
import api from '../../../services/api'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'
import { useAppSelector } from '../../../store/hooks'

// Types
import { MainStackParamList } from '../../../config/routes/routeTypes'

interface IQuizGoalProps {
  navigation: NavigationProp<MainStackParamList, 'Home'>
}
export const QuizGoal: React.FC<IQuizGoalProps> = ({ navigation }) => {
  const { logEvent } = useSegmentLogger()
  const headerHeight = useHeaderHeight()

  const options = useAppSelector((state) => state.data.workouts.quizQuestions?.goals || [])
  const user = useAppSelector(userSelector)
  const quizData = useAppSelector(userQuizSelector)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderButton iconColor={globals.styles.colors.colorWhite} onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  const setUserQuizGoal = (goalId: number) => {
    const newUserData = {
      id: user.id,
      quiz: {
        ...quizData,
        goal: goalId,
      } as IQuiz,
    }

    updateUserProfile(newUserData)
  }

  async function handleSave() {
    if (!quizData || !quizData.level || !quizData.location || !quizData.goal || !quizData.pace) {
      // TODO throw error message
      return
    }
    api.workouts
      .getQuizResponse(quizData)
      .then(({ data }) => {
        const newUserData = {
          id: user.id,
          quiz: {
            ...quizData,
            programs: data,
          } as IQuiz,
        }

        updateUserProfile(newUserData)
        logEvent(null, 'Quiz Completed', {
          level: quizData.level,
          workout_location: quizData.location,
          goal: quizData.goal,
        })
        navigation.navigate('Home', { screen: 'Workout', params: { screen: 'RecommendedPrograms' } })
      })
      .catch(() => {})
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={[globals.styles.colors.colorLavender, globals.styles.colors.colorSkyBlue]}>
      <View style={{ position: 'absolute', top: headerHeight / 2, left: 0, right: 0 }}>
        <Pagination
          activeDotIndex={3}
          dotsLength={4}
          inactiveDotOpacity={0.5}
          inactiveDotScale={1}
          dotColor={globals.styles.colors.colorWhite}
          inactiveDotColor={globals.styles.colors.colorGrayLight}
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.dots}
        />
      </View>
      <View style={styles.container}>
        <TitleOption style={styles.titleOption} title={'WHAT IS YOUR PRIMARY GOAL'} />
        <ScrollView
          style={{ flex: 1, marginBottom: 24 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 64 }}
          showsVerticalScrollIndicator={false}>
          {options.map((o) => (
            <OptionButton
              key={o.id}
              active
              title={o.title?.toUpperCase()}
              selected={quizData?.goal === o.id}
              handlePress={() => setUserQuizGoal(o.id)}
              style={styles.button}
            />
          ))}
        </ScrollView>
      </View>
      <BottomHover color={globals.styles.colors.colorSkyBlue}>
        <ButtonFloating text="SHOW RESULTS" style={styles.saveButton} textStyle={styles.saveButtonText} onPress={handleSave} />
      </BottomHover>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: { marginTop: 10, marginBottom: 10 },
  titleOption: {
    marginBottom: 8,
    marginTop: 164,
    width: globals.window.width * 0.7,
  },
  dotContainer: {
    marginHorizontal: 4,
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 13.2,
    margin: 0,
    padding: 0,
  },
  saveButton: {
    backgroundColor: globals.styles.colors.colorWhite,
    marginBottom: 32,
    marginTop: 5,
    shadowColor: globals.styles.colors.colorSkyBlue,
  },
  saveButtonText: { color: globals.styles.colors.colorPink, fontWeight: '700' },
})
