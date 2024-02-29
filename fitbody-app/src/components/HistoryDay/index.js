import React, { useMemo } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'

import globals from '../../config/globals'
import styles from './styles'
import { SvgUriLocal } from '../../features/workouts/components/SvgUriLocal'

import Star from '../../../assets/images/svg/icon/16px/star.svg'
import Class from '../../../assets/images/svg/icon/16px/class.svg'
import ChevronRight from '../../../assets/images/svg/icon/16px/cheveron/right.svg'
import Checked from '../../../assets/images/svg/icon/24px/circle/check/checked.svg'
import ChallengeChecked from '../../../assets/images/svg/icon/24px/circle/challenge/checked.svg'

const HistoryDay = (props) => {
  const { navigate } = useNavigation()

  const { date, dayData } = props

  const allProgramsObject = useSelector((state) => state.data.workouts.programs, shallowEqual)
  const allPrograms = useMemo(() => Object.values(allProgramsObject), [allProgramsObject])

  const order = {
    SHRED: 1,
    TONE: 2,
    SCULPT: 3,
  }

  const buildPerformanceData = (data) => {
    const program = allPrograms.find((p) => p.id === data.program_id)

    let obj = {
      isHistory: true,
      view: props.context,
      week: data.week_number,
      level: data.level_title ? data.level_title.toUpperCase() : '',
      id: data.id,
      workout: {
        ...data,
        title: data.workout_title,
      },
      exercise: {
        name: data.workout_title,
      },
      category: {
        title: data.workout_category,
      },
      elapsed: data.time,
      timings: data.meta.circuits,
      program: data.is_challenge
        ? {
            color: globals.styles.colors.colorBlack,
            color_secondary: globals.styles.colors.colorBlack,
            is_challenge: true,
            background_image_url: data.challenge_background_img,
          }
        : program,
    }

    return obj
  }

  const hasChallenges = useMemo(() => dayData.filter((day) => day.is_challenge), [dayData])
  const hasWorkouts = useMemo(() => dayData.length > hasChallenges.length, [hasChallenges.length, dayData.length])

  function buildWorkoutListItem(w) {
    return (
      <TouchableOpacity onPress={w.meta.circuits ? () => navigate('Performance', buildPerformanceData(w)) : null} key={`workout_${w.id}`}>
        <View style={styles.listItemRow}>
          <View style={styles.rowAlignCenter}>
            <SvgUriLocal color={w.trainer_color} fillAll={true} uri={w.category_icon_url} style={styles.categoryIcon} />
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={1}
              style={[
                styles.workoutTitle,
                {
                  width: globals.window.width - 163 - 63 - (w.resistance_bands ? 25 : 0),
                  color: w.trainer_color,
                },
              ]}>
              {w.workout_title?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.levelTitle}>{w.level_title?.toUpperCase()}</Text>
            <Text style={styles.week}>WEEK {w.week_number}</Text>
            {w.meta.circuits?.length > 0 ? (
              <ChevronRight color={globals.styles.colors.colorBlack} style={{ marginLeft: 3, marginBottom: 0 }} />
            ) : (
              <View style={{ width: 20 }} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  function buildChallengeListItem(c) {
    return (
      <TouchableOpacity
        onPress={c.meta.circuits ? () => navigate('Performance', buildPerformanceData(c)) : null}
        key={`challenge_${c.id}`}
        activeOpacity={c.meta.circuits ? 0.85 : 1}>
        <View style={styles.listItemRow}>
          <View style={styles.rowAlignCenter}>
            <Star color={globals.styles.colors.colorYellow} />
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.challengeTitle}>
              {c.challenge_name?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.challengeDate}>DAY {c.challenge_day}</Text>
            {c.meta.circuits?.length > 0 && (
              <ChevronRight color={globals.styles.colors.colorBlack} style={{ marginLeft: 3, marginBottom: 0 }} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  function buildVideoListItem(v) {
    return (
      <View key={`video_${v.id}`} style={styles.listItemRow}>
        <View style={styles.rowAlignCenter}>
          <Class color={globals.styles.colors.colorBlack} />
          <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.videoTitle}>
            {v.video_title?.toUpperCase()}
          </Text>
        </View>
        <View style={styles.rowAlignCenter}>
          <Text style={styles.challengeDate}>CLASS</Text>
          <View style={{ width: 20 }} />
        </View>
      </View>
    )
  }

  return (
    <View style={props.style}>
      <View
        style={[
          styles.listItemRowHeader,
          moment(date).isSame(moment(), 'day')
            ? { borderLeftWidth: 5, borderLeftColor: globals.styles.colors.colorPink, paddingLeft: 12 }
            : {},
        ]}>
        <Text style={styles.listItemRowHeaderDate}>{date ? date.format('dddd, D').toUpperCase() : ''}</Text>
        <View style={styles.row}>
          <ChallengeChecked
            style={styles.challengeStarBig}
            color={hasChallenges.length > 0 ? globals.styles.colors.colorYellow : globals.styles.colors.colorGrayDark}
          />
          <Checked color={hasWorkouts ? globals.styles.colors.colorPink : globals.styles.colors.colorGrayDark} />
        </View>
      </View>

      {/* List all workouts */}
      {dayData && dayData.length > 0
        ? dayData
            .filter((day) => moment(day.date).isSame(date))
            .sort((a, b) =>
              order[a.program_id] > order[b.program_id]
                ? 1
                : order[a.program_id] === order[b.program_id]
                ? a.week_number > b.week_number
                  ? 1
                  : -1
                : -1,
            )
            .map((w) => (w.is_challenge ? buildChallengeListItem(w) : w.is_video ? buildVideoListItem(w) : buildWorkoutListItem(w)))
        : null}

      {/* No activities, in the past */}
      {dayData && dayData.length === 0 && moment(date).isBefore(moment(), 'day') ? (
        <View style={styles.inactiveContainer}>
          <Text style={styles.inactiveText}>REST DAY</Text>
        </View>
      ) : null}

      {/* No activities, today or in the future, no Sunday */}
      {dayData?.length === 0 && moment(date).isSameOrAfter(moment(), 'day') && moment(date).day() !== 0 ? (
        <View style={styles.inactiveContainer}>
          <Text style={styles.inactiveText}>WAITING FOR YOU TO SLAY</Text>
        </View>
      ) : null}

      {/* No activities, today or in the future, Sunday */}
      {dayData && dayData.length === 0 && moment(date).isSameOrAfter(moment(), 'day') && moment(date).day() === 0 ? (
        <View style={styles.inactiveContainer}>
          <Text style={styles.inactiveText}>RECOMMENDED REST DAY</Text>
        </View>
      ) : null}
    </View>
  )
}

export default HistoryDay
