import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Share from 'react-native-share'
import * as Animatable from 'react-native-animatable'
import Clipboard from '@react-native-community/clipboard'

// Assets
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'
import ShareIcon from '../../../assets/images/svg/icon/24px/share.svg'
import CopyIcon from '../../../assets/images/svg/icon/16px/copy.svg'

// Components
import { ButtonOpacity } from '../Buttons/ButtonOpacity'
import { ButtonIcon } from '../Buttons/ButtonIcon'

// Styles
import styles from './styles'
import globals from '../../config/globals'

// Types
import { MenuScreenUseNavigationProp } from '../../config/routes/routeTypes'

interface IReferralProgramModalProps {
  ambassadorCode: string
  navigation: MenuScreenUseNavigationProp
}
const ReferralProgramModal: React.FC<IReferralProgramModalProps> = ({ navigation, ambassadorCode }) => {
  const [copied, setHasCopied] = useState(false)
  const isCopied = copied ? 'Copied!' : ''

  function share() {
    Share.open({
      title: ambassadorCode,
      message: ambassadorCode,
    })
      .then(() => {
        setHasCopied(false)
        navigation.goBack()
      })
      .catch((err) => {
        err && console.log(err)
      })
  }

  function copy() {
    Clipboard.setString(ambassadorCode)
    setHasCopied(true)
  }

  function close() {
    setHasCopied(false)
    navigation.goBack()
  }

  return (
    <View style={styles.modalContainer}>
      <Animatable.View animation="fadeInUp">
        <View style={styles.modalContents}>
          <ButtonOpacity style={styles.cancelButton} onPress={close}>
            <CloseIcon color={globals.styles.colors.colorBlack} />
          </ButtonOpacity>
          <Text style={styles.modalTitle}>Referral Program</Text>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{'Share this link to invite a friend \n and start earning today!'}</Text>
          </View>
          <View style={styles.shareContainer}>
            <View style={styles.shareContainerView}>
              <Text style={styles.referralLink}> Referral Link </Text>
              <Text style={styles.copied}>{isCopied}</Text>
            </View>
            <TouchableOpacity onPress={copy}>
              <View style={styles.share}>
                <Text style={styles.referralCode} numberOfLines={1}>
                  {ambassadorCode}
                </Text>
                <CopyIcon color={copied ? globals.styles.colors.colorLove : globals.styles.colors.colorGrayDark} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.modalButtons}>
            <ButtonIcon
              text="SHARE YOUR LINK"
              style={styles.modalButton}
              onPress={share}
              useOpacity={true}
              rightIcon={() => <ShareIcon color={globals.styles.colors.colorWhite} />}
            />
          </View>
        </View>
      </Animatable.View>
    </View>
  )
}

export default ReferralProgramModal
