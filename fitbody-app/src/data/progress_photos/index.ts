import { store } from '../../store'
import {
  getProgressPhotos as getPhotos,
  sendProgressPhotos as sendPhotos,
  getWeekPhotos as getWeek,
  deleteProgressPhotos as deletePhoto,
} from './progressPhotosSlice'
import { ISendProgessPhotosPayload } from './types'

export const getProgressPhotos = () => {
  store.dispatch(getPhotos())
}

export const getWeekPhotos = (week_id: string) => {
  store.dispatch(getWeek(week_id))
}

export const sendProgressPhotos = (photos: ISendProgessPhotosPayload) => {
  store.dispatch(sendPhotos(photos))
}

export const deleteProgressPhotos = (photoId: string) => {
  store.dispatch(deletePhoto(photoId))
}
