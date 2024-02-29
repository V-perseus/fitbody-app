import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'
import { scale } from 'react-native-size-matters/extend'

// Pages
import Week from '../../screens/tabs/history/week'
import Month from '../../screens/tabs/history/month'
import Journal from '../../screens/tabs/history/journal'
import EditJournal from '../../screens/tabs/workout/EditJournal'

import globals from '../globals'
import { HistoryStackParamList, HistoryTabStackParamList } from './routeTypes'

const SafeAreaMaterialTopTabBar = (props: MaterialTopTabBarProps) => {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: globals.styles.colors.colorWhite }}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}

const Tab = createMaterialTopTabNavigator<HistoryTabStackParamList>()

const TabBarScreenOptions: MaterialTopTabNavigationOptions = {
  tabBarInactiveTintColor: globals.styles.colors.colorGrayDark,
  tabBarActiveTintColor: globals.styles.colors.colorPink,
  tabBarStyle: {
    backgroundColor: globals.styles.colors.colorWhite,
  },
  tabBarLabelStyle: {
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: scale(12),
    fontWeight: 'bold',
  },
  tabBarIndicatorStyle: {
    backgroundColor: globals.styles.colors.colorPink,
    height: 3,
  },
  tabBarPressColor: globals.styles.colors.colorTransparent30Pink,
}

const HistoryTabs = () => (
  <Tab.Navigator
    tabBar={SafeAreaMaterialTopTabBar}
    screenOptions={TabBarScreenOptions}
    initialRouteName="Month"
    initialLayout={{ width: globals.window.width }} // setting this helps improve rendering performance.
    sceneContainerStyle={{ backgroundColor: globals.styles.colors.colorWhite }}>
    <Tab.Screen name="Week" component={Week} />
    <Tab.Screen name="Month" component={Month} />
    <Tab.Screen name="Journal" component={Journal} />
  </Tab.Navigator>
)

const Stack = createStackNavigator<HistoryStackParamList>()

const historyStackScreenOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: globals.styles.colors.colorWhite },
  headerTransparent: true,
  headerTitleAlign: 'center',
  headerMode: 'screen',
}

export const HistoryStack = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={historyStackScreenOptions}>
    <Stack.Screen name="Home" component={HistoryTabs} options={{ headerShown: false }} />
    <Stack.Screen name="EditJournal" component={EditJournal} options={{ headerShown: false }} />
  </Stack.Navigator>
)
