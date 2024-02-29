import React from 'react'
import { Image, Pressable, Text, View, StyleSheet } from 'react-native'
import { Grayscale } from 'react-native-image-filter-kit'
import { useSelector } from 'react-redux'

import IntensityIconFilled from '../../../../assets/images/svg/icon/16px/intensity-filled.svg'
import IntensityIconOutline from '../../../../assets/images/svg/icon/16px/intensity-outline.svg'
import Offline from '../../../../assets/images/svg/icon/40px/offline.svg'
import PlayIcon from '../../../../assets/images/svg/icon/56px/circle/play-filled-inner.svg'

import { CompletionCheckmark } from './CompletionCheckmark'

import globals from '../../../config/globals'

import { resolveLocalUrl } from '../../../services/helpers'
import { formatVideoDuration, VIDEO_CATEGORIES } from '../helpers'
import { useSegmentLogger } from '../../../services/hooks/useSegmentLogger'

export const OnDemandTile = ({ navigation, onPress, item, index, complete }) => {
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
      <View style={styles.searchResultHeader}>
        <Text style={styles.searchResultExerciseName}>{item.name}</Text>
        <Text style={styles.searchResultTrainerName}>{isOnline ? trainer.name : 'OFFLINE - RECONNECT TO ACCESS'}</Text>
      </View>
      <View style={styles.thumbnailContainer}>
        {isOnline ? (
          <>
            <Image source={thumbnail} style={styles.thumbnail} resizeMode="cover" />
            <View style={styles.playButtonContainer}>
              <PlayIcon color={globals.styles.colors.colorWhite} />
            </View>
          </>
        ) : (
          <>
            <Grayscale image={<Image style={styles.thumbnail} resizeMode="cover" source={thumbnail} />} />
            <View style={styles.offlineThumbnail}>
              <Offline color={globals.styles.colors.colorBlackDark} />
            </View>
          </>
        )}
        <View style={styles.durationContainer}>
          <Text style={styles.durationContainerText}>{formatVideoDuration(item.duration)}</Text>
        </View>
        <View style={styles.checkmarkContainer}>
          <CompletionCheckmark item={item} complete={complete} navigation={navigation} />
        </View>
        <View style={styles.infoBox}>
          <View style={styles.infoBoxInner}>
            <View style={styles.infoBoxSection}>
              <Text style={styles.infoBoxSectionTitle}>Body Focus</Text>
              <Text style={styles.infoBoxSectionValue}>{item.body_focus}</Text>
            </View>
            <View style={styles.infoBoxSection}>
              <Text style={styles.infoBoxSectionTitle}>Impact</Text>
              <Text style={styles.infoBoxSectionValue}>{item.impact}</Text>
            </View>
            <View style={styles.infoBoxSection}>
              <Text style={styles.infoBoxSectionTitle}>Intensity</Text>
              <View style={styles.intensitySection}>
                {[1, 2, 3].map((n, idx) => {
                  if (n > item.intensity) {
                    return <IntensityIconOutline key={idx} color={globals.styles.colors.colorWhite} width={16} />
                  }
                  return <IntensityIconFilled key={idx} color={globals.styles.colors.colorWhite} width={16} />
                })}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export const OnDemandListItem = ({ item, navigation, idx, onComplete, categoryName, complete }) => {
  const { logVideoStarted } = useSegmentLogger()

  function onPress() {
    logVideoStarted(item, VIDEO_CATEGORIES.ON_DEMAND, categoryName)
    navigation.navigate('Modals', {
      screen: 'Video',
      params: { video: item, onComplete, type: VIDEO_CATEGORIES.ON_DEMAND, category: categoryName },
    })
  }
  return <OnDemandTile key={`video_${item.id}`} index={idx} onPress={onPress} item={item} complete={complete} navigation={navigation} />
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 44,
    borderBottomWidth: 1,
    borderBottomColor: globals.styles.colors.colorGray,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  durationContainerText: {
    fontSize: 10,
    fontFamily: globals.fonts.primary.boldStyle.fontFamily,
  },
  searchResultHeader: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  searchResultExerciseName: {
    color: globals.styles.colors.colorBlack,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: 20,
    textAlign: 'center',
  },
  searchResultTrainerName: {
    color: globals.styles.colors.colorGrayDark,
    fontSize: 14,
  },
  infoBox: {
    position: 'absolute',
    bottom: -31,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  infoBoxInner: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: globals.styles.colors.colorBlackDark,
    borderRadius: 8,
    width: 334,
  },
  infoBoxSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBoxSectionTitle: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  infoBoxSectionValue: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.style.fontFamily,
    fontSize: 14,
  },
  intensitySection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  playButtonContainer: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
