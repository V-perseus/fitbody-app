import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { IActivity, IJournal, IMood } from './types'

export const journalsSelector = (state: RootState): IJournal[] => state.data.journal.journals
export const moodsSelector = (state: RootState): IMood[] => state.data.journal.moods
export const activitiesSelector = (state: RootState): IActivity[] => state.data.journal.activities

export const journalSelector = createSelector(journalsSelector, (journals) => (date: string) => {
  return journals.find((journal) => journal.entry_date === date)
})

export const selectJournalByDate = createSelector([journalsSelector, (_, date: string) => date], (journals, date) => {
  return journals.find((journal) => journal.entry_date === date)
})

export const moodSelector = createSelector(moodsSelector, (moods) => (id: number) => {
  return moods.find((mood) => mood.id === id)
})

export const selectMoodById = createSelector([moodsSelector, (_, id: number) => id], (moods, id) => {
  return moods.find((mood) => mood.id === id)
})

export const activitySelector = createSelector(activitiesSelector, (activities) => (id: number) => {
  return activities.find((activity) => activity.id === id)
})
