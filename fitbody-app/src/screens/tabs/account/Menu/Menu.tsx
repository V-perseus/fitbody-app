import React, { useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Text, TouchableOpacity, View, ScrollView, Pressable } from 'react-native'
import { useDispatch } from 'react-redux'

// Assets
import { translate } from '../../../../../App'
import styles from './styles'
import globals from '../../../../config/globals'
import FitBody from '../../../../../assets/images/logo/fitbody.svg'
import Logout from '../../../../../assets/images/svg/icon/32px/log out.svg'
import Notification from '../../../../../assets/images/svg/icon/32px/notification.svg'

// Components
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'

// Services
import { clearUser } from '../../../../data/user'
import { clearWorkouts, fetchTrainersPrograms } from '../../../../data/workout'
import { clearNotifications } from '../../../../data/notification'
import { clearSession } from '../../../../services/session'
import { useAppSelector } from '../../../../store/hooks'
import { MenuScreenUseNavigationProp } from '../../../../config/routes/routeTypes'
import { useSegmentLogger } from '../../../../services/hooks/useSegmentLogger'

interface IMenuProps {
  navigation: MenuScreenUseNavigationProp
}
const Menu = ({ navigation }: IMenuProps) => {
  const { navigate } = navigation
  const {
    notification,
    user: { is_ambassador: isAmbassador },
  } = useAppSelector((state) => state.data)

  const unread = notification.filter((item) => item.read_at === null)
  const dispatch = useDispatch()
  const { logEvent } = useSegmentLogger()

  function showModal() {
    if (!isAmbassador) {
      logEvent(null, 'Popup Shown', {
        name: 'Invite A Friend',
        step: 'Join Now',
      })
    } else {
      logEvent(null, 'Popup Shown', {
        name: 'Invite A Friend',
        step: 'Share Your Link',
      })
    }
    navigate('Modals', { screen: 'Invite' })
  }

  function handleContactUs() {
    navigate('Modals', {
      screen: 'ContactDialog',
    })
  }

  useEffect(() => {
    const doLogout = () => {
      clearUser()
      clearNotifications()
      clearWorkouts()
      clearSession()
    }

    const handleLogout = () => {
      navigation.navigate('Modals', {
        screen: 'ConfirmationDialog',
        params: {
          title: 'Are you sure you want to sign out of the app?',
          body: null,
          yesLabel: 'SIGN OUT',
          noLabel: 'NEVER MIND',
          yesHandler: doLogout,
          // noHandler: () => {},
          iconType: null,
        },
      })
    }

    navigation.setOptions({
      headerTitle: () => null,
      headerRight: () => (
        <Pressable onPress={handleLogout} style={{ paddingHorizontal: 24 }}>
          <Logout color={globals.styles.colors.colorWhite} />
        </Pressable>
      ),
      headerLeft: () => (
        <Pressable onPress={() => navigation.navigate('Notifications')} style={{ paddingHorizontal: 24 }} hitSlop={8}>
          <Notification color={globals.styles.colors.colorWhite} />
          {unread.length > 0 && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: globals.styles.colors.colorLove,
                right: 24,
                top: 2,
                borderRadius: 6.5,
                width: 13,
                height: 13,
              }}
            />
          )}
        </Pressable>
      ),
    })
  }, [unread.length, dispatch, navigation])

  // console.log(isAmbassador, ambassadorLink, ambassadorCode)
  return (
    <LinearGradient style={styles.container} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLavender]}>
      <FocusAwareStatusBar barStyle="light-content" />
      <View style={styles.view}>
        {/* Body Love logo */}
        <View style={styles.logo}>
          <FitBody color={globals.styles.colors.colorWhite} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* For test builds only. Exposes paywall without needing an expired/non-existing subscription */}
          {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate('Subscription')}>
            <Text style={styles.buttonText}>SUBSCRIBE NOW</Text>
          </TouchableOpacity> */}
          {/* For test builds only, truggers redownload of all trainers and programs */}
          {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => fetchTrainersPrograms({ forceDownload: true })}>
            <Text style={styles.buttonText}>FORCE DOWNLOAD</Text>
          </TouchableOpacity> */}
          {/* Profile */}
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate('ProfileView')}>
            <Text style={styles.buttonText}>{translate('app.profile.copy4').toUpperCase()}</Text>
          </TouchableOpacity>

          {/* invite a friend */}
          <TouchableOpacity style={styles.buttonContainer} onPress={showModal}>
            <Text style={styles.buttonText}>{translate('app.profile.copy56').toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Progress Photos */}
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate('ProgressPhotos')}>
            <Text style={styles.buttonText}>{translate('app.profile.copy5').toUpperCase()}</Text>
          </TouchableOpacity>

          {/* FAQ */}
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate('FAQ')}>
            <Text style={styles.buttonText}>{translate('app.profile.copy1').toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Email Us */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleContactUs}
            // onPress={() => Linking.openURL('mailto:hello@fitbodyapp.com?subject=Question about my Fit Body app')}
          >
            <Text style={styles.buttonText}>{translate('app.profile.copy').toUpperCase()}</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate('Settings')}>
            <Text style={styles.buttonText}>{translate('app.profile.copy6').toUpperCase()}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  )
}

export default Menu
