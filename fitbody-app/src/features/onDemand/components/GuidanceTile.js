import React from 'react'
import { Image, Pressable, Text, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Grayscale } from 'react-native-image-filter-kit'

import { CompletionCheckmark } from './CompletionCheckmark'

import Offline from '../../../../assets/images/svg/icon/40px/offline.svg'
import globals from '../../../config/globals'

import { resolveLocalUrl } from '../../../services/helpers'
import { formatVideoDuration, VIDEO_CATEGORIES } from '../helpers'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'

export const GuidanceTile = ({ navigation, onPress, item, index, complete }) => {
  const isOnline = useSelector((state) => state.offline.online)
  const trainers = useSelector((state) => state.data.workouts.trainers)
  const trainer = trainers.find((t) => t.id === item.trainer_id)

  function handlePress() {
    if (isOnline) {
      onPress()
    }
  }

  const thumbnail = { uri: resolveLocalUrl(item.thumbnail) }

  return (
    <Pressable style={[styles.container, { paddingTop: index === 0 ? 4 : 14 }]} onPress={handlePress}>
      <View style={styles.thumbnailContainer}>
        {isOnline ? (
          <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <>
            <Grayscale image={<Image style={styles.thumbnail} resizeMode="cover" source={thumbnail} />} />
            <View style={styles.offlineThumbnail}>
              <Offline color={'black'} />
            </View>
          </>
        )}
        <View style={styles.durationContainer}>
          <Text style={styles.durationContainerText}>{formatVideoDuration(item.duration)}</Text>
        </View>
        {/* <View style={styles.checkmarkContainer}>
          <CompletionCheckmark item={item} complete={complete} navigation={navigation} />
        </View> */}
      </View>
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultExerciseName}>{item.name}</Text>
        <Text style={styles.searchResultTrainerName}>{isOnline ? trainer.name : 'OFFLINE - RECONNECT TO ACCESS'}</Text>
      </View>
    </Pressable>
  )
}

export const GuidanceTileListItem = ({ item, navigation, categoryName, complete, index }) => {
  const { logVideoStarted } = useSegmentLogger()
  function onPress() {
    logVideoStarted(item, VIDEO_CATEGORIES.GUIDANCE, categoryName)
    navigation.navigate('Modals', {
      screen: 'Video',
      params: { video: item, type: VIDEO_CATEGORIES.GUIDANCE, category: categoryName, skipCompletionLogging: true },
    })
  }
  return <GuidanceTile onPress={onPress} item={item} index={index} complete={complete} navigation={navigation} />
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 207,
    margin: 8,
    shadowColor: globals.styles.colors.colorBlack,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  offlineThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
    flexDirection: 'column',
    alignSelf: 'center',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationContainer: {
    flex: 1,
    position: 'absolute',
    top: 8,
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: globals.styles.colors.colorBlack,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: 52,
    height: 24,
    borderRadius: 24,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  durationContainerText: {
    fontSize: 10,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  searchResultInfo: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  searchResultExerciseName: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
    fontSize: 16,
    textAlign: 'center',
  },
  searchResultTrainerName: {
    color: globals.styles.colors.colorGrayDark,
    fontSize: 14,
  },
})
