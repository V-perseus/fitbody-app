import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'

// Guidance pages
import { Guidance } from '../../features/onDemand/screens/Guidance'
import { GuidanceCategories } from '../../features/onDemand/screens/GuidanceCategories'
import { GuidanceCategory } from '../../features/onDemand/screens/GuidanceCategory'
import { OnDemandCategories } from '../../features/onDemand/screens/OnDemandCategories'
import { OnDemandCategory } from '../../features/onDemand/screens/OnDemandCategory'

import { GuidanceStackParamList } from './routeTypes'

/**
 * Guidance Stack
 *
 * Everything loaded into the Guidance Tab
 */
const Stack = createStackNavigator<GuidanceStackParamList>()
const guidanceStackOptions: StackNavigationOptions = {
  cardStyle: { backgroundColor: 'white' },
  headerTitleAlign: 'center',
  headerShadowVisible: false,
}

export const GuidanceStack = () => (
  <Stack.Navigator initialRouteName="OnDemandGuidance" screenOptions={guidanceStackOptions}>
    <Stack.Screen name="OnDemandGuidance" component={Guidance} options={Guidance.navigationOptions} />
    <Stack.Screen name="GuidanceCategories" component={GuidanceCategories} />
    <Stack.Screen name="GuidanceCategory" component={GuidanceCategory} />
    <Stack.Screen name="OnDemandCategories" component={OnDemandCategories} />
    <Stack.Screen name="OnDemandCategory" component={OnDemandCategory} />
  </Stack.Navigator>
)
