import React from 'react'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator, HeaderStyleInterpolators, StackNavigationOptions } from '@react-navigation/stack'

// Components
import Disclaimer from '../../components/Disclaimer'
import InviteModal from '../../components/InviteModal'

// Assets
import globals from '../globals'
import ProfileNavIcon from '../../../assets/images/svg/icon/24px/menu.svg'
import WorkoutsNavIcon from '../../../assets/images/svg/icon/24px/navigation/workouts.svg'
import GuidanceNavIcon from '../../../assets/images/svg/icon/24px/navigation/guidance.svg'
import GuidanceNavDisabledIcon from '../../../assets/images/svg/icon/24px/navigation/guidance-disabled.svg'
import MealsNavIcon from '../../../assets/images/svg/icon/24px/navigation/meals.svg'
import MealsNavDisabledIcon from '../../../assets/images/svg/icon/24px/navigation/meals-disabled.svg'
import HistoryNavIcon from '../../../assets/images/svg/icon/24px/navigation/history.svg'
import HistoryNavDisabledIcon from '../../../assets/images/svg/icon/24px/navigation/history-disabled.svg'

// Data
import { isRestrictedSelector, userQuizCompleteSelector } from '../../data/user/selectors'
import NavigationService from '../../services/NavigationService'
import { useAppSelector } from '../../store/hooks'

// Main Application tabs
import Level from '../../screens/tabs/workout/level'
import Subscription from '../../screens/auth/Subscription'
import EditExtraMood from '../../screens/tabs/workout/EditExtraMood'

import WorkoutStack from '../../features/workouts/navigation'
import Cardio from '../../features/workouts/screens/cardio/Cardio'
import GetReady from '../../features/workouts/screens/cardio/GetReady'
import Exercise from '../../features/workouts/screens/cardio/Exercise'
import ProgramSettings from '../../features/workouts/screens/ProgramSettings'
import VideoSettingsModal from '../../features/onDemand/screens/VideoSettings'
import ConfirmationDialog from '../../features/workouts/components/ConfirmationDialog'
import ContactDialog from '../../components/ContactDialog'
import ProgramSelector from '../../features/workouts/screens/ProgramSelector'
import Complete from '../../features/workouts/screens/Complete'
import Performance from '../../features/workouts/screens/Performance'
import Workout from '../../features/workouts/screens/workouts/Workout'
import CircuitComplete from '../../features/workouts/screens/workouts/CircuitComplete'
import Overview from '../../features/workouts/screens/workouts/Overview'
import { Prefetching } from '../../features/workouts/screens/Prefetching'
import { CircuitRest } from '../../features/workouts/screens/workouts/CircuitRest'
import { EatingStack } from './eatingStack'
import { GuidanceStack } from './guidanceStack'
import { HistoryStack } from './historyStack'
import { AccountStack } from './accountStack'
import { ModalStackTooltips, TooltipsStackOptions } from './tooltipStack'

import EatingPreference from '../../screens/tabs/eating/EatingPreference'
import CalculatedMacros from '../../screens/tabs/eating/Calculator/CalculatedMacros'
import Calculator from '../../screens/tabs/eating/Calculator/Calculator'
import WeightPreference from '../../screens/tabs/account/WeightPreference'
import { Video } from '../../features/onDemand/screens/Video'
import { QuizLevel } from '../../features/trainers/screens/QuizLevel'
import { QuizLocation } from '../../features/trainers/screens/QuizLocation'
import { QuizPace } from '../../features/trainers/screens/QuizPace'
import { QuizGoal } from '../../features/trainers/screens/QuizGoal'

import { BottomTabScreenOptionsProps, MainBottomTabNavigatorParamList, MainStackParamList, ModalsStackParamList } from './routeTypes'
import { WeightTracker } from '../../features/workouts/screens/WeightTracker'

// const ProfileIcon = connect((state) => ({
//   hasUnreadNotifications: state.data.notification?.find((n) => n.read_at === null) !== undefined,
// }))((props) => {
//   return props.hasUnreadNotifications ? (
//     <>
//       <ProfileBadgeNavIcon color={props.tintColor} width={36} height={36} />
//     </>
//   ) : (
//     <ProfileNavIcon color={props.tintColor} width={26} height={26} />
//   )
// })

