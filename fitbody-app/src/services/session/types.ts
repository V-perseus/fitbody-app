export const VALIDATE_APPLE = 'session/validateApple'
export const VALIDATE_GOOGLE = 'session/validateGoogle'

export interface GoogleSubscriptionCheckPayload {
  token: string
  subscription: string
}
