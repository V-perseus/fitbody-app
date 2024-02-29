import { combineReducers } from 'redux'

// All sub-services reducers
import { reducer as errorReducer } from './error/reducer'
import { reducer as loadingReducer } from './loading/reducer'
import { reducer as modalReducer } from './modal/reducer'
import { reducer as reminderReducer } from './reminder/reducer'
import sessionReducer from './session/sessionSlice'
import dateReducer from './dates/datesSlice'

/**
 * Main Services reducer
 */
export const servicesReducer = combineReducers({
  error: errorReducer,
  loading: loadingReducer,
  session: sessionReducer,
  modal: modalReducer,
  date: dateReducer,
  reminder: reminderReducer,
})
