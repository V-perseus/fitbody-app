import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import { NavigationProp } from '@react-navigation/native'

// Components
import FAQHeader from '../../../../components/FAQ/FAQHeader'
import QuestionsScrollView from '../../../../components/FAQ/QuestionsScrollView'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'

// styles
import styles from './styles'

// Types
import { AccountStackParamList } from '../../../../config/routes/routeTypes'

export type ActiveTab = 'support' | 'workouts' | 'meals' | 'community'

interface IFAQProps {
  navigation: NavigationProp<AccountStackParamList, 'FAQ'>
}
function FAQ({ navigation }: IFAQProps) {
  const [active, setActive] = useState<ActiveTab>('support')

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>FAQ</Text>,
      headerLeft: () => <HeaderButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  function handlePres(tab: ActiveTab) {
    setActive(tab)
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient style={styles.headerStyle} colors={['rgba(255, 255, 255, 0.9)', 'rgba(227, 227, 227, 0.9)']}>
        <FAQHeader active={active} handlePress={handlePres} />
      </LinearGradient>
      <QuestionsScrollView section={active} />
    </SafeAreaView>
  )
}

export default FAQ
