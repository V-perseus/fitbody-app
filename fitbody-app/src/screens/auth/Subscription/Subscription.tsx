import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  useIAP,
  getAvailablePurchases,
  SubscriptionPurchase,
  Subscription as RNIAPSubscription,
  SubscriptionPlatform,
  clearTransactionIOS,
} from 'react-native-iap'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'
import { Text, View, Platform, ScrollView, Linking, Image } from 'react-native'

// Components
import { SubscriptionCard } from './SubscriptionCard'
import FocusAwareStatusBar from '../../../shared/FocusAwareStatusBar'
import HTMLModal from '../../../components/HTMLModal'
import ContactSupport from '../../../components/ContactSupport/ContactSupport'
import AndroidBackHandler from '../../../components/AndroidBackHandler'
import { HeaderButton } from '../../../components/Buttons/HeaderButton'
import { ButtonRound } from '../../../components/Buttons/ButtonRound'

// Assets
import BarbellIcon from '../../../../assets/images/svg/icon/40px/equiptment/barbell.svg'
import TrophyIcon from '../../../../assets/images/svg/icon/40px/trophy.svg'
import MealsIcon from '../../../../assets/images/svg/icon/40px/meals.svg'
import MacrosIcon from '../../../../assets/images/svg/icon/40px/macros.svg'
import TrackerIcon from '../../../../assets/images/svg/icon/40px/tracker.svg'
import GuidanceIcon from '../../../../assets/images/svg/icon/40px/guidance.svg'
import LoadingGif from '../../../../assets/gif/loading.gif'
import styles from './styles'
import globals from '../../../config/globals'

// Services & Data
import api from '../../../services/api'
import { setErrorMessage } from '../../../services/error'
import { userSelector } from '../../../data/user/selectors'
import { updateUser } from '../../../data/user'
import { validateAppleSubscription, validateGoogleSubscription } from '../../../services/session'
import { SubscriptionStackOptionsProps } from '../../../config/routes/routeTypes'
import { displayLoadingModal, hideLoadingModal } from '../../../services/loading'

// Which store are we buying from
const STORE = Platform.select({
  ios: 'Apple ID',
  android: 'Google Play',
})

// Purchasing Plans
const PLANS = Platform.select({
  ios: [
    // 'com.BodyLoveGroupLLC.BodyLove.threemonthmembershippromo',
    // 'com.BodyLoveGroupLLC.BodyLove.oneyearmembershipblackfriday',
    'com.BodyLoveGroupLLC.BodyLove.oneyearsummerpromo',
    // 'com.BodyLoveGroupLLC.BodyLove.oneyearmembership',
    'com.BodyLoveGroupLLC.BodyLove.onemonthmembership',
    // 'com.BodyLoveGroupLLC.BodyLove.onemonthtrialtest',
  ],
  android: [
    // '3monthpromomembership',
    // '1yearmembershipblackfriday',
    '1yearmembershipsummerpromo',
    // '1yearmembership',
    '19.99onemonthmembership',
    // '400.00onemonthmembership.trial',
  ],
})

export interface ISubscriptionData {
  amount: string
  period: string
  term: string
  highlighted?: boolean
  highlightedText?: string
  highlightColor?: string
  originalPrice?: string
  productId: string
  sub: RNIAPSubscription | null
}
const SUBSCRIPTIONS: ISubscriptionData[] = [
  // {
  //   amount: '$27.99 / 3 MONTHS',
  //   period: '3 months',
  //   term: 'Only $0.29 a day!',
  //   highlighted: true,
  //   highlightedText: 'SPRING PROMO: 53% OFF!',
  //   originalPrice: '$59.97',
  //   productId: PLANS![0],
  //   sub: null,
  // },
  {
    amount: '$99.99 / YEAR',
    period: '12 months',
    term: 'Only $0.27 a day!',
    highlighted: true,
    highlightedText: 'SUMMER SALE: 58% OFF!',
    originalPrice: '$239.88',
    productId: PLANS![0],
    sub: null,
  },
  // {
  //   amount: '$119.99 / YEAR',
  //   period: '12 months',
  //   term: 'Only $0.33 a day!',
  //   highlighted: true,
  //   highlightedText: '50% OFF!',
  //   originalPrice: '$239.88',
  //   productId: PLANS![0] /* make sure productId matches the index from SUBSCRIPTIONS const */,
  //   sub: null,
  // },
  {
    amount: '$19.99 / MONTH',
    period: '1 month',
    term: 'Only $0.67 a day!',
    productId: PLANS![1],
    sub: null,
  },
]

