import { combineReducers } from 'redux'

// All sub-data reducers
import progressPhotoReducer from './progress_photos/progressPhotosSlice'
import notificationReducer from './notification/notificationSlice'
import workoutsReducer from './workout/workoutsSlice'
import mealPlanReducer from './meal_plan/mealPlanSlice'
import journalReducer from './journal/journalSlice'
import mediaReducer from './media/mediaSlice'
import usersReducer from './user/usersSlice'

/**
 * Main Date reducer
 */
export const dataReducer = combineReducers({
  meal: mealPlanReducer,
  progress_photos: progressPhotoReducer,
  notification: notificationReducer,
  workouts: workoutsReducer,
  journal: journalReducer,
  media: mediaReducer,
  user: usersReducer,
})
