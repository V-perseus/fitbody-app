import * as types from './types'

export const initialState = {
  isVisible: false,
  isDismissed: false,
}

/**
 * Error reducer
 */
export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case types.UPDATE:
      return {
        ...state,
        isVisible: true,
        isDismissed: false,
      }
    case types.CLEAR:
      return {
        ...state,
        isVisible: false,
      }
    case types.DISMISS:
      return {
        ...state,
        isDismissed: true,
      }
    default:
      return state
  }
}
