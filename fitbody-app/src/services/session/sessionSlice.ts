import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import api from '../api'
import { setErrorMessage } from '../error'
import { isAppErrorResponse } from '../api/api'

import { GoogleSubscriptionCheckPayload, VALIDATE_APPLE, VALIDATE_GOOGLE } from './types'

export const validateApple = createAsyncThunk(VALIDATE_APPLE, async (receipt: string, { rejectWithValue }) => {
  try {
    return await api.subscriptions.appleSubscriptionCheck({ receipt: receipt })
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

export const validateGoogle = createAsyncThunk(
  VALIDATE_GOOGLE,
  async (receiptParams: GoogleSubscriptionCheckPayload, { rejectWithValue }) => {
    try {
      return await api.subscriptions.googleSubscriptionCheck(receiptParams)
    } catch (error) {
      if (isAppErrorResponse(error)) {
        setErrorMessage({ error: error.response.data.message })
      }
      return rejectWithValue(error)
    }
  },
)

export interface SessionState {
  userId: number | null
  apiToken: string | null
  activePlan: boolean | null
}
export const initialState: SessionState = {
  userId: null,
  apiToken: null,
  activePlan: null,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<SessionState>) => {
      state.userId = action.payload.userId
      state.apiToken = action.payload.apiToken
      state.activePlan = action.payload.activePlan
    },
    clear: () => {
      return initialState
    },
  },
  extraReducers(builder) {
    builder
      .addCase(validateApple.fulfilled, (state, action) => {
        state.activePlan = action.payload.is_active
      })
      .addCase(validateGoogle.fulfilled, (state, action) => {
        state.activePlan = action.payload.is_active
      })
      .addCase(validateApple.rejected, (state) => {
        return state
      })
      .addCase(validateGoogle.rejected, (state) => {
        return state
      })
  },
})

export const { update, clear } = sessionSlice.actions

export default sessionSlice.reducer
