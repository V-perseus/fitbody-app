export const FETCH_MEDIA = 'media/fetchMedia'

export enum VideoCategories {
  'Fitness' = 'Fitness',
  'Food' = 'Food',
  'Rehabilitation' = 'Rehabilitation',
  'Body Love' = 'Body Love',
  'Cardio' = 'Cardio',
  'Low Impact' = 'Low Impact',
  'Yoga Flows' = 'Yoga Flows',
  'Postpartum' = 'Postpartum',
  '30 Day Tone' = '30 Day Tone',
}

export enum CategoryCategory {
  'Guidance' = 'Guidance',
  'On Demand' = 'On Demand',
}

export enum GuidanceCategory {
  'Fitness' = 'Fitness',
  'Food' = 'Food',
  'Rehabilitation' = 'Rehabilitation',
  'Body Love' = 'Body Love',
}

export enum OnDemandCategory {
  'Cardio' = 'Cardio',
  'Low Impact' = 'Low Impact',
  'Yoga Flows' = 'Yoga Flows',
  'Postpartum' = 'Postpartum',
  '30 Day Tone' = '30 Day Tone',
}

export interface IVideoData {
  HLS_GROUP: string[]
  DASH_ISO_GROUP?: string[]
  FILE_GROUP?: string[]
}

export interface IVideo {
  id?: number
  title?: string
  video_type_id?: number
  video_category_id?: number
  category_id: number
  trainer_id: number
  duration: number
  thumbnail: string
  body_focus: string | null
  impact: string | null
  intensity: number | null
  video?: string
  video_data: IVideoData
  aws_encode_id?: string
  aws_data?: string
  encoding_complete?: 0 | 1
  created_at?: string
  updated_at?: string
}

export interface IVideoType {
  id?: number
  name: string
  created_at?: string
  updated_at?: string
}

export interface IVideoTypeResponse extends IVideoType {
  categories: IVideoCategory[]
}

export interface IVideoCategory {
  id?: number
  name: string
  icon?: string
  icon_url: string
  image?: string
  image_url: string
  header_image?: string
  header_image_url: string
  offline_image?: string
  offline_image_url: string
  created_at?: string
  updated_at?: string
  video_type_id?: number
  description: string
  class_description: string
  sort_order: number
  hidden: boolean
  period_term: string
  classes_count_override?: number
  session_duration: string
  period_label: string
  short_description?: string
  show_on_quiz: boolean
}

// export type ExcludeName<T> = Pick<T, Exclude<keyof T, 'name'>>;

// export interface ICombinedVideo extends ExcludeName<IVideoCategory>, ExcludeName<IVideoType> {
//   name: VideoCategories | CategoryCategory
// }

export interface IFetchMediaResponse {
  types: IVideoTypeResponse[]
  videos: IVideo[]
}

export interface IMediaVideo {
  Guidance: MediaGrouped[]
  'On Demand': MediaGrouped[]
}

export type MediaGrouped = {
  [key in VideoCategories]: IVideo[]
}

export type GuidanceState = {
  [key in GuidanceCategory]: IVideo[]
}

export type OnDemandState = {
  [key in OnDemandCategory]: IVideo[]
}

export type CategoryState = {
  [key in CategoryCategory]: IVideoCategory[]
}

export interface IDownloadLinks {
  Url: string
  ZipPath: string
  skipDownload?: boolean
}

export interface IDownloadData {
  categories: CategoryState
  guidance: MediaGrouped
  onDemand: MediaGrouped
}

export interface IDownloadState {
  downloadId: string
  progress: number
  payloadToSave: IDownloadData
  links: IDownloadLinks[]
  type: 'media'
  additionalFields?: { [key: string]: any }
}
