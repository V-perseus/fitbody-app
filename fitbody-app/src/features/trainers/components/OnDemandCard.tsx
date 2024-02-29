import React from 'react'
import { Image, Pressable, Text, View, StyleSheet, ImageStyle } from 'react-native'
import { ms, vs } from 'react-native-size-matters/extend'

import { resolveLocalUrl } from '../../../services/helpers'

import globals from '../../../config/globals'
import { useAppSelector } from '../../../store/hooks'

import VideoIcon from '../../../../assets/images/svg/icon/24px/navigation/guidance.svg'

import { IVideoCategory } from '../../../data/media/types'

interface IOnDemandCardProps {
  onPress: () => void
  item: IVideoCategory
}
export const OnDemandCard: React.FC<IOnDemandCardProps> = ({ onPress, item }) => {
  const isOnline = useAppSelector((state) => state.offline.online)
  function handlePress() {
    if (isOnline) {
      onPress()
    }
  }

  if (!item) {
    return null
  }

  const thumbnail = { uri: resolveLocalUrl(item.image_url) }

  return (
    <Pressable style={({ pressed }) => [styles.container(pressed)]} onPress={handlePress}>
      <View style={[styles.thumbnailContainer]}>
        <Image source={thumbnail} style={styles.thumbnail as ImageStyle} resizeMode="cover" />
      </View>
      <View style={{ backgroundColor: globals.styles.colors.colorTransparentBlack50, borderRadius: 8, ...StyleSheet.absoluteFillObject }} />
      <View style={styles.textContainer}>
        <Text style={styles.programName} adjustsFontSizeToFit={true} numberOfLines={1}>
          {item.name?.toUpperCase() ?? ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: -15 }}>
          <VideoIcon color={globals.styles.colors.colorWhite} width={24} height={24} style={{ marginTop: 2, marginRight: 6 }} />
          <Text style={styles.onDemand}>ON DEMAND</Text>
          <Text style={styles.classes}>&nbsp;CLASSES</Text>
        </View>
        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <Text style={styles.duration}>{item.session_duration || ''}</Text>
            <Text style={styles.durationText}>MINUTE{'\n'}WORKOUTS</Text>
          </View>
          <View style={styles.rowCenter} />
          <View style={styles.rowRight}>
            <Text style={styles.description}>{`${item.period_label ? item.period_label.toUpperCase() + ' ' : ''}${
              item.short_description?.toUpperCase() ?? ''
            }`}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const textShadows = {
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 5,
  textShadowColor: globals.styles.colors.colorBlackDark,
}

const styles = StyleSheet.create({
  container: (pressed: boolean) => ({
    position: 'relative',
    marginBottom: 10,
    shadowOpacity: pressed ? 0.2 : 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: pressed ? 2 : 5,
    elevation: pressed ? 4 : 12,
    width: globals.window.width - 48,
    backgroundColor: globals.styles.colors.colorWhite,
    borderRadius: 8,
  }),
  thumbnailContainer: {
    height: 194,
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorBlack,
    borderWidth: 3,
    borderColor: globals.styles.colors.colorBlack,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, minWidth: 140 },
  rowCenter: {
    height: 40,
    borderWidth: 1,
    borderColor: globals.styles.colors.colorWhite,
    backgroundColor: globals.styles.colors.colorWhite,
  },
  rowRight: { paddingLeft: 8, width: 140 },
  programName: {
    fontFamily: globals.fonts.secondary.style.fontFamily,
    fontSize: ms(71),
    paddingHorizontal: 12,
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    lineHeight: ms(71),
    ...textShadows,
  },
  onDemand: {
    fontSize: 24,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorWhite,
    ...textShadows,
  },
  classes: {
    fontSize: 24,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorPink,
    ...textShadows,
  },
  duration: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    paddingRight: 6,
    fontSize: 35,
    ...textShadows,
  },
  durationText: {
    width: 82,
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    lineHeight: 15,
    marginTop: 3,
    ...textShadows,
  },
  description: {
    color: globals.styles.colors.colorWhite,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    lineHeight: 15,
    marginTop: 3,
    ...textShadows,
  },
})
