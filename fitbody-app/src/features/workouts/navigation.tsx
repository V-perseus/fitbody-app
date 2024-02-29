import React from 'react'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'

import Categories from './screens/Categories'
import Workouts from './screens/Workouts'
import { WeightTracker } from './screens/WeightTracker'
import Challenges from './screens/Challenges'
import { RecommendedPrograms } from '../trainers/screens/RecommendedPrograms'
import { ProgramDetails } from '../trainers/screens/ProgramDetails'

import globals from '../../config/globals'

import { isRestrictedSelector } from '../../data/user/selectors'
import { useAppSelector } from '../../store/hooks'

import { WorkoutsStackParamList } from '../../config/routes/routeTypes'

const WorkoutsStack = createSharedElementStackNavigator<WorkoutsStackParamList>()

export default () => {
  const goal = useAppSelector((state) => state.data.user.workout_goal)
  const currentTrainer = useAppSelector((state) => state.data.workouts.currentTrainer)
  const isRestricted = useAppSelector(isRestrictedSelector)
  const currentProgram = useAppSelector((state) => state.data.workouts.currentProgram)

  return (
    <WorkoutsStack.Navigator
      initialRouteName={!goal || !currentTrainer || !currentProgram || isRestricted ? 'RecommendedPrograms' : 'Categories'}
      screenOptions={{
        headerMode: 'screen',
        headerTitleAlign: 'center',
        cardStyle: { backgroundColor: globals.styles.colors.colorWhite },
      }}>
      <WorkoutsStack.Screen
        name="Categories"
        component={Categories}
        options={{
          headerTransparent: true,
          headerTitle: '',
          animationEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => {
            return { cardStyle: { opacity: progress } }
          },
        }}
        sharedElements={(route, otherRoute, showing) => {
          if (otherRoute.name === 'Challenges' && !showing) {
            return undefined
          }
          return ['bg_header_text']
        }}
      />

      <WorkoutsStack.Screen
        name="RecommendedPrograms"
        component={RecommendedPrograms}
        options={{ animationTypeForReplace: 'pop', gestureEnabled: false, headerShown: true, animationEnabled: true }}
      />

      <WorkoutsStack.Screen
        name="ProgramDetails"
        component={ProgramDetails}
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: ({ current: { progress } }) => {
            return { cardStyle: { opacity: progress } }
          },
        }}
      />

      <WorkoutsStack.Screen
        name="Workouts"
        component={Workouts}
        options={{ animationEnabled: false, headerTransparent: true, headerTitle: '' }}
      />

      <WorkoutsStack.Screen name="Challenges" component={Challenges} options={{ headerShown: true }} />

      
    </WorkoutsStack.Navigator>
  )
}
