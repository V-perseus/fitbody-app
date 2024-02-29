import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Linking, Animated, Pressable } from 'react-native'
import moment from 'moment'
import { Notifications } from 'react-native-notifications'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import globals from '../../config/globals'
import CloseIcon from '../../../assets/images/svg/icon/24px/close.svg'
import ExternalLinkIcon from '../../../assets/images/svg/icon/16px/external-link.svg'
import { NotifcationsIconMap } from '../../config/svgs/dynamic/notificationsMap'

// Actions
import MealPlanModal from '../MealPlanModal'
import NavigationService from '../../services/NavigationService'
import { deleteNotification, readNotification } from '../../data/notification'

const NotificationList = ({ item, active, notificationCount }) => {
  const [showDialog, setShowDialog] = useState(false)
  const [url, setUrl] = useState('')

  function renderRightActions(progress, dragX) {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 101],
      outputRange: [0, 0, 1],
    })
    return (
      <Animated.View style={[styles.deleteContainer, { transform: [{ translateX: trans }] }]}>
        <TouchableOpacity style={styles.delete} onPress={() => deleteNotification(item)}>
          <CloseIcon width={30} height={30} color={globals.styles.colors.colorWhite} />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const SvgIcon = NotifcationsIconMap?.[item.type]

  function handlePress() {
    if (active) {
      Notifications.ios.setBadgeCount(notificationCount - 1)
      readNotification({ ...item, read_at: Date.now() })
    }

    if (item.data.meta?.url) {
      setShowDialog(true)
      setUrl(item.data.meta.url)
      return
    }

    switch (item.type) {
      case 'InactiveUser':
        break
      case 'DailyWorkout':
        break
      case 'NewChallenge':
        break
      case 'InactiveTrialUser':
        NavigationService.reset([{ name: 'Home' }])
        break
      case 'ProgressPhoto':
        NavigationService.reset([{ name: 'ProgressPhotos' }])
        break
      case 'WaterIntake':
        break
      case 'CompleteFirstWorkout':
        NavigationService.reset([{ name: 'Home' }])
        break
      default:
        break
    }
  }

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={handlePress} style={{ backgroundColor: '#FFF' }}>
        <View style={[styles.item, item.read_at ? null : styles.unread]}>
          {SvgIcon && <SvgIcon width={64} height={64} />}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.data?.title}</Text>
            <Text style={styles.descriptionLabel}>{item.data?.text}</Text>
          </View>
          {item.data?.meta?.url && <ExternalLinkIcon color={globals.styles.colors.darkPink} />}
          <Text style={styles.timeLabel}>{moment(item.created_at).fromNow()}</Text>
        </View>
      </Pressable>
      <MealPlanModal
        showModal={showDialog}
        modalText={'Open link in browser?'}
        noButtonText={'CANCEL'}
        yesButtonText={'VISIT'}
        noButtonPressHandler={() => setShowDialog(false)}
        yesButtonPressHandler={() => {
          setShowDialog(false)
          Linking.openURL(url)
        }}
      />
    </Swipeable>
  )
}

export default NotificationList

const styles = StyleSheet.create({
  item: {
    flex: 1,
    borderColor: globals.styles.colors.colorWhite,
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 14,
  },
  title: {
    color: globals.styles.colors.colorBlack,
    fontSize: 15,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  timeLabel: {
    fontSize: 13,
    paddingLeft: 10,
    color: globals.styles.colors.colorBlack,
  },
  descriptionLabel: {
    fontSize: 15,
    color: globals.styles.colors.colorBlack,
  },
  unread: {
    backgroundColor: globals.styles.colors.colorTransparent30SkyBlue,
  },
  delete: {
    fontSize: 30,
    color: globals.styles.colors.colorWhite,
    textAlign: 'center',
  },
  deleteContainer: {
    width: 81,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: globals.styles.colors.colorPurple,
  },
})
