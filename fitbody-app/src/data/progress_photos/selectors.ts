import { RootState } from '../../store'
import { ProgressPhotoDays, ProgressPhotosState } from './types'

export const progressPhotosSelector = (state: RootState): ProgressPhotosState => state.data.progress_photos
export const progressPhotosDaysSelector = (state: RootState): ProgressPhotoDays => state.data.progress_photos.days
