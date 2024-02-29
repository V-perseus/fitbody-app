import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Pagination } from 'react-native-snap-carousel'
import { useHeaderHeight } from '@react-navigation/elements'
import { NavigationProp } from '@react-navigation/native'

// Assets
import globals from '../../../config/globals'

// Components
import TitleOption from '../../../components/FoodQuestions/TitleOption'
import OptionButton from '../../../components/FoodQuestions/OptionButton'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// Api
import { updateUserProfile } from '../../../data/user'
import { userQuizSelector, userSelector } from '../../../data/user/selectors'
import { useAppSelector } from '../../../store/hooks'

// Types
import { MainStackParamList } from '../../../config/routes/routeTypes'
import { IQuiz } from '../../../data/user/types'

interface IQuizLocationProps {
  navigation: NavigationProp<MainStackParamList, 'QuizGoal'>
}
export const QuizLocation: React.FC<IQuizLocationProps> = ({ navigation }) => {
  const headerHeight = useHeaderHeight()

  const options = useAppSelector((state) => state.data.workouts.quizQuestions?.locations || [])
  const user = useSelector(userSelector)
  const quizData = useSelector(userQuizSelector)

  // const quizData = user.quiz ? user.quiz : null
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderButton iconColor={globals.styles.colors.colorWhite} onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  const setUserQuizLocation = (locationId: number) => {
    if (!quizData) {
      return
    }
    const newUserData = {
      id: user.id,
      quiz: {
        ...quizData,
        location: locationId,
      } as IQuiz,
    }

    updateUserProfile(newUserData)
    navigation.navigate('QuizPace')
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={[globals.styles.colors.colorLavender, globals.styles.colors.colorSkyBlue]}>
      <View style={{ position: 'absolute', top: headerHeight / 2, left: 0, right: 0 }}>
        <Pagination
          activeDotIndex={1}
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
        <TitleOption style={styles.titleOption} title={'WHERE ARE YOU WORKING OUT'} />
        {options?.map((o) => (
          <OptionButton
            key={o.id}
            active
            title={o.title?.toUpperCase()}
            selected={quizData?.location === o.id}
            handlePress={() => setUserQuizLocation(o.id)}
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
  slide: {
    flex: 1,
  },
  button: { marginTop: 10, marginBottom: 10 },
  titleOption: {
    marginBottom: 8,
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
})
