import { store } from '../../store'
import {
  getNotifications as gn,
  deleteNotification as d,
  readAllNotifications as ran,
  clearAllNotifications as ca,
  clear,
  readNotification as rn,
} from './notificationSlice'
import { INotification } from './types'

export const getNotifications = () => {
  store.dispatch(gn())
}

export const deleteNotification = (data: Partial<INotification>) => {
  store.dispatch(d(data))
}

export const readAllNotifications = () => {
  store.dispatch(ran())
}

export const readNotification = (data: INotification) => {
  store.dispatch(rn(data))
}

export const clearAllNotifications = () => {
  store.dispatch(ca())
}

export const clearNotifications = () => {
  store.dispatch(clear())
}
