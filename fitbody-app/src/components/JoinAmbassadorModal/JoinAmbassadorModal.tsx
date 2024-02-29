import React, { useState } from 'react'
import { View, Text } from 'react-native'
import * as Animatable from 'react-native-animatable'

import api from '../../services/api'
import { updateUser } from '../../data/user'
import globals from '../../config/globals'
import { MenuScreenUseNavigationProp } from '../../config/routes/routeTypes'

// Assets
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'
import styles from './styles'
import { ButtonOpacity } from '../Buttons/ButtonOpacity'
import { ButtonSquare } from '../Buttons/ButtonSquare'

const JoinNowButtonComponent = ({ text }: { text: string }) => {
  const [loading, setLoading] = useState(false)

  const getAmbassadorStatus = async () => {
    try {
      setLoading(true)
      const res = await api.users.joinAmbassador()
      setLoading(false)
      if (res) {
        updateUser(res.user)
        return
      }
      return
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <ButtonSquare style={styles.modalButton} text={text} loading={loading} onPress={loading ? () => {} : () => getAmbassadorStatus()} />
  )
}

interface IJoinAmbassadorModalProps {
  navigation: MenuScreenUseNavigationProp
}
const JoinAmbassadorModal: React.FC<IJoinAmbassadorModalProps> = (props) => {
  const { navigation } = props
  return (
    <View style={styles.modalContainer}>
      <Animatable.View animation="fadeInUp">
        <View style={styles.modalContents}>
          <ButtonOpacity style={styles.cancelIcon} onPress={() => navigation.goBack()}>
            <CloseIcon color={globals.styles.colors.colorBlack} />
          </ButtonOpacity>
          <Text style={styles.modalTitle}>{'Loving the Fit Body app and \n want to invite a friend?'}</Text>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>GIVE 25%. GET 25%.</Text>
          </View>
          <Text style={styles.description}>
            {
              'For every friend who signs up through your referral link, you get 25% commission on their first payment, and your friend gets 25% off their first payment!*\n\nBonus! For every 20 successful referrals, get an additional $20! \n \n Join now to get your own share link and start earning today!'
            }
          </Text>
          <View style={styles.modalButtons}>
            <JoinNowButtonComponent text={'JOIN NOW'} />
          </View>
          <Text style={styles.footnote}>
            {'*Friend must be a new member. Commission will be approved once friend makes their first payment.'}
          </Text>
        </View>
      </Animatable.View>
    </View>
  )
}

export default JoinAmbassadorModal
