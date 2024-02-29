import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'

// Auth screens
import Welcome from '../../screens/auth/Welcome'
import SignInSignUp from '../../screens/auth/SignInSignUp'
import ForgotPassword from '../../screens/auth/ForgotPassword'
import SignUp from '../../screens/auth/SignUp'

// Legal screens
import Terms from '../../screens/legal/Terms'
import Privacy from '../../screens/legal/Privacy'
import { LoggedOutStackParamList } from './routeTypes'

/**
 * Auth Stack
 *
 * Everything to do with the login & Sign up experience
 */
const Stack = createStackNavigator<LoggedOutStackParamList>()

const screenOptions: StackNavigationOptions = {
  headerTransparent: true,
  headerTitleAlign: 'center',
  cardStyle: { backgroundColor: 'white' },
  headerStyle: {
    borderBottomWidth: 0,
  },
}

export const LoggedOutStack = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={screenOptions}>
      <Stack.Screen name="Welcome" component={Welcome} options={Welcome.navigationOptions} />
      <Stack.Screen name="SignInSignUp" component={SignInSignUp} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={ForgotPassword.navigationOptions} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Privacy" component={Privacy} />
    </Stack.Navigator>
  )
}
