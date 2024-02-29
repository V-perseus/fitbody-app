export const CLEAR_NOTIFICATIONS = 'notifications/clearAllNotifications'
export const GET_NOTIFICATIONS = 'notifications/getNotifications'
export const DELETE_NOTIFICATION = 'notifications/deleteNotification'
export const READ_NOTIFICATIONS = 'notifications/readAllNotifications'
export const READ_COMMIT = 'notifications/READ_COMMIT'
export const READ_ROLLBACK = 'notifications/READ_ROLLBACK'

export interface INotificationData {
  title: string
  text: string
}

export interface INotification {
  id?: string
  type: 'WaterIntake' | 'InactiveUser' | 'DailyWorkout' | 'NewChallenge' | 'InactiveTrialUser' | 'ProgressPhoto' | 'CompleteFirstWorkout'
  data: INotificationData
  read_at: string | null
  notifiable_id?: number
  notifiable_type?: string
  created_at: string
  expire_at: string
  updated_at: string
}

export interface INotificationSetting {
  id: number
  class: string
  title: string
  type: string
  cascading_mode: string
  default: {
    enabled: boolean
  }
  settings: {
    enabled: boolean
    times?: string[]
  }
  children: INotificationSetting[]
}

export interface IUpdateNotificationSettingPayload {
  [key: string]: {
    enabled: boolean
    times?: string[]
  }
}
