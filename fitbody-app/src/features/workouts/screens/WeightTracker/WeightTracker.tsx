import React, { memo, useLayoutEffect } from 'react'
import {
  WeightTrackStackParamList,
  WeightTrackTabStackParamList,
  WeightTrackerScreenNavigationProps,
} from '../../../../config/routes/routeTypes'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import globals from '../../../../config/globals'
import InfoIcon from '../../../../../assets/images/svg/icon/24px/info.svg'
import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs'
import { scale } from 'react-native-size-matters/extend'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WeightTrackInput } from '../../components/WeightTrackInput'
import { WeightTrackHistory } from '../../components/WeightTrackHistory'
import { createStackNavigator } from '@react-navigation/stack'
import { ProgramColorProps } from './types'
import { useAppSelector } from '../../../../store/hooks'
import {
  currentCircuitSelector,
  currentCircuitsSelector,
  currentExerciseIndexSelector,
  currentWorkoutColorsSelector,
} from '../../../../data/workout/selectors'
import { useSelector } from 'react-redux'

const Tab = createMaterialTopTabNavigator<WeightTrackTabStackParamList>()

const getTabBarScreenOptions = (tabBarColor: string): MaterialTopTabNavigationOptions => ({
  tabBarInactiveTintColor: globals.styles.colors.colorGrayDark,
  tabBarActiveTintColor: tabBarColor,
  tabBarStyle: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  tabBarLabelStyle: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  tabBarIndicatorStyle: {
    backgroundColor: tabBarColor,
    height: 3,
  },
  // Use hex opacity for specifying transparency.
  // The following gist provides a handy reference for different opacity levels:
  // https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4˝
  tabBarPressColor: `#66${tabBarColor.slice(1)}`,
})

const SafeAreaMaterialTopTabBar = (props: MaterialTopTabBarProps) => {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: globals.styles.colors.colorWhite }}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}

const WeightTrackTabs: React.FC<ProgramColorProps> = ({ tabBarColor }) => (
  <Tab.Navigator
    tabBar={SafeAreaMaterialTopTabBar}
    screenOptions={() => getTabBarScreenOptions(tabBarColor)}
    initialRouteName="Tracker"
    initialLayout={{ width: globals.window.width }} // setting this helps improve rendering performance.
    sceneContainerStyle={{ backgroundColor: globals.styles.colors.colorWhite }}
    style={{ paddingTop: 50 }}>
    <Tab.Screen name="Tracker" options={{ title: 'Reps + Weights Tracker' }}>
      {() => <WeightTrackInput />}
    </Tab.Screen>
    <Tab.Screen name="History" options={{ title: 'History' }}>
      {() => <WeightTrackHistory />}
    </Tab.Screen>
  </Tab.Navigator>
)

const Stack = createStackNavigator<WeightTrackStackParamList>()

interface IWeightTrackerScreenNavigationProps extends WeightTrackerScreenNavigationProps {}
const WeightTrackerComponent: React.FC<IWeightTrackerScreenNavigationProps> = ({ navigation, route }) => {
  const { primaryColor, secondaryColor } = useAppSelector(currentWorkoutColorsSelector)
  const currentCircuit = useSelector(currentCircuitSelector)
  const circuits = useSelector(currentCircuitsSelector)
  const currentExerciseIndex = useSelector(currentExerciseIndexSelector)
  const INFO_TITLE = 'Weight Tracker Information'
  const INFO_CONTENT = 'Weight is set at pounds (lbs) or kilograms (kg) depending on chosen weight preference.'

  function handleCardioInfoPress() {
    navigation.navigate('Modals', {
      screen: 'ConfirmationDialog',
      params: {
        showCloseButton: true,
        yesLabel: 'DOPE',
        hideNoButton: true,
        yesHandler: () => {},
        title: INFO_TITLE,
        body: INFO_CONTENT,
        yesBtnColor: primaryColor,
      },
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} iconColor={globals.styles.colors.colorBlack} />,
      headerRight: () => (
        <HeaderButton onPress={handleCardioInfoPress}>
          <InfoIcon color={primaryColor} width={24} height={24} />
        </HeaderButton>
      ),
      headerTitle: circuits[currentCircuit].exercises[currentExerciseIndex].exercise.title,
      headerTitleStyle: {
        fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
        fontSize: 16,
        color: globals.styles.colors.colorBlack,
        textTransform: 'uppercase',
      },
    })
  }, [navigation])

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {() => <WeightTrackTabs tabBarColor={primaryColor} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export const WeightTracker = memo(WeightTrackerComponent)
