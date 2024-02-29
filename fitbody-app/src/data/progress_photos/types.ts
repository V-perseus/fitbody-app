import { Action } from '@reduxjs/toolkit'

export const GET_PROGRESS_PHOTOS = 'progressPhotos/getProgressPhotos'
export const GET_WEEK_PHOTOS = 'progressPhotos/getWeekPhotos'
export const DELETE_PROGRESS_PHOTOS = 'progressPhotos/deleteProgressPhotos'
export const SAVE_PROGRESS_PHOTOS = 'SAVE_PROGRESS_PHOTOS'
export const SAVE_PROGRESS_PHOTOS_COMMIT = 'SAVE_PROGRESS_PHOTOS_COMMIT'
export const SAVE_PROGRESS_PHOTOS_ROLLBACK = 'SAVE_PROGRESS_PHOTOS_ROLLBACK'

// const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key]
// ex. getKeyValue<keyof User, User>("name")(user);

export interface ActionWithPayload<T, P> extends Action {
  type: T
  payload: P
  meta?: any
}

export enum ProgressPhotoViewTypes {
  'SIDE' = 'SIDE',
  'FRONT' = 'FRONT',
  'BACK' = 'BACK',
}

export interface IProgressPhoto {
  id: number
  key: ProgressPhotoViewTypes
  week_id: string
  user_id: string
  view_type: ProgressPhotoViewTypes
  program: string
  file_path: string
  created_at: string
  updated_at: string
  date: string
  guid: string
  photo_url: string | null
  photo_thumb_url: string
  type: string
  image: string
}

export type ProgressPhotoPlaceholder = Pick<IProgressPhoto, 'key' | 'view_type' | 'photo_url'>

export type ProgressPhotoDays = Record<string, Record<ProgressPhotoViewTypes, IProgressPhoto>>

export type ProgressPhotosState = {
  message: string
  days: ProgressPhotoDays | {}
  loading: number
}

export type SendProgressPhotosPayloadPhoto = {
  type: ProgressPhotoViewTypes
  guid: string
  photo_url: string
  image: string
}

export interface ISendProgessPhotosPayload {
  week_id: string
  date: string
  program: string
  photos: SendProgressPhotosPayloadPhoto[]
}
