import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

// styles
import styles from './styles'

// Services
import { activitiesSelector } from '../../data/journal/selectors'

// Components
import { ActivityItem } from '../ActivityItem/ActivityItem'
import { IActivity } from '../../data/journal/types'

interface IActivityOverviewProps {
  myActivities: number[]
}
export default function ActivityOverview({ myActivities }: IActivityOverviewProps) {
  const activities = useSelector(activitiesSelector)

  function keyExtractor(item: number) {
    return `activity-${item}`
  }

  function renderItem({ item, index }: { item: number; index: number }) {
    if (item < 0) {
      return null
    }

    const activity = activities.find((act) => act.id === item) || ({ name: 'Unknown', icon_key: 'exercised' } as IActivity)

    return <ActivityItem name={activity.name} iconKey={activity.icon_key} index={index} />
  }

  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={myActivities}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
    />
  )
}
