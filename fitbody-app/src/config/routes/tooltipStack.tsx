import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'

import TooltipCarousel from '../../components/Tooltips/TooltipCarousel'
import globals from '../globals'
import { TooltipStackParamList } from './routeTypes'

const TooltipStack = createStackNavigator<TooltipStackParamList>()

export const TooltipsStackOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: globals.styles.colors.colorWhite },
  // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
  cardStyleInterpolator: ({ current: { progress }, layouts: { screen } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
      transform: [
        {
          translateY: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [
              screen.height * 0.5, // start X position
              0, // end X position
            ],
            extrapolate: 'clamp',
          }),
        },
      ],
    },
  }),
}

export const ModalStackTooltips = () => {
  return (
    <TooltipStack.Navigator screenOptions={TooltipsStackOptions}>
      <TooltipStack.Screen name="Tooltip" component={TooltipCarousel} />
    </TooltipStack.Navigator>
  )
}
