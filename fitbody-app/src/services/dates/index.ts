import { store } from '../../store'
import { getTheMonth, getTheNextMonth, getThePreviousMonth, getTheWeek, getTheNextWeek, getThePreviousWeek } from './datesSlice'

export const getMonth = (date?: string) => {
  store.dispatch(getTheMonth(date))
}

export const getNextMonth = (month: string) => {
  store.dispatch(getTheNextMonth(month))
}

export const getPreviousMonth = (month: string) => {
  store.dispatch(getThePreviousMonth(month))
}

export const getWeek = () => {
  store.dispatch(getTheWeek())
}

export const getNextWeek = (day: string) => {
  store.dispatch(getTheNextWeek(day))
}

export const getPreviousWeek = (day: string) => {
  store.dispatch(getThePreviousWeek(day))
}