interface ISubscriptionProps extends SubscriptionStackOptionsProps {}
const Subscription: React.FC<ISubscriptionProps> = ({ navigation, route }) => {
  const { connected, subscriptions, getSubscriptions, requestSubscription } = useIAP()

  const [showLegalModal, setShowLegalModal] = useState(false)
  const [legalModalTitle, setLegalModalTitle] = useState('')
  const [legalModalContent, setLegalModalContent] = useState('')
  const [enrichedSubData, setEnrichedSubData] = useState<ISubscriptionData[]>(SUBSCRIPTIONS)
  const [loading, setLoading] = useState(true)

  const user = useSelector(userSelector)

  const redirectTo = useRef(() => navigation.navigate('ProgramDetails', { fromCategories: false, slug: user.workout_goal }))

  useEffect(() => {
    async function fetch() {
      await getSubscriptions({ skus: PLANS! })
    }
    if (connected && PLANS) {
      fetch()
    }
  }, [getSubscriptions, connected, PLANS])

  useEffect(() => {
    if (subscriptions.length) {
      // console.log('SUBS', subscriptions)
      const enriched = SUBSCRIPTIONS.map((s): ISubscriptionData => {
        const subFromStore = subscriptions.find((ss) => s.productId === ss.productId)
        return {
          ...s,
          sub: subFromStore || null,
        }
      })
      setEnrichedSubData(enriched)
      setLoading(false)
    }
  }, [subscriptions])

  useFocusEffect(
    useCallback(() => {
      const handleBack = () => {
        if (user.workout_goal && redirectTo) {
          redirectTo.current()
        } else {
          navigation.navigate('RecommendedPrograms', { fromCategories: false })
        }
      }
      navigation.setOptions({
        gestureEnabled: false,
        headerTitle: () => null,
        headerShadowVisible: false,
        headerLeft: () => <HeaderButton onPress={handleBack} />,
        headerRight: () => (
          <ButtonRound onPress={getPurchases} text="RESTORE PURCHASES" textStyle={styles.restoreButtonText} style={styles.restoreButton} />
        ),
      })
    }, [navigation, user]),
  )

  useEffect(() => {
    if (route.params?.from) {
      redirectTo.current = () => navigation.navigate({ name: route.params!.from as any, params: route.params?.params })
    }
  }, [route.params, navigation])

  /**
   * Purchase a Subscription
   */
  const buySubscribeItem = async (sub: RNIAPSubscription) => {
    try {
      displayLoadingModal()
      if (sub.platform === SubscriptionPlatform.ios) {
        await clearTransactionIOS()
        await requestSubscription({ sku: sub.productId })
      } else if (sub.platform === SubscriptionPlatform.android) {
        await requestSubscription({
          sku: sub.productId,
          subscriptionOffers: [{ sku: sub.productId, offerToken: sub.subscriptionOfferDetails[0].offerToken }],
        })
      } else {
        setErrorMessage({ error: 'OS not currently supported' })
        hideLoadingModal()
      }
    } catch (err) {
      hideLoadingModal()
      // Errors are caught in purchaseErrorListener
    }
  }

  /**
   * Get all Purchases a User has made
   */
  const getPurchases = async () => {
    try {
      const purchases = await getAvailablePurchases()
      // We have purchaeses...
      if (purchases && purchases.length > 0) {
        // Verify them...
        if (Platform.OS === 'ios') {
          verifyApple(purchases[0])
        } else {
          verifyGoogle(purchases[0])
        }
      } else {
        setErrorMessage({
          error: "We can't find an active membership for you. Please choose a plan or contact us through the link below.",
          errorIcon: 'NoSubscriptionAlert',
        })
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage({ error: `${err.message}\nPlease try again.` })
      }
    }
  }

  // const trackSignUpCompleted = () => {
  //   logEvent(null, 'Signup Completed', {
  //     plan_name: PLANS[this.state.isSelected],
  //     promo_code: null,
  //     device_type: 'app',
  //     free_trial: false,
  //     trial_length_days: 0,
  //   })
  // }

  const handleVerifyResult = async (data: { is_active: 0 | 1 | boolean }) => {
    if (data.is_active) {
      // if (data.first_sub) {
      //   trackSignUpCompleted()
      // }
      const res = await api.users.getCurrentUserObject()
      updateUser(res.user)
      navigation.navigate('Home')
      return
    } else {
      setErrorMessage({
        error: "We can't find an active membership for you. Please choose a plan or contact us through the link below.",
        errorIcon: 'NoSubscriptionAlert',
      })
    }
  }

  /**
   * Verify a purchase with the Fit Body servers
   */
  const verifyApple = async (purchase: SubscriptionPurchase) => {
    try {
      const res = await validateAppleSubscription(purchase.transactionReceipt)
      handleVerifyResult(res)
    } catch (error) {
      console.log('VERIFY APPLE ERROR:', error)
    }
  }

  /**
   * Verify a purchase with the Fit Body servers
   */
  const verifyGoogle = async (purchase: SubscriptionPurchase) => {
    try {
      if (!purchase.purchaseToken) {
        setErrorMessage({
          error: "We can't find an active membership for you. Please choose a plan or contact us through the link below.",
          errorIcon: 'NoSubscriptionAlert',
        })
        return
      }
      const res = await validateGoogleSubscription({
        token: purchase.purchaseToken,
        subscription: purchase.productId,
      })
      handleVerifyResult(res)
    } catch (error) {
      console.log('VERIFY GOOGLE ERROR', error)
    }
  }

  /**
   * Calculate total amount billed
   */
  // function getTotalAmountBilled(period) {
  //   if (isSelected === 0) {
  //     return selectedAmount * 12
  //   } else if (isSelected === 1) {
  //     return selectedAmount * 1
  //   } else {
  //     return selectedAmount
  //   }
  // }

  function closeLegalModal() {
    setShowLegalModal(false)
  }

  function triggerLegalModal(doc: 'terms' | 'privacy') {
    if (doc === 'terms') {
      api.legal.terms().then((data) => {
        let content = _.get(data, 'terms.content', false)
        if (content) {
          setShowLegalModal(true)
          setLegalModalTitle('Terms and Conditions')
          setLegalModalContent(content)
        }
      })
    }

    if (doc === 'privacy') {
      api.legal.privacy().then((data) => {
        let content = _.get(data, 'policy.content', false)
        if (content) {
          setShowLegalModal(true)
          setLegalModalTitle('Privacy Policy')
          setLegalModalContent(content)
        }
      })
    }
  }

  const onContactUs = () => {
    Linking.openURL('mailto:hello@fitbodyapp.com?subject=Question about my Fit Body app')
  }

  function drawSubscriptions() {
    return (
      <View style={{ flex: 1, backgroundColor: globals.styles.colors.colorWhite }}>
        <FocusAwareStatusBar barStyle="dark-content" />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>START YOUR 7-DAY{'\n'}FREE TRIAL TODAY!</Text>
              <Text style={styles.headerSubtitle}>SELECT YOUR MEMBERSHIP</Text>
            </View>

            <View style={styles.subscriptionButtonView}>
              {enrichedSubData.length > 0 && !loading ? (
                enrichedSubData.map((s, i) => {
                  return s.sub ? (
                    <SubscriptionCard
                      key={i}
                      sub={s}
                      highlighted={s.highlighted}
                      onPress={buySubscribeItem}
                      highlightColor={s.highlightColor}
                    />
                  ) : null
                })
              ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 380, width: '100%' }}>
                  <Image source={LoadingGif} style={{ height: 54 }} resizeMode="contain" />
                </View>
              )}
            </View>

            <ContactSupport
              color={globals.styles.colors.colorBlack}
              style={styles.contactSupport}
              onPress={onContactUs}
              linkColor={globals.styles.colors.colorLove}
            />

            <Text style={styles.benifitsHeadline}>{'EVERYTHING YOU NEED\nTO REACH YOUR GOALS'}</Text>
            {/* Benfits */}
            <View style={styles.benifitsContainer}>
              <View style={styles.benefitContainer}>
                <BarbellIcon color={globals.styles.colors.colorLove} />
                <Text style={styles.benefitTitle}>{'Strength\nTraining'}</Text>
              </View>

              <View style={styles.benefitContainer}>
                <TrophyIcon color={globals.styles.colors.colorLove} />
                <Text style={styles.benefitTitle}>{'Yoga + Flexibility\nTraining'}</Text>
              </View>

              <View style={styles.benefitContainer}>
                <MealsIcon color={globals.styles.colors.colorLove} />
                <Text style={styles.benefitTitle}>{'300+\neasy recipes '}</Text>
              </View>

              <View style={styles.benefitContainer}>
                <MacrosIcon color={globals.styles.colors.colorLove} />
                <Text style={styles.benefitTitle}>{'Daily Food\nTracker'}</Text>
              </View>

              <View style={styles.benefitContainer}>
                <TrackerIcon color={globals.styles.colors.colorLove} />
                <Text style={styles.benefitTitle}>{'wellness\njournal'}</Text>
              </View>

              <View style={styles.benefitContainer}>
                <GuidanceIcon color={globals.styles.colors.colorLove} />
                <Text style={styles.benefitTitle}>{'On Demand\nClasses'}</Text>
              </View>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              {/* <View style={styles.termsRow}>
                <View style={styles.termsColumn}>
                  <Text style={styles.termsBullet}>{'\u00B7'}</Text>
                </View>
                <View>
                  <Text style={styles.termsText}>
                    <Text style={{ color: globals.styles.colors.colorLove, fontSize: 12 }}>*&nbsp;</Text>
                    Your 7-day free trial will begin today! Your membership will automatically roll over to a recurring 3-month membership
                    unless cancelled before the promo period ends. Your membership will be billed in one payment of $53.99 every 3 month(s)
                    after your first discounted payment of $19.99.
                  </Text>
                </View>
              </View> */}
              <View style={styles.termsRow}>
                <View style={styles.termsColumn}>
                  <Text style={styles.termsBullet}>{'\u00B7'}</Text>
                </View>
                <View>
                  <Text style={styles.termsText}>
                    By signing up for a membership, you agree to the{'\n'}
                    <Text onPress={() => triggerLegalModal('terms')} style={styles.legalLink}>
                      Terms and Service
                    </Text>{' '}
                    &amp;{' '}
                    <Text onPress={() => triggerLegalModal('privacy')} style={styles.legalLink}>
                      Privacy Policy
                    </Text>
                    .
                  </Text>
                </View>
              </View>
              <View style={styles.termsRow}>
                <View style={styles.termsColumn}>
                  <Text style={styles.termsBullet}>{'\u00B7'}</Text>
                </View>
                <View>
                  <Text style={styles.termsText}>Payment will be charged to {STORE} account at the confirmation of purchase.</Text>
                </View>
              </View>
              <View style={styles.termsRow}>
                <View style={styles.termsColumn}>
                  <Text style={styles.termsBullet}>{'\u00B7'}</Text>
                </View>
                <View>
                  <Text style={styles.termsText}>
                    Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period.
                  </Text>
                </View>
              </View>
              <View style={styles.termsRow}>
                <View style={styles.termsColumn}>
                  <Text style={styles.termsBullet}>{'\u00B7'}</Text>
                </View>
                <View>
                  <Text style={styles.termsText}>
                    Your {STORE} account will be charged for renewal within 24 hours prior to the end of the currrent period.
                  </Text>
                </View>
              </View>
              <View style={styles.termsRow}>
                <View style={styles.termsColumn}>
                  <Text style={styles.termsBullet}>{'\u00B7'}</Text>
                </View>
                <View>
                  <Text style={styles.termsText}>
                    You can manage and cancel your Fit Body app subscription by going to your account settings on the {STORE} store after
                    purchase.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  /**
   * Render them all
   */
  if (showLegalModal) {
    return <HTMLModal title={legalModalTitle} content={legalModalContent} onClose={closeLegalModal} />
  } else {
    return drawSubscriptions()
  }
}

const AndroidBackHandlerHOC = (props: ISubscriptionProps) => {
  return (
    <AndroidBackHandler>
      <Subscription {...props} />
    </AndroidBackHandler>
  )
}

export default AndroidBackHandlerHOC
