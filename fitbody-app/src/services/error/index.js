import { storeRegistry } from '../../store/storeRegistry'
import { update, clear } from './actions'

export const setErrorMessage = (error) => {
  storeRegistry.dispatch(update(error))
}

export const clearErrorMessage = () => {
  storeRegistry.dispatch(clear())
}
