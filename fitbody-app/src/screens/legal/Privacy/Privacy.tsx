import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, StatusBar } from 'react-native'
import { WebView } from 'react-native-webview'
import { NavigationProp } from '@react-navigation/native'

// API
import api from '../../../services/api'

// Assets
import styles from './styles'

// Components
import { HeaderButton } from '../../../components/Buttons/HeaderButton'

// Types
import { AccountStackParamList } from '../../../config/routes/routeTypes'

interface IPrivacyProps {
  navigation: NavigationProp<AccountStackParamList, 'Privacy'>
}
const Privacy: React.FC<IPrivacyProps> = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>PRIVACY POLICY</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  const [policy, setPolicy] = useState('')
  // const [version, setVersion] = useState('')
  // const [updatedAt, setUpdatedAt] = useState('')

  useEffect(() => {
    api.legal.privacy().then((data) => {
      setPolicy(data.policy.content)
      // setVersion(data.policy.version)
      // setUpdatedAt(data.policy.updated_at)
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.view}>
        <WebView style={styles.html} testID="webview" originWhitelist={['*']} source={{ html: policy }} />
      </View>
    </SafeAreaView>
  )
}

export default Privacy
