import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import moment, { Moment } from 'moment'
import * as _ from 'lodash'
import { ScrollView, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

// Components
import FocusAwareStatusBar from '../../../../shared/FocusAwareStatusBar'
import HistoryMonthDay from '../../../../components/HistoryMonthDay'
import HistoryMonthHeader from '../../../../components/HistoryMonthHeader'
import HistoryDay from '../../../../components/HistoryDay'

// styles
import styles from './style'
import globals from '../../../../config/globals'

// Actions
import { useAppSelector } from '../../../../store/hooks'
import { getMonth, getNextMonth, getPreviousMonth } from '../../../../services/dates'

// Types
import { ICompletion } from '../../../../data/workout/types'

type DaySelection = {
  userPicked: boolean
  date: Moment
  day: number
  dayData: ICompletion[]
  today: boolean
}
type HistoryState = Record<string, ICompletion[]>

const Month = () => {
  const user = useAppSelector((state) => state.data.user)
  const date = useAppSelector((state) => state.services.date)
  const completions = useAppSelector((state) => state.data.workouts.completions || [])

  const [history, setHistory] = useState<HistoryState>(
    [...Array(moment().daysInMonth() - 1).keys()].reduce(
      (prev, cur) => (prev[moment().startOf('month').add(cur, 'days').format('YYYY-MM-DD')] = [] as any),
      {} as HistoryState,
    ),
  )
  const [selection, setSelection] = useState<DaySelection | null>(null)

  // This screen doesn't appear to ever get passed any params so this is pointless
  // useEffect(() => {
  //   const params = route

  //   if (params && params.date) {
  //     setSelection({ ...selection, userPicked: true, date: moment(params.date) })
  //     setHistory(
  //       [...Array(moment(params.date).startOf('month').add(1, 'month').daysInMonth() - 1).keys()].reduce(
  //         (prev, cur) =>
  //           (prev[moment(params.date).startOf('month').add(1, 'month').add(cur, 'days').format('YYYY-MM-DD')] = {
  //             workouts: [],
  //             challenges: [],
  //           }),
  //         {},
  //       ),
  //     )
  //     getMonth(moment(params.date))
  //   }
  // }, [])

  useFocusEffect(
    useCallback(() => {
      getMonthData()
    }, [date.month, completions]),
  )

  /**
   * Get the month data
   */
  async function _getMonthData() {
    if (!date.month) {
      return
    }

    try {
      const allCompletions = completions

      const grouped = _.groupBy(allCompletions, 'date')

      const isThisMonth = moment().isSame(moment(date.month), 'month')
      const dayIndex = moment().date()

      const isStartMonth = moment(user.created_at).isSame(moment(date.month), 'month')
      const startDayIndex = moment(user.created_at).date()

      let selectedDay = moment(date.month).date()

      if (!selection?.userPicked) {
        if (isThisMonth) {
          selectedDay = dayIndex
        } else if (isStartMonth) {
          selectedDay = startDayIndex
        }
      }

      let newSelection: DaySelection = {
        userPicked: selection ? selection.userPicked : false,
        date: moment(date.month)
          .startOf('month')
          .add(selectedDay - 1, 'days'),
        day: selectedDay,
        dayData:
          grouped[
            moment(date.month)
              .startOf('month')
              .add(selectedDay - 1, 'days')
              .format('YYYY-MM-DD')
          ] || [],
        today: isThisMonth && selectedDay === dayIndex,
      }

      setSelection(newSelection)
      setHistory(grouped)
    } catch (error) {}
  }

  const getMonthData = _.debounce(_getMonthData, 2000, {
    leading: true,
  })

  /**
   * Get the next month
   */
  function _getNextMonth() {
    // reset user picked bool on month change, selected day will default to the 1st
    if (selection) {
      setSelection({ ...selection, userPicked: false })
    }
    // create history with new datestring key
    setHistory(
      [...Array(moment(date.month).startOf('month').add(1, 'month').daysInMonth() - 1).keys()].reduce(
        (prev, cur) => (prev[moment(date.month).startOf('month').add(1, 'month').add(cur, 'days').format('YYYY-MM-DD')] = [] as any),
        {} as HistoryState,
      ),
    )
    // update redux
    getNextMonth(moment(date.month).startOf('month').format())
  }

  /**
   * Get the previous month
   */
  function _getPastMonth() {
    if (selection) {
      setSelection({ ...selection, userPicked: false })
    }
    setHistory(
      [...Array(moment(date.month).startOf('month').add(-1, 'month').daysInMonth() - 1).keys()].reduce(
        (prev, cur) => (prev[moment(date.month).startOf('month').add(-1, 'month').add(cur, 'days').format('YYYY-MM-DD')] = [] as any),
        {} as HistoryState,
      ),
    )
    getPreviousMonth(moment(date.month).startOf('month').format())
  }

  const _selectDay = (selected: DaySelection) => {
    getMonth(
      moment(date.month)
        .startOf('month')
        .add(selected.day - 1, 'days')
        .format(),
    )
    setSelection({
      ...selected,
      userPicked: true,
      date: moment(date.month)
        .startOf('month')
        .add(selected.day - 1, 'days'),
    })
  }

  /**
   * Build out the days needed in the calendar view
   */
  const buildMonthCalendar = () => {
    const days: JSX.Element[] = []

    let isThisMonth = moment().isSame(moment(date.month), 'month')
    let dayIndex = moment().date()

    let isStartMonth = moment(user.created_at).isSame(moment(date.month), 'month')
    let startDayIndex = moment(user.created_at).date()
    for (let i = 0; i < date.startOffset; i++) {
      days.push(<HistoryMonthDay key={`start-${i}`} />)
    }
    for (let i = 1; i <= date.daysInMonth; i++) {
      days.push(
        <HistoryMonthDay
          onSelect={_selectDay}
          active={selection && selection.day === i}
          key={`${i}`}
          today={isThisMonth && i === dayIndex}
          future={(isThisMonth && i > dayIndex) || (isStartMonth && i < startDayIndex)}
          day={i}
          dayData={
            history[
              moment(date.month)
                .startOf('month')
                .add(i - 1, 'days')
                .format('YYYY-MM-DD')
            ]
          }
        />,
      )
    }

    for (let i = 0; i <= date.endOffset; i++) {
      days.push(<HistoryMonthDay key={`end-${i}`} />)
    }
    return days
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <FocusAwareStatusBar barStyle="dark-content" />
      <LinearGradient style={styles.backgroundImage} colors={[globals.styles.colors.colorPink, globals.styles.colors.colorSkyBlue]}>
        <HistoryMonthHeader onNextMonth={_getNextMonth} onPastMonth={_getPastMonth} />
        {history ? <View style={styles.daysScroll}>{buildMonthCalendar()}</View> : null}
      </LinearGradient>
      <LinearGradient
        style={[styles.backgroundImage, { marginLeft: 13, width: globals.window.width - 26, height: 17, marginTop: -6 }]}
        colors={[globals.styles.colors.colorTransparent50SkyBlue, globals.styles.colors.colorTransparent50SkyBlue]}
      />
      <LinearGradient
        style={[styles.backgroundImage, { marginLeft: 33, width: globals.window.width - 66, height: 22, marginTop: -11 }]}
        colors={[globals.styles.colors.colorTransparent30SkyBlue, globals.styles.colors.colorTransparent30SkyBlue]}
      />

      {selection && selection.dayData && (
        <HistoryDay context="Month" style={{ marginTop: 19 }} date={selection.date} dayData={selection.dayData} />
      )}
    </ScrollView>
  )
}

export default Month
