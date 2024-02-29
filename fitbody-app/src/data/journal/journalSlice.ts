import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  CREATE_JOURNAL,
  GET_ACTIVITIES,
  GET_JOURNALS,
  GET_MOODS,
  IActivity,
  ICreateJournalPayload,
  IGetJournalsPayload,
  IJournal,
  IMood,
  IUpdateJournalPayload,
  UPDATE_JOURNAL,
} from './types'
import api from '../../services/api'
import { setErrorMessage } from '../../services/error'
import { isAppErrorResponse } from '../../services/api/api'

const mergeJournalItemIntoArray = (origJournals: IJournal[], journal: IJournal): IJournal[] => {
  let journals = origJournals
  const index = journals.findIndex((jn) => jn.entry_date === journal.entry_date)
  if (index < 0) {
    journals = [...journals, journal]
  } else {
    journals[index] = journal
  }
  return journals
}

export const getJournals = createAsyncThunk(GET_JOURNALS, async (payload: IGetJournalsPayload, thunkAPI) => {
  const { start, end } = payload
  try {
    const response = await api.journals.getJournals(start, end)
    return response
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return thunkAPI.rejectWithValue(error)
  }
})

export const getMoods = createAsyncThunk(GET_MOODS, async (_, thunkAPI) => {
  try {
    const response = await api.journals.getMoods()
    return response
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return thunkAPI.rejectWithValue(error)
  }
})

export const getActivities = createAsyncThunk(GET_ACTIVITIES, async (_, thunkAPI) => {
  try {
    const response = await api.journals.getActivities()
    return response
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return thunkAPI.rejectWithValue(error)
  }
})

export const createJournal = createAsyncThunk(CREATE_JOURNAL, async (payload: ICreateJournalPayload, thunkAPI) => {
  const { data, onSuccess } = payload
  try {
    const response = await api.journals.createJournal(data)
    if (onSuccess) {
      onSuccess()
    }
    return response
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateJournal = createAsyncThunk(UPDATE_JOURNAL, async (payload: IUpdateJournalPayload, thunkAPI) => {
  const { journalId, data, onSuccess } = payload
  try {
    const response = await api.journals.updateJournal(journalId, data)
    if (onSuccess) {
      onSuccess()
    }
    return response
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return thunkAPI.rejectWithValue(error)
  }
})

type JournalSliceState = {
  moods: IMood[]
  activities: IActivity[]
  journals: IJournal[]
}

export const initialState: JournalSliceState = {
  moods: [],
  activities: [],
  journals: [],
}

const journalSlice = createSlice({
  name: 'journal',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getJournals.fulfilled, (state, action) => {
        state.journals = action.payload ? action.payload : state.journals
      })
      .addCase(getJournals.rejected, (state) => {
        return state
      })
      .addCase(getMoods.fulfilled, (state, action) => {
        state.moods = action.payload ? action.payload : state.moods
      })
      .addCase(getMoods.rejected, (state) => {
        return state
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.activities = action.payload ? action.payload : state.activities
      })
      .addCase(getActivities.rejected, (state) => {
        return state
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        if (action.payload) {
          state.journals = [...state.journals, action.payload]
        }
      })
      .addCase(createJournal.rejected, (state) => {
        return state
      })
      .addCase(updateJournal.fulfilled, (state, action) => {
        if (action.payload) {
          state.journals = mergeJournalItemIntoArray([...state.journals], action.payload)
        }
      })
      .addCase(updateJournal.rejected, (state) => {
        return state
      })
  },
})

export const {} = journalSlice.actions

export default journalSlice.reducer
