import * as types from './types'
import colors from '../../config/colors'

export const initialState = {
  isVisible: false,
  error: '',
  errorIcon: '',
  iconColor: '',
  duration: 3000,
}

/**
 * Error reducer
 */
export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.UPDATE:
      let message = 'Hey babe! Looks like something went wrong on our end. Check back soon!'
      let icon = 'MoodWarning'
      let iconColor = colors.colorLove
      let duration = state.duration

      if (payload && payload.error) {
        message = payload.error
      }
      if (payload && payload.errorIcon) {
        icon = payload.errorIcon
      }
      if (payload && payload.iconColor) {
        iconColor = payload.iconColor
      }
      if (payload && payload.duration) {
        duration = payload.duration
      }
      return {
        isVisible: true,
        error: message,
        errorIcon: icon,
        iconColor: iconColor,
        duration,
      }
    case types.CLEAR:
      return initialState
    default:
      return state
  }
}
