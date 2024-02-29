import React from 'react'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'

import { AccountStackParamList } from './routeTypes'

// Account pages
import Profile from '../../screens/tabs/account/Profile'
import ProfileEdit from '../../screens/tabs/account/ProfileEdit'
import Menu from '../../screens/tabs/account/Menu'
import Settings from '../../screens/tabs/account/Settings'
import ChangePassword from '../../screens/tabs/account/ChangePassword'
import Privacy from '../../screens/legal/Privacy'
import Terms from '../../screens/legal/Terms'
import Notifications from '../../screens/tabs/account/Notifications'
import ProgressPhotos from '../../screens/tabs/account/ProgressPhotos'
import FAQ from '../../screens/tabs/account/FAQ'
import ViewProgressPhoto from '../../screens/tabs/account/ViewProgressPhoto'
import Progress from '../../screens/tabs/account/Progress'
import CollagePhoto from '../../screens/tabs/account/CollagePhoto'
import Downloads from '../../screens/tabs/account/Downloads'
import NotificationSettings from '../../screens/tabs/account/NotificationSettings'
import AccountDeletion from '../../screens/tabs/account/AccountDeletion'

/**
 * Account Stack
 *
 * Everything loaded into the Account tab
 */
const Stack = createStackNavigator<AccountStackParamList>()
const accountStackOptions: StackNavigationOptions = {
  headerTransparent: true,
  headerTitleAlign: 'center',
  headerMode: 'screen',
}
export const AccountStack = () => {
  return (
    <Stack.Navigator initialRouteName="Menu" screenOptions={accountStackOptions}>
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="ProfileView" component={Profile} />
      <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="FAQ" component={FAQ} />
      <Stack.Screen name="ProgressPhotos" component={ProgressPhotos} />
      <Stack.Screen name="Progress" component={Progress} />
      <Stack.Screen name="ViewProgressPhoto" component={ViewProgressPhoto} />
      <Stack.Screen name="CollagePhoto" component={CollagePhoto} />
      <Stack.Screen name="Downloads" component={Downloads} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="AccountDeletion" component={AccountDeletion} />
    </Stack.Navigator>
  )
}
