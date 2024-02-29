import { store } from '../../store'
import { getJournals as gj, getMoods as gm, getActivities as ga, createJournal as cj, updateJournal as uj } from './journalSlice'
import { ICreateJournalPayload, IGetJournalsPayload, IUpdateJournalPayload } from './types'

export const getJournals = (data: IGetJournalsPayload) => {
  store.dispatch(gj(data))
}

export const getMoods = () => {
  store.dispatch(gm())
}

export const getActivities = () => {
  store.dispatch(ga())
}

export const createJournal = (data: ICreateJournalPayload) => {
  store.dispatch(cj(data))
}

export const updateJournal = (data: IUpdateJournalPayload) => {
  store.dispatch(uj(data))
}
