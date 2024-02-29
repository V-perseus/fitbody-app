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

interface ITermsProps {
  navigation: NavigationProp<AccountStackParamList, 'Terms'>
}
const Terms = ({ navigation }: ITermsProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>TERMS AND CONDITIONS</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  const [terms, setTerms] = useState('')
  // const [version, setVersion] = useState('')
  // const [updatedAt, setUpdatedAt] = useState('')

  useEffect(() => {
    api.legal.terms().then((data) => {
      setTerms(data.terms.content)
      // setVersion(data.terms.version)
      // setUpdatedAt(data.terms.updated_at)
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.view}>
        <WebView style={styles.html} testID="webview" originWhitelist={['*']} source={{ html: terms }} />
      </View>
    </SafeAreaView>
  )
}

export default Terms
