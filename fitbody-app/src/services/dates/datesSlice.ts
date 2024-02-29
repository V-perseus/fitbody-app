import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export type WeekType = {
  date: string
  day: string
  dayLong: string
  month: string
  full: string
}

export interface DatesState {
  month: string | null
  monthString: string | null
  startOffset: number
  endOffset: number
  daysInMonth: number
  week: WeekType[] | null
}
export const initialState: DatesState = {
  month: null,
  monthString: 'January',
  startOffset: 0,
  endOffset: 0,
  daysInMonth: 31,
  week: null,
}

const datesSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    getTheMonth: (state, action: PayloadAction<string | undefined>) => {
      const m = action.payload ? moment(action.payload) : moment()
      const month = m.format()
      const monthString = m.format('MMMM')
      const daysInMonth = m.daysInMonth()
      // const startDay = m.startOf('month').day()
      const startOffset = m.startOf('month').day()
      const offset = 7 - ((daysInMonth + startOffset) % 7) - 1
      const endOffset = offset === 7 ? 0 : offset
      return {
        month,
        monthString,
        startOffset,
        endOffset,
        daysInMonth,
        week: state.week,
      }
    },
    getTheNextMonth: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return state
      }
      const m = moment(action.payload).add(1, 'month')
      const month = m.format()
      const monthString = m.format('MMMM')
      const daysInMonth = m.daysInMonth()
      // const startDay = m.startOf('month').day()
      const startOffset = m.startOf('month').day()
      const offset = 7 - ((daysInMonth + startOffset) % 7) - 1
      const endOffset = offset === 7 ? 0 : offset

      return {
        month,
        monthString,
        startOffset,
        endOffset,
        daysInMonth,
        week: state.week,
      }
    },
    getThePreviousMonth: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return state
      }
      const m = moment(action.payload).subtract(1, 'month')
      const month = m.format()
      const monthString = m.format('MMMM')
      const daysInMonth = m.daysInMonth()
      // const startDay = m.startOf('month').day()
      const startOffset = m.startOf('month').day()
      const offset = 7 - ((daysInMonth + startOffset) % 7) - 1
      const endOffset = offset === 7 ? 0 : offset

      return {
        month,
        monthString,
        startOffset,
        endOffset,
        daysInMonth,
        week: state.week,
      }
    },
    getTheWeek: (state) => {
      const monday = moment().startOf('week').add(1, 'day')
      const week = []

      for (let i = 0; i < 7; i++) {
        week.push({
          date: monday.format('D'),
          day: monday.format('ddd'),
          dayLong: monday.format('dddd'),
          month: monday.format('MMMM'),
          full: monday.format(),
        })
        monday.add(1, 'day')
      }

      state.week = week
    },
    getThePreviousWeek: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return state
      }
      const monday = moment(action.payload).subtract(1, 'week').startOf('week').add(1, 'day')
      const week = []

      for (let i = 0; i < 7; i++) {
        week.push({
          date: monday.format('D'),
          day: monday.format('ddd'),
          dayLong: monday.format('dddd'),
          month: monday.format('MMMM'),
          full: monday.format(),
        })
        monday.add(1, 'day')
      }
      state.week = week
    },
    getTheNextWeek: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        return state
      }
      const monday = moment(action.payload).add(1, 'week').startOf('week').add(1, 'day')
      const week = []

      for (let i = 0; i < 7; i++) {
        week.push({
          date: monday.format('D'),
          day: monday.format('ddd'),
          dayLong: monday.format('dddd'),
          month: monday.format('MMMM'),
          full: monday.format(),
        })
        monday.add(1, 'day')
      }
      state.week = week
    },
  },
})

export const { getTheMonth, getTheNextMonth, getThePreviousMonth, getTheWeek, getTheNextWeek, getThePreviousWeek } = datesSlice.actions

export default datesSlice.reducer
