import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit'
import { MoodsIconMapType } from '../../config/svgs/dynamic/moodsMap'
import { ActivitiesIconMapType } from '../../config/svgs/dynamic/activitiesMap'

export const GET_MOODS = 'journal/getMoods'
export const GET_ACTIVITIES = 'journal/getActivities'
export const CREATE_JOURNAL = 'journal/createJournal'
export const UPDATE_JOURNAL = 'journal/updateJournal'
export const GET_JOURNALS = 'journal/getJournals'

export interface IJournal {
  id?: number
  user_id: number
  accomplished_today: string
  accomplish_tmrw: string
  created_at?: string
  updated_at?: string
  proud_of_today: string
  additional_thoughts: string
  entry_date: string
  main_mood_id: number | null
  mood_items: { id: number; order: number }[]
  mood_ids: number[]
  journal_activity_ids: number[]
}

export interface IMood {
  id?: number
  name: string
  icon_key: MoodsIconMapType
  created_at?: string
  updated_at?: string
}

export interface IActivity {
  id?: number
  name: string
  icon_key: ActivitiesIconMapType
  created_at?: string
  updated_at?: string
}

export interface IGetJournalsPayload {
  start: string
  end: string
}

export interface ICreateJournalPayload {
  data: any
  onSuccess: () => void
}

export interface IUpdateJournalPayload extends AsyncThunkPayloadCreator<any, IJournal> {
  journalId: string
  data: any
  onSuccess: () => void
}
