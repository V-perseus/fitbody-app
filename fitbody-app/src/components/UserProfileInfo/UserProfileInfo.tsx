import React from 'react'
import { View, Text, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector } from 'react-redux'

import LocationIcon from '../../../assets/images/svg/icon/16px/location.svg'
import ProfileDefaultIcon from '../../../assets/images/svg/profile-placeholder.svg'
import styles from './styles'
import globals from '../../config/globals'
import { userSelector } from '../../data/user/selectors'

const UserProfileInfo = () => {
  const user = useSelector(userSelector)

  function buildLocationText() {
    return [user.city, user.country].filter((el) => el).join(', ')
  }

  return user ? (
    <LinearGradient style={styles.view} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLavender]}>
      {/* Image */}
      {user.profile_picture_url ? (
        <View style={styles.profileImageContainer}>
          <Image style={styles.headshot} source={{ uri: user.profile_picture_url }} />
        </View>
      ) : (
        <View>
          <View style={styles.headshotButton}>
            <View style={styles.profileDefaultImageContainer}>
              <ProfileDefaultIcon />
            </View>
          </View>
        </View>
      )}

      {/* Username */}
      <Text style={styles.userName}>{user.name?.toUpperCase()}</Text>

      {/* Location */}
      <View style={{ flexDirection: 'row', opacity: 1 }}>
        <LocationIcon color={globals.styles.colors.colorWhite} style={{ marginTop: 6, marginRight: 5 }} />
        <Text style={styles.location}>{buildLocationText()}</Text>
      </View>
    </LinearGradient>
  ) : (
    <View />
  )
}

export default UserProfileInfo
