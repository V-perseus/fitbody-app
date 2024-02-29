import { store } from '../../store'
import { fetchMedia as fm } from './mediaSlice'

export const fetchMedia = () => {
  store.dispatch(fm())
}
