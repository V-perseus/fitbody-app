import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { scale } from 'react-native-size-matters/extend'
import moment, { Moment } from 'moment'

import MacroIcon from '../../../../../assets/images/svg/icon/32px/macro.svg'
import GroceryIcon from '../../../../../assets/images/svg/icon/32px/grocery.svg'

import styles from './styles'
import globals from '../../../../config/globals'

export type CalDay = {
  newMonth?: boolean
  month: string
  date?: string
  day?: string
  dayLong?: string
  previousMonth?: string
  full?: Moment
}

interface IDiaryDateHeaderProps {
  navigation: any
  onDayChange: (day: CalDay) => void
  today: Moment
}
export const DiaryDateHeader = ({ navigation, onDayChange, today }: IDiaryDateHeaderProps) => {
  const [days, setDays] = useState<CalDay[]>([])
  const scrollRef = useRef<FlatList | null>(null)

  /**
   * Generate calendar days
   */
  function generateDays() {
    let calDays: CalDay[] = []

    const heute = moment()

    let month

    for (let i = -365; i <= 13; i++) {
      const newDay = heute.clone().add(i, 'days')
      if (month !== newDay.format('MMM')) {
        calDays.push({
          newMonth: true,
          month: newDay.format('MMM'),
        })
      }
      calDays.push({
        date: newDay.format('DD'),
        day: newDay.format('ddd'),
        dayLong: newDay.format('dddd'),
        previousMonth: month,
        month: newDay.format('MMM'),
        full: newDay,
      })

      month = newDay.format('MMM')
    }

    setDays(calDays)
  }

  useEffect(() => {
    generateDays()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (days.length === 0) {
        return
      }
      const dateElementIndex = days.findIndex((d) => d.full?.isSame(today, 'day'))
      if (dateElementIndex !== -1) {
        setTimeout(() => {
          scrollRef.current?.scrollToIndex({
            index: dateElementIndex,
            animated: true,
            viewOffset: globals.window.width / 2 - scale(58) / 2,
          })
        }, 100)
      }
    }, [today, days]),
  )

  /**
   * Render out week date header
   */
  const handleRenderDays = ({ item, index }: { item: CalDay; index: number }) => {
    let active = today.isSame(item.full, 'day')

    return item.newMonth ? (
      <View key={index} style={styles.dayWrapper}>
        <Text style={styles.dayWrapperText}>{item.month}</Text>
      </View>
    ) : (
      <TouchableOpacity key={index} onPress={() => onDayChange(item)} style={styles.dayWrapper}>
        <Text style={styles.dateWord}>{item?.day?.[0]}</Text>
        <View style={[styles.dayContainer, active ? styles.activeDayButton : styles.inactiveDayButton]}>
          <Text style={[styles.dayWord, active ? styles.activeDayLabel : null]}>{item.date}</Text>
        </View>
        <View style={[styles.daySliding, active && { backgroundColor: globals.styles.colors.colorWhite }]} />
      </TouchableOpacity>
    )
  }

  const memoizedValue = useMemo(() => handleRenderDays, [today])

  return (
    <LinearGradient style={styles.header} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorLavender]}>
      <View style={styles.titleBar}>
        <View style={styles.titleBarInner}>
          <TouchableOpacity onPress={() => navigation.navigate('CalculatedMacros')}>
            <MacroIcon width={scale(30)} height={scale(30)} color={globals.styles.colors.colorWhite} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>MEALS</Text>

          <TouchableOpacity onPress={() => navigation.navigate('GroceryList')}>
            <GroceryIcon width={scale(30)} height={scale(30)} color={globals.styles.colors.colorWhite} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={scrollRef}
        horizontal={true}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={100}
        // initialNumToRender={393}
        // @DEV length and offset are to mirror the size of the item being rendered
        // it needs to match here, in styles.dayWrapper, and where scrollRef is used to scroll to position
        getItemLayout={(_, index) => ({ length: scale(58), offset: scale(58) * index, index })}
        onScrollToIndexFailed={() => {
          // console.log('scrollIndexFaied', err)
        }}
        removeClippedSubviews={true}
        style={styles.calendarBar}
        data={days}
        renderItem={memoizedValue}
        contentContainerStyle={{ alignItems: 'flex-end' }}
      />
    </LinearGradient>
  )
}
