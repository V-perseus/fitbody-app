import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { NavigationProp, useNavigation } from '@react-navigation/native'

// Assets
import ChevronRightIcon from '../../../assets/images/svg/icon/16px/cheveron/right.svg'
import ExternalLinkIcon from '../../../assets/images/svg/icon/24px/external-link.svg'
import LockIcon from '../../../assets/images/svg/icon/24px/lock-fill.svg'
import colors from '../../config/colors'
import globals from '../../config/globals'
import styles from './styles'

// Components
import SegueModal from '../SegueModal/SegueModal'

// Data
import NavigationService from '../../services/NavigationService'
import { trialDaysRemainingSelector, userSelector } from '../../data/user/selectors'
import { UserEatingPreference } from '../../data/user/types'
import api from '../../services/api'
import { useSegmentLogger } from '../../services/hooks/useSegmentLogger'

// Types
import { MainStackParamList } from '../../config/routes/routeTypes'

enum IconKeys {
  chevron = 'chevron',
  externalLink = 'externallink',
}
const ICON_KEYS = {
  chevron: 'chevron',
  externalLink: 'externallink',
}
const API_BASE = globals.apiBase
const CARD_TOP_PADDING = 351
const NO_OP = () => {}

const UserDetailIcons = (iconKey: IconKeys) => {
  const color = colors.colorPink
  let icon
  const iconDim = 16
  switch (iconKey) {
    case ICON_KEYS.chevron:
      icon = <ChevronRightIcon color={color} width={iconDim} height={iconDim} />
      break
    case ICON_KEYS.externalLink:
      icon = <ExternalLinkIcon color={color} width={iconDim} height={iconDim} />
      break
    default:
      break
  }
  return icon
}

interface IUserDetailProps {
  onPress: () => void
  title: string
  value?: string
  isGreyOut?: boolean
  isLocked?: boolean
  icon?: IconKeys
  style?: ViewStyle
  titleStyle?: TextStyle
  valueStyle?: TextStyle
}
const UserDetail = ({
  onPress,
  title,
  value,
  isGreyOut = false,
  isLocked = false,
  icon = IconKeys.chevron,
  style = {},
  titleStyle = {},
  valueStyle = {},
}: IUserDetailProps) => {
  const { userDetailTitleText, userDetailSettingsRow, userDetailValue } = styles
  const greyedStyle = isGreyOut || isLocked ? { color: colors.colorGrayDark } : {}
  return (
    <TouchableOpacity onPress={onPress} style={[userDetailSettingsRow, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isLocked && <LockIcon width={24} height={24} color={globals.styles.colors.colorPink} style={{ marginRight: 12 }} />}
        <Text style={[userDetailTitleText, titleStyle]}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[userDetailValue, greyedStyle, valueStyle]}>{value}</Text>
        {UserDetailIcons(icon)}
      </View>
    </TouchableOpacity>
  )
}

/**
 * Format a daily fuel number
 */
const renderDailyFuel = (df: number) => {
  return Math.trunc(df)
}

const fetchRecommendLink = async () => {
  const {
    data: { url },
  } = await api.users.getRecommendedProductsLink()
  return url
}

const UserProfileDetails = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  const logger = useSegmentLogger()
  const { navigate } = navigation

  const user = useSelector(userSelector)
  const trialDaysRemaining = useSelector(trialDaysRemainingSelector)

  const [showRecProductModal, setShowRecProductModal] = useState(false)
  const [recProductLink, setRecProductLink] = useState('')

  const calculatedDailyFuel = renderDailyFuel(user?.mpr ?? 0)
  const weightPref = user.exercise_weight_unit !== 'kg' ? 'pounds' : 'Kilogram'
  const dailyFuelValue = calculatedDailyFuel > 0 ? `${calculatedDailyFuel} calories` : 'CALCULATE'
  const isGreyedOut = calculatedDailyFuel > 0 ? false : true

  // console.log(isTrial)
  // console.log(trialDaysRemaining)

  const trialDaysRemainingDisplayAdjustment = trialDaysRemaining ? (trialDaysRemaining >= 7 ? 7 : trialDaysRemaining) : 0

  useEffect(() => {
    fetchRecommendLink()
      .then((link) => setRecProductLink(link))
      .catch(() => {})
  }, [])

  function handleNavigation(screen: 'EatingPreference' | 'CalculatedMacros' | 'WeightPreference') {
    if (user.is_restricted) {
      NavigationService.sendToPaywall({ from: 'Profile' })
    } else {
      navigate(screen, { fromProfile: true })
    }
  }

  function closeModal() {
    setShowRecProductModal(false)
  }

  function renderEatingPreference(ep: UserEatingPreference[]) {
    if (ep && ep.length > 1) {
      return `${ep.length} SELECTED`
    } else if (ep && ep.length === 1) {
      return ep[0].key.toUpperCase()
    }
    return 'SELECT'
  }

  function handleRecProductsPress() {
    if (recProductLink) {
      logger.logEvent(null, 'Popup Shown', {
        name: 'External Link',
        link: recProductLink,
        source: 'Profile',
      })
      setShowRecProductModal(true)
    }
  }

  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: CARD_TOP_PADDING }}
        scrollEventThrottle={16}
        style={{ overflow: 'visible', flex: 1, zIndex: 20, transform: [{ translateY: 0 }] }}>
        <View style={styles.profileUserDetailsContainer}>
          {trialDaysRemaining !== null && (
            <UserDetail
              title={'FREE TRIAL'}
              value={`${trialDaysRemainingDisplayAdjustment} Day${trialDaysRemainingDisplayAdjustment !== 1 ? 's' : ''} Remaining`}
              onPress={NO_OP}
              titleStyle={{ color: globals.styles.colors.colorLove }}
              valueStyle={{
                color: globals.styles.colors.colorBlack,
                textTransform: 'none',
                fontFamily: globals.fonts.primary.style.fontFamily,
              }}
            />
          )}
          <UserDetail
            title={'Eating Preferences'}
            // isGreyOut={user.is_restricted}
            isLocked={user.is_restricted}
            value={renderEatingPreference(user.eating_preferences || [])}
            onPress={() => handleNavigation('EatingPreference')}
          />
          <UserDetail
            title={'Weight Preference'}
            isLocked={user.is_restricted}
            value={weightPref}
            onPress={() => handleNavigation('WeightPreference')}
          />
          <UserDetail
            title={'Daily Fuel'}
            value={dailyFuelValue}
            isGreyOut={isGreyedOut}
            isLocked={user.is_restricted}
            onPress={() => handleNavigation('CalculatedMacros')}
          />
          <UserDetail title={'Recommended Supplements'} onPress={handleRecProductsPress} icon={IconKeys.externalLink} />
          {__DEV__ || API_BASE.includes('staging') ? (
            <UserDetail title={'[DEV] API'} value={API_BASE} onPress={NO_OP} style={{ borderBottomColor: 'transparent' }} />
          ) : null}
        </View>
      </ScrollView>
      <SegueModal
        modalText={'Open link in browser?'}
        noButtonText={'CANCEL'}
        yesButtonText={'VISIT'}
        url={recProductLink}
        showModal={showRecProductModal}
        setShowModal={closeModal}
      />
    </>
  )
}

export default UserProfileDetails
