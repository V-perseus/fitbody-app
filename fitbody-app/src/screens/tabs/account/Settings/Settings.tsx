import React, { useLayoutEffect } from 'react'
import { Text, TouchableOpacity, StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp } from '@react-navigation/native'
import deviceInfoModule from 'react-native-device-info'

// Assets
import styles from './styles'

// Components
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// Services
// import api from '../../../../services/api'
// import { updateUser } from '../../../../data/user'
// import { useAppSelector } from '../../../../store/hooks'
import { AccountStackParamList } from '../../../../config/routes/routeTypes'

interface ISettingsProps {
  navigation: NavigationProp<AccountStackParamList, 'Settings'>
}
const Settings = ({ navigation }: ISettingsProps) => {
  // const user = useAppSelector((state) => state.data.user)
  // const [notifications] = useState(user.notification_enable)

  // const isFirstRun = useRef(true)

  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false
  //     return
  //   }
  //   api.users
  //     .updateUserProfile({
  //       id: user.id,
  //       notification_enable: notifications,
  //     })
  //     .then((data) => updateUser(data.user))
  // }, [notifications])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>SETTINGS</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <StatusBar barStyle="dark-content" />

        {/* Notifications */}
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('NotificationSettings')} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Notifications</Text>
        </TouchableOpacity>

        {/* Downloads */}
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Downloads')} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Downloads</Text>
        </TouchableOpacity>

        {/* Password */}
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('ChangePassword')} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* Account Deletion */}
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AccountDeletion')} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Data Deletion Request</Text>
        </TouchableOpacity>

        {/* T's & C's */}
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Terms')} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Terms & Conditions</Text>
        </TouchableOpacity>

        {/* Policy */}
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Privacy')} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={[styles.buttonContainer, { borderBottomWidth: 0, flex: 1, justifyContent: 'flex-end' }]}>
          <Text style={styles.buttonText}>Version: {deviceInfoModule?.getVersion()}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Settings
