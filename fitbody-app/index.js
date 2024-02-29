// import './wdyr.js'
import 'react-native-gesture-handler'
import 'expo-asset'
import { AppRegistry, LogBox } from 'react-native'
// import 'expo-dev-client'

import App from './App'
import { name as appName } from './app.json'

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'Require cycles',
  'getNode()',
  'componentWill',
  'ImmutableStateInvariantMiddleware',
  'SerializableStateInvariantMiddleware',
])

AppRegistry.registerComponent(appName, () => App)
