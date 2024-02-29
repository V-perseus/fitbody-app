import React from 'react'
import { ScrollView } from 'react-native'
import { ActiveTab } from '../../screens/tabs/account/FAQ/FAQ'
import FAQButton from './FAQButton'

interface IFAQHeaderProps {
  active: ActiveTab
  handlePress: (tab: ActiveTab) => void
}
const FAQHeader: React.FC<IFAQHeaderProps> = ({ active, handlePress }) => {
  return (
    <ScrollView horizontal={true}>
      <FAQButton active={active === 'support'} title="TECH SUPPORT" handlePress={() => handlePress('support')} />
      <FAQButton active={active === 'workouts'} title="WORKOUTS" handlePress={() => handlePress('workouts')} />
      <FAQButton active={active === 'meals'} title="MEALS" handlePress={() => handlePress('meals')} />
      <FAQButton active={active === 'community'} title="COMMUNITY" handlePress={() => handlePress('community')} />
    </ScrollView>
  )
}

export default FAQHeader
