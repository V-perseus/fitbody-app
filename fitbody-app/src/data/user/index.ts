import { store } from '../../store'
import { AppThunkDispatch } from '../../store/hooks'
import { IProgram, ProgramTypes } from '../workout/types'
import { IUpdateCurrentWeekPayload, IUser } from './types'
import {
  update,
  clear,
  updateCurrentWeek as ucw,
  // getEvents as ge,
  updateTooltipsViewed as utv,
  updateCurrentGoal,
  updateUserProfile as uup,
  updateUserProfileOnline as uupo,
  // updateUserMeta as uum,
  acceptDisclaimer as ad,
  updateWeekDisclaimersViewed as uwdv,
  updateUserIsRestricted as uuir,
} from './usersSlice'

export const updateUser = (user: Partial<IUser>) => {
  store.dispatch(update(user))
}

export const clearUser = () => {
  store.dispatch(clear())
}

export const updateCurrentWeek = (week: IUpdateCurrentWeekPayload) => {
  store.dispatch(ucw(week))
}

export const setCurrentGoal = (goal: ProgramTypes) => {
  store.dispatch(updateCurrentGoal(goal))
}

// export const getEvents = () => {
//   store.dispatch(ge())
// }

export const updateTooltipsViewed = (tooltipId: string) => {
  store.dispatch(utv(tooltipId))
}

// data is user object requires user id be present ex. { id: userId, workout_goal: "SHRED", ... }
// this updates via offline api call
export const updateUserProfile = (user: Partial<IUser>) => {
  store.dispatch(uup(user))
}

export const updateUserProfileOnline = async (user: Partial<IUser>) => {
  const d = store.dispatch as AppThunkDispatch
  return await d(uupo(user)).unwrap()
}

/* example metadata
  {
    id: userId,
    value: 1,
    keys: ['programs', whateveryouwant: string, 'current_week'],
  }
*/
// export const updateUserMeta = (metadata) => {
//   store.dispatch(uum(metadata))
// }

export const acceptDisclaimer = (program: IProgram) => {
  store.dispatch(ad(program))
}

export const updateWeekDisclaimersViewed = (programWeek: string) => {
  store.dispatch(uwdv(programWeek))
}

export const updateUserIsRestricted = (flag: boolean) => {
  store.dispatch(uuir(flag))
}
