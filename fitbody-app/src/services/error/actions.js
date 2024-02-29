import * as types from './types'
import { initialState } from './reducer'

export const update = (payload) => ({
  type: types.UPDATE,
  payload: payload,
})

export const clear = () => ({
  type: types.CLEAR,
  payload: initialState,
})
