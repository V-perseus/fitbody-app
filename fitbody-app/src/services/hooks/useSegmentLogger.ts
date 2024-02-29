import { useAnalytics } from '@segment/analytics-react-native'
import { IVideoType } from '../../data/media/types'
import { IUser } from '../../data/user/types'

export const useSegmentLogger = () => {
  const { identify, track } = useAnalytics()

  const identifyUser = (user: Partial<IUser>) => {
    if (user == null || user.id == null) {
      return
    }

    let identityPayload = {
      id: user.id + '',
    } as Record<string, string | number>
    if (user.age) {
      identityPayload.age = user.age
    }
    if (user.date_of_birth) {
      identityPayload.age = user.date_of_birth + ''
    }
    if (user.created_at) {
      identityPayload.createdAt = user.created_at + ''
    }
    if (user.email) {
      identityPayload.email = user.email
      identityPayload.username = user.email
    }
    if (user.created_at) {
      identityPayload.createdAt = user.created_at + ''
    }
    if (user.name) {
      identityPayload.name = user.name
    }
    if (user.zip) {
      identityPayload.zip = user.zip + ''
    }

    identify(user.id + '', identityPayload)
  }

  // Generic function to log events to Segment
  const logEvent = (user: Partial<IUser> | null, eventName: string, params: Record<string, any>) => {
    if (user && user.id) {
      identifyUser(user)
    }
    track(eventName, params)
  }

  /*
   * Media and video event logging functions
   */
  const logVideoStarted = (video: Partial<IVideoType>, category: string, type: string) => {
    track('Video Started', {
      videoId: video.id,
      title: video.name,
      type,
      category,
    })
  }

  const logCastStarted = () => {
    track('Cast Started', {})
  }

  const logVideoCompleted = (video: Partial<IVideoType>, category: string, type: string) => {
    track('Video Completed', {
      videoId: video.id,
      title: video.name,
      type,
      category,
    })
  }

  const completionShown = (video: Partial<IVideoType>, category: string, type: string) => {
    track('Popup Shown', {
      name: 'Class Added To Calendar',
      videoId: video.id,
      title: video.name,
      type,
      category,
    })
  }

  return {
    identifyUser,
    logEvent,
    logVideoStarted,
    logCastStarted,
    logVideoCompleted,
    completionShown,
  }
}
