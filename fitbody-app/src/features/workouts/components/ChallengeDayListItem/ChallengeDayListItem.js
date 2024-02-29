import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, cancelAnimation, Easing } from 'react-native-reanimated'

import ChallengeCheckedIcon from '../../../../../assets/images/svg/icon/32px/circle/challenge/checked.svg'
import ChallengeUncheckedIcon from '../../../../../assets/images/svg/icon/32px/circle/challenge/unchecked.svg'
import DownloadedIcon from '../../../../../assets/images/svg/icon/32px/circle/downloaded.svg'
import DownloadingRingIcon from '../../../../../assets/images/svg/icon/32px/circle/downloading-ring.svg'
import RestDayUncheckedIcon from '../../../../../assets/images/svg/icon/24px/circle/heart/checked.svg'

import globals from '../../../../config/globals'

import { useInit } from '../../../../services/hooks/useInit'

export const ChallengeDayListItem = ({ onPress, day, rest, available, isToday, downloaded, downloading, color, isCompleted }) => {
  const rotation = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    }
  }, [])

  useInit(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
    )
    return () => cancelAnimation(rotation)
  }, [])

  return (
    <View style={styles.outerview}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.tileContainer, { height: isToday ? 166 : 112 }, { borderColor: color, borderWidth: isToday ? 4 : 0 }]}>
        <View
          style={[
            styles.tileContainer,
            {
              left: isToday ? -4 : 0,
              position: 'absolute',
              height: isToday ? 166 : 112,
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            !available ? {} : { position: 'relative', display: 'none' },
          ]}
        />
        <Text style={[styles.tileSubtitle, { color: available ? globals.styles.colors.colorWhite : globals.styles.colors.colorGrayDark }]}>
          DAY {moment(day.date).format('D').toUpperCase()}
        </Text>
        <Text style={[styles.tileTitle, { color: available ? globals.styles.colors.colorWhite : globals.styles.colors.colorGrayDark }]}>
          {available ? (day.day_subtitle || '').toUpperCase() : 'OFFLINE - RECONNECT TO ACCESS'}
        </Text>

        {/* Today's Workout Button */}
        {isToday && !rest ? (
          <LinearGradient style={styles.button} colors={[color, color]}>
            <Text style={styles.buttonLabel}>TODAY</Text>
          </LinearGradient>
        ) : null}

        {isCompleted && !rest ? (
          <ChallengeCheckedIcon color={globals.styles.colors.colorYellow} style={styles.finishedWorkoutIcon} />
        ) : null}

        {!isCompleted && !day.workout_completed && !rest ? (
          <ChallengeUncheckedIcon color={globals.styles.colors.colorGrayDark} style={styles.finishedWorkoutIcon} />
        ) : null}

        {rest ? (
          <RestDayUncheckedIcon color={globals.styles.colors.darkPink} width={32} height={32} style={styles.finishedWorkoutIcon} />
        ) : null}

        {downloaded ? <DownloadedIcon color={globals.styles.colors.colorSkyBlue} style={styles.downloadWorkoutIcon} /> : null}

        {downloading ? (
          <View style={styles.downloadWorkoutIcon}>
            <Animated.View style={[animatedStyles, { backgroundColor: globals.styles.colors.colorSkyBlue, borderRadius: 50 }]}>
              <DownloadingRingIcon color={globals.styles.colors.colorSkyBlue} />
            </Animated.View>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  outerview: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: globals.styles.colors.colorWhite,
  },
  tileContainer: {
    height: 125,
    width: globals.window.width,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  tileTitle: {
    fontSize: 30,
    fontFamily: globals.fonts.secondary.style.fontFamily,
    paddingLeft: 24,
    paddingBottom: 22,
    color: globals.styles.colors.colorWhite,
    zIndex: 10,
  },
  tileSubtitle: {
    fontSize: 16,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    paddingLeft: 24,
    color: globals.styles.colors.colorWhite,
    zIndex: 10,
  },
  button: {
    height: 32,
    width: 73,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: -6,
    marginBottom: 27,
    marginLeft: 24,
    zIndex: 1,
  },
  buttonLabel: {
    fontSize: 10,
    fontFamily: globals.fonts.primary.semiboldStyle.fontFamily,
    color: globals.styles.colors.colorWhite,
  },
  finishedWorkoutIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  downloadWorkoutIcon: {
    position: 'absolute',
    right: 12,
    top: 54,
  },
})
