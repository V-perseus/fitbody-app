import NotificationWorkout from '../../../../assets/images/svg/icon/56px/circle/notification-workout.svg'
import NotificationVideo from '../../../../assets/images/svg/icon/56px/circle/notification-guidance.svg'
import NotificationPhoto from '../../../../assets/images/svg/icon/56px/circle/notification-photo.svg'
import NotificationWater from '../../../../assets/images/svg/icon/56px/circle/notification-water.svg'
import NotificationChallenge from '../../../../assets/images/svg/icon/56px/circle/notification-challenge.svg'
import NotificationCustom from '../../../../assets/images/svg/icon/56px/circle/notification-notification.svg'

export const NotifcationsIconMap = Object.freeze({
  InactiveUser: NotificationWorkout,
  InactiveTrialUser: NotificationWorkout,
  DailyWorkout: NotificationWorkout,
  NewChallenge: NotificationChallenge,
  NewGuidanceVideo: NotificationVideo,
  ProgressPhoto: NotificationPhoto,
  WaterIntake: NotificationWater,
  Custom: NotificationCustom,
  CompleteFirstWorkout: NotificationWorkout,
})
