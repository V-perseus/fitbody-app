import React, { memo, useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import WeightTrackHistoryTable from '../WeightTrackHistoryTable/WeightTrackHistoryTable'
import { WeightTrackingData } from './types'
import { styles } from './styles'
import CalendarIcon from '../../../../../assets/images/svg/icon/16px/calendar.svg'
import globals from '../../../../config/globals'

//mock data
const weightTrackingData: WeightTrackingData[] = [
  {
    id: 1,
    date: 'June 18, 2023',
    sets: [
      { set: 'Set 1', reps: '8 / side', weight: '20 lbs' },
      { set: 'Set 2', reps: '10 / side', weight: '25 lbs' },
      { set: 'Set 3', reps: '12 / side', weight: '30 lbs' },
    ],
  },
  {
    id: 2,
    date: 'June 12, 2023',
    sets: [
      { set: 'Set 1', reps: '8 / side', weight: '20 lbs' },
      { set: 'Set 2', reps: '_', weight: '_' },
      { set: 'Set 3', reps: '12 / side', weight: '30 lbs' },
    ],
  },
  {
    id: 3,
    date: 'June 10, 2023',
    sets: [
      { set: 'Set 1', reps: '_', weight: '_' },
      { set: 'Set 2', reps: '10 / side', weight: '25 lbs' },
      { set: 'Set 3', reps: '12 / side', weight: '30 lbs' },
    ],
  },
  {
    id: 4,
    date: 'June 5, 2023',
    sets: [
      { set: 'Set 1', reps: '8 / side', weight: '20 lbs' },
      { set: 'Set 2', reps: '10 / side', weight: '25 lbs' },
      { set: 'Set 3', reps: '12 / side', weight: '30 lbs' },
    ],
  },
  {
    id: 5,
    date: 'June 1, 2023',
    sets: [
      { set: 'Set 1', reps: '8 / side', weight: '20 lbs' },
      { set: 'Set 2', reps: '10 / side', weight: '25 lbs' },
      { set: 'Set 3', reps: '_', weight: '_' },
    ],
  },

  // ... Repeat weight tracking data for other dates
]

const WeightTrackHistoryComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  const renderWeightTrackingItem = ({ item }: { item: WeightTrackingData }) => {
    return (
      <View style={styles.dataWrapper}>
        <View style={styles.dateWrapper}>
          <View style={styles.calendarIcon}>
            <CalendarIcon color={globals.styles.colors.colorBlack} />
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <WeightTrackHistoryTable data={item.sets} />
      </View>
    )
  }

  useEffect(() => {
    //TODO: get history and dispatch it

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Simulate a 2-second loading delay

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <View style={isLoading ? styles.centerContainer : styles.container}>
      {isLoading ? (
        <ActivityIndicator color={globals.styles.colors.colorPink} />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={weightTrackingData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWeightTrackingItem}
          // ListFooterComponent={renderFooter} //TODO: active this according the api design
        />
      )}
    </View>
  )
}

export const WeightTrackHistory = memo(WeightTrackHistoryComponent)
