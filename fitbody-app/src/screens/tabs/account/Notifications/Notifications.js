import React, { useEffect, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { Text, ScrollView, StatusBar, View } from 'react-native'

// Components
import ListHeader from '../../../../components/Notifications/ListHeader'
import NotificationList from '../../../../components/Notifications/NotificationList'
import { HeaderButton } from '../../../../components/Buttons/HeaderButton'
import SettingsIcon from '../../../../../assets/images/svg/icon/24px/navigation/cog.svg'

// Styles
import styles from './styles'
import globals from '../../../../config/globals'

// Actions
import { clearAllNotifications, getNotifications, readAllNotifications } from '../../../../data/notification'

const Notifications = ({ navigation }) => {
  const notifications = useSelector((state) => state.data.notification)

  const unread = notifications.filter((item) => item.read_at === null)
  const read = notifications.filter((item) => item.read_at !== null)

  useLayoutEffect(() => {
    const { goBack, navigate } = navigation
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>NOTIFICATIONS</Text>,
      headerLeft: () => <HeaderButton onPress={() => goBack()} />,
      headerRight: () => (
        <HeaderButton onPress={() => navigate('NotificationSettings')}>
          <SettingsIcon color={globals.styles.colors.colorBlack} />
        </HeaderButton>
      ),
      headerTransparent: false,
    })
  }, [navigation])

  useEffect(() => {
    getNotifications()
  }, [])

  function clearAll() {
    clearAllNotifications()
  }

  function readAll() {
    readAllNotifications()
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={globals.styles.container}>
        <ListHeader title={'unread'} action={'Mark all as Read'} handler={readAll} />
        <View style={{ flex: 1, borderBottomWidth: 8, borderBottomColor: globals.styles.colors.colorGray }}>
          {unread.map((u, index) => (
            <NotificationList key={`unread-${index}`} notificationCount={unread.length} navigation={navigation} item={u} active />
          ))}
        </View>
        <ListHeader title={'read'} style={{ borderTopWidth: 8 }} action={'Clear All'} handler={clearAll} />
        {read.map((u, index) => (
          <NotificationList key={`read-${index}`} navigation={navigation} item={u} />
        ))}
      </ScrollView>
    </View>
  )
}

export default Notifications
