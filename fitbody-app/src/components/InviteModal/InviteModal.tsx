import React from 'react'
import { View } from 'react-native'

import JoinAmbassadorModal from '../JoinAmbassadorModal'
import ReferralProgramModal from '../ReferralProgramModal'

import globals from '../../config/globals'
import { useAppSelector } from '../../store/hooks'
import { MenuScreenUseNavigationProp } from '../../config/routes/routeTypes'

interface IInviteModalProps {
  navigation: MenuScreenUseNavigationProp
}
const InviteModal: React.FC<IInviteModalProps> = ({ navigation }) => {
  const {
    user: { ambassador_link: ambassadorLink, is_ambassador: isAmbassador },
  } = useAppSelector((state) => {
    return state.data
  })

  return (
    <View style={globals.styles.container}>
      {isAmbassador && ambassadorLink ? (
        <ReferralProgramModal navigation={navigation} ambassadorCode={ambassadorLink} />
      ) : (
        <JoinAmbassadorModal navigation={navigation} />
      )}
    </View>
  )
}

export default InviteModal