/**
 * Tabs Stack
 *
 * Everything for a authenticated user
 *  - Custom SVG Icons for the tabs
 */

const Tab = createBottomTabNavigator<MainBottomTabNavigatorParamList>()
const loggedInStackScreenOptions = ({ route }: BottomTabScreenOptionsProps, restricted: boolean): BottomTabNavigationOptions => ({
  tabBarShowLabel: false,
  tabBarInactiveTintColor: globals.styles.colors.colorBlack,
  tabBarActiveTintColor: globals.styles.colors.colorPink,
  lazy: true,
  headerShown: false,
  tabBarIcon: ({ color }) => {
    let icon = null
    if (route.name === 'Workout') {
      icon = <WorkoutsNavIcon width={25} height={25} color={color} />
    } else if (route.name === 'Guidance') {
      icon = restricted ? (
        <GuidanceNavDisabledIcon color={color} width={31} height={31} style={{ marginTop: -2 }} />
      ) : (
        <GuidanceNavIcon color={color} width={28} height={28} style={{ marginTop: 2 }} />
      )
    } else if (route.name === 'Eating') {
      icon = restricted ? (
        <MealsNavDisabledIcon color={color} width={31} height={31} style={{ marginTop: -4 }} />
      ) : (
        <MealsNavIcon color={color} width={26} height={26} />
      )
    } else if (route.name === 'History') {
      icon = restricted ? (
        <HistoryNavDisabledIcon color={color} width={31} height={31} style={{ marginTop: -4 }} />
      ) : (
        <HistoryNavIcon color={color} width={26} height={26} />
      )
    } else if (route.name === 'Profile') {
      icon = <ProfileNavIcon color={color} width={26} height={26} />
    }
    return icon
  },
})

const LoggedInStack = () => {
  const isRestricted = useAppSelector(isRestrictedSelector)
  const hasUnreadNotifications = useAppSelector((state) => state.data.notification.find((n) => n.read_at === null) !== undefined)

  return (
    <Tab.Navigator
      initialRouteName="Workout"
      // initialLayout={{ width: globals.window.width }} // setting this helps improve rendering performance.
      screenOptions={(props) => loggedInStackScreenOptions(props, !!isRestricted)}>
      <Tab.Screen name="Workout" component={WorkoutStack} />
      <Tab.Screen
        name="Eating"
        component={EatingStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action and send to paywall
            if (isRestricted) {
              e.preventDefault()
              const { index, routes } = navigation.getState()
              const previousRoute = routes[index]
              NavigationService.sendToPaywall({
                from: previousRoute.name,
              })
            }
          },
        })}
      />
      <Tab.Screen
        name="Guidance"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            if (isRestricted) {
              e.preventDefault()
              const { index, routes } = navigation.getState()
              const previousRoute = routes[index]
              NavigationService.sendToPaywall({
                from: previousRoute.name,
              })
            } else {
              navigation.navigate('Guidance', { screen: 'Home' })
            }
          },
        })}
        component={GuidanceStack}
        options={{
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="History"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            if (isRestricted) {
              e.preventDefault()
              const { index, routes } = navigation.getState()
              const previousRoute = routes[index]
              NavigationService.sendToPaywall({
                from: previousRoute.name,
              })
            } else {
              navigation.navigate('History', { screen: 'Home', params: { screen: 'Month' } })
            }
          },
        })}
        component={HistoryStack}
      />
      <Tab.Screen
        name="Profile"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            navigation.navigate('Profile', { screen: 'Menu' })
          },
        })}
        component={AccountStack}
        options={{
          unmountOnBlur: true,
          tabBarBadge: hasUnreadNotifications ? '' : undefined, // shows a badge if there are unread notifications but no number
          tabBarBadgeStyle: {
            backgroundColor: globals.styles.colors.colorPink,
            color: globals.styles.colors.colorPink,
          },
        }}
      />
    </Tab.Navigator>
  )
}

