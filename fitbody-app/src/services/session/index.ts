import { store } from '../../store'
import { AppThunkDispatch } from '../../store/hooks'
import { update, clear, SessionState, validateApple, validateGoogle } from './sessionSlice'
import { GoogleSubscriptionCheckPayload } from './types'

export const updateSession = (data: SessionState) => {
  store.dispatch(update(data))
}

export const clearSession = () => {
  store.dispatch(clear())
}

export const validateAppleSubscription = async (receipt: string) => {
  const d = store.dispatch as AppThunkDispatch
  return await d(validateApple(receipt)).unwrap()
}

export const validateGoogleSubscription = async (receiptParams: GoogleSubscriptionCheckPayload) => {
  const d = store.dispatch as AppThunkDispatch
  return await d(validateGoogle(receiptParams)).unwrap()
}
