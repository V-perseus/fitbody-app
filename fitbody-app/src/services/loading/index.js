import { storeRegistry } from '../../store/storeRegistry'
import { update, clear } from './actions'

export const displayLoadingModal = () => {
  storeRegistry.dispatch(update())
}

export const hideLoadingModal = () => {
  storeRegistry.dispatch(clear())
}
