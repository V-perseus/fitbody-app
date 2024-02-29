import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ScrollView, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment'
import * as _ from 'lodash'

// Assets
import styles from './styles'

// Components
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import HistoryWeekHeader from '../../../../components/HistoryWeekHeader'
import HistoryDay from '../../../../components/HistoryDay'

// Services
import { getMonth } from '../../../../services/dates'

const Week = () => {
  const date = useSelector((state) => state.services.date.month)
  const completions = useSelector((state) => state.data.workouts.completions)

  const dateProp = date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')

  const [history, setHistory] = useState(null)

  const getWeekData = async () => {
    const grouped = _.groupBy(completions, 'date')

    const weekDates = [1, 2, 3, 4, 5, 6, 7].map((int) => moment(dateProp).isoWeekday(int).format('YYYY-MM-DD'))

    const weekData = weekDates.map((weekDate) => {
      if (grouped.hasOwnProperty(weekDate)) {
        return { date: weekDate, workouts: grouped[weekDate] }
      }
      return { date: weekDate, workouts: [] }
    })
    setHistory(weekData)
  }

  useFocusEffect(
    useCallback(() => {
      getWeekData()
    }, [dateProp]),
  )

  /**
   * Get the next week
   */
  function getNextWeek() {
    getMonth(moment(date).add(7, 'days').format())
  }

  /**
   * Get the previous week
   */
  function getPastWeek() {
    getMonth(moment(date).add(-7, 'days').format())
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" />
      <HistoryWeekHeader
        week={[moment(dateProp, 'YYYY-MM-DD').isoWeekday(1), moment(dateProp, 'YYYY-MM-DD').isoWeekday(7)]}
        onPastWeek={getPastWeek}
        onNextWeek={getNextWeek}
      />
      {history ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.flex}>
          {history.map((day, idx) => {
            return (
              <HistoryDay key={idx + 'week'} context="Week" style={{ marginBottom: 5 }} date={moment(day.date)} dayData={day.workouts} />
            )
          })}
        </ScrollView>
      ) : null}
    </View>
  )
}

export default Week