const ModalStack = createStackNavigator<ModalsStackParamList>()
const ModalStackOptions: StackNavigationOptions = {
  headerShown: false,
  presentation: 'transparentModal',
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
}

export const ModalStackScreens = () => (
  <ModalStack.Navigator screenOptions={ModalStackOptions}>
    <ModalStack.Screen name="ProgramSettings" component={ProgramSettings} />
    <ModalStack.Screen name="VideoSettings" component={VideoSettingsModal} />
    <ModalStack.Screen name="ConfirmationDialog" component={ConfirmationDialog} />
    <ModalStack.Screen name="DownloadsDialog" component={ConfirmationDialog} />
    <ModalStack.Screen name="ProgramSelector" component={ProgramSelector} />
    <ModalStack.Screen name="Invite" component={InviteModal} />
    <ModalStack.Screen name="Disclaimer" component={Disclaimer} />
    <ModalStack.Screen name="ContactDialog" component={ContactDialog} />
    <ModalStack.Screen name="Video" component={Video} />
  </ModalStack.Navigator>
)

const Stack = createStackNavigator<MainStackParamList>()
const QuizScreenOptions: StackNavigationOptions = {
  animationEnabled: true,
  gestureEnabled: false,
  headerTransparent: true,
  headerTitle: '',
  headerLeft: () => null,
}

export const MainStack = Prefetching(() => {
  const quizComplete = useAppSelector(userQuizCompleteSelector)

  return (
    <Stack.Navigator
      initialRouteName={!quizComplete ? 'QuizLevel' : 'Home'}
      screenOptions={{ headerTitleAlign: 'center', cardStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name="Home" component={LoggedInStack} options={{ headerShown: false }} />
      <Stack.Screen name="QuizLevel" component={QuizLevel} options={QuizScreenOptions} />
      <Stack.Screen name="QuizLocation" component={QuizLocation} options={QuizScreenOptions} />
      <Stack.Screen name="QuizPace" component={QuizPace} options={QuizScreenOptions} />
      <Stack.Screen name="QuizGoal" component={QuizGoal} options={QuizScreenOptions} />
      <Stack.Screen
        name="Overview"
        component={Overview}
        options={{
          headerShown: true,
          animationEnabled: true,
          gestureEnabled: false,
          headerTransparent: true,
          // headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen
        name="SingleWorkout"
        component={Workout}
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: false,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen name="Level" component={Level} options={{ headerShown: false }} />
      <Stack.Screen name="Cardio" component={Cardio} options={{ headerShown: true, animationEnabled: false }} />
      <Stack.Screen
        name="GetReady"
        component={GetReady}
        options={{
          headerShown: true,
          headerLeft: () => null,
          headerTransparent: true,
          headerTitle: () => null,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
          animationEnabled: true,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="CircuitComplete"
        component={CircuitComplete}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
          animationEnabled: true,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="CircuitRest"
        component={CircuitRest}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
          animationEnabled: true,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Exercise"
        component={Exercise}
        options={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: false,
          headerStyleInterpolator: HeaderStyleInterpolators.forFade,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen name="Modals" component={ModalStackScreens} options={{ presentation: 'transparentModal', headerShown: false }} />
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{
          headerTitleContainerStyle: { marginTop: 14 },
          headerRightContainerStyle: { marginRight: 16 },
          headerShown: true,
          headerTransparent: true,
          animationEnabled: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Performance" component={Performance} />
      <Stack.Screen name="EditExtraMood" component={EditExtraMood} options={{ headerShown: false }} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Tooltips" component={ModalStackTooltips} options={TooltipsStackOptions} />
      <Stack.Screen name="EatingPreference" component={EatingPreference} options={EatingPreference.navigationOptions} />
      <Stack.Screen name="CalculatedMacros" component={CalculatedMacros} options={CalculatedMacros.navigationOptions} />
      <Stack.Screen name="Calculator" component={Calculator} />
      <Stack.Screen name="WeightPreference" component={WeightPreference} options={{ headerShown: false }} />
      <Stack.Screen name="WeightTracker" component={WeightTracker} options={{ headerShown: true }} />
    </Stack.Navigator>
  )
})
