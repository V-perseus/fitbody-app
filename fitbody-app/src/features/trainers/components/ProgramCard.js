import React from 'react'
import { Image, Pressable, Text, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { ms } from 'react-native-size-matters/extend'

import { resolveLocalUrl } from '../../../services/helpers'

import globals from '../../../config/globals'

export const ProgramCard = ({ onPress, item }) => {
  const isOnline = useSelector((state) => state.offline.online)
  const trainers = useSelector((state) => state.data.workouts.trainers)
  const trainer = trainers.find((t) => t.programs.includes(item.id))

  function handlePress() {
    if (item.is_coming_soon) {
      return
    }
    if (isOnline) {
      onPress()
    }
  }

  const thumbnail = { uri: resolveLocalUrl(item.background_image_color_card_url) }

  return (
    <Pressable style={({ pressed }) => [styles.container(pressed)]} onPress={handlePress}>
      <View style={[styles.thumbnailContainer]}>
        <Image source={thumbnail} style={[styles.thumbnail, { borderColor: trainer.color }]} resizeMode="cover" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.programName}>{item.title?.toUpperCase()}</Text>
        <View style={{ flexDirection: 'row' }}>
          {item.is_coming_soon && <Text style={[styles.trainerName, { color: trainer.color }]}>{'COMING SOON '}</Text>}

          <Text style={styles.trainerName}>{`WITH ${trainer.name?.toUpperCase()}`}</Text>
        </View>
        <View style={styles.rowBetween}>
          <View style={styles.rowLeft}>
            <Text style={styles.duration}>{item.session_duration}</Text>
            <Text style={styles.durationText}>MINUTE{'\n'}WORKOUTS</Text>
          </View>
          <View style={styles.rowCenter} />
          <View style={styles.rowRight}>
            <Text style={styles.description}>{item.description?.toUpperCase()}</Text>
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
  container: (pressed) => ({
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
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: globals.styles.colors.colorBlack,
    borderWidth: 3,
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
    textAlign: 'center',
    color: globals.styles.colors.colorWhite,
    lineHeight: 72,
    ...textShadows,
  },
  trainerName: {
    fontSize: 24,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    color: globals.styles.colors.colorWhite,
    marginTop: -15,
    marginBottom: 15,
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
