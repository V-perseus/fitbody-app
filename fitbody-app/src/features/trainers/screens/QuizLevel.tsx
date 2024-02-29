import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Text, View, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Pagination } from 'react-native-snap-carousel'
import { useHeaderHeight } from '@react-navigation/elements'

// Assets
import globals from '../../../config/globals'

// Components
import TitleOption from '../../../components/FoodQuestions/TitleOption'
import OptionButton from '../../../components/FoodQuestions/OptionButton'

// Api
import { updateUserProfile } from '../../../data/user'
import { getQuizQuestions } from '../../../data/workout'
import { userQuizSelector, userSelector } from '../../../data/user/selectors'
import { useAppSelector } from '../../../store/hooks'
import { NavigationProp } from '@react-navigation/native'
import { MainStackParamList } from '../../../config/routes/routeTypes'
import { IQuiz } from '../../../data/user/types'

interface IQuizLevelProps {
  navigation: NavigationProp<MainStackParamList, 'QuizGoal'>
}
export const QuizLevel: React.FC<IQuizLevelProps> = ({ navigation }) => {
  const headerHeight = useHeaderHeight()

  const options = useAppSelector((state) => state.data.workouts.quizQuestions?.levels ?? [])
  const quizData = useSelector(userQuizSelector)
  const user = useSelector(userSelector)

  console.log(options)
  useEffect(() => {
    getQuizQuestions()
  }, [])

  const setUserQuizLevel = (level: number) => {
    const newUserData = {
      id: user.id,
      quiz: {
        ...quizData,
        level,
      } as IQuiz,
    }

    updateUserProfile(newUserData)
    navigation.navigate('QuizLocation')
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={[globals.styles.colors.colorLavender, globals.styles.colors.colorSkyBlue]}>
      <View style={{ position: 'absolute', top: headerHeight / 2, left: 0, right: 0 }}>
        <Pagination
          activeDotIndex={0}
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
        <Text style={styles.titleText}>
          ANSWER FOUR QUICK{'\n'}QUESTIONS TO FIND OUT WHICH{'\n'}FIT BODY PROGRAM IS RIGHT FOR YOU!
        </Text>
        <Text style={styles.subtitleText}>You can change your answers at any time</Text>
        <TitleOption style={styles.titleOption} title={'WHAT IS YOUR FITNESS LEVEL'} />
        {options.map((o) => (
          <OptionButton
            key={o.id}
            active
            title={o?.title?.toUpperCase()}
            selected={quizData?.level === o.value}
            handlePress={() => setUserQuizLevel(o.value)}
            style={styles.button}
          />
        ))}
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: { marginTop: 10, marginBottom: 10 },
  titleOption: {
    marginBottom: 8,
    width: globals.window.width * 0.7,
  },
  titleText: {
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
    color: globals.styles.colors.colorWhite,
    width: globals.window.width * 0.8,
    marginBottom: 18,
  },
  subtitleText: {
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    textAlign: 'center',
    alignSelf: 'center',
    color: globals.styles.colors.colorWhite,
    width: globals.window.width * 0.8,
    marginBottom: 26,
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
})
