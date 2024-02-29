import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Notifications } from 'react-native-notifications'

import {
  CLEAR_NOTIFICATIONS,
  DELETE_NOTIFICATION,
  GET_NOTIFICATIONS,
  INotification,
  READ_COMMIT,
  READ_NOTIFICATIONS,
  READ_ROLLBACK,
} from './types'
import api from '../../services/api'

export const getNotifications = createAsyncThunk(GET_NOTIFICATIONS, async (_, { rejectWithValue }) => {
  try {
    const data = await api.notifications.getNotifications()
    Notifications.ios.setBadgeCount(data.notifications.filter((n) => n.read_at === null).length)
    return data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const deleteNotification = createAsyncThunk(DELETE_NOTIFICATION, async (payload: Partial<INotification>, { rejectWithValue }) => {
  try {
    const data = await api.notifications.deleteNotification(payload)
    Notifications.ios.setBadgeCount(data.notifications.filter((n) => n.read_at === null).length)
    return data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const readAllNotifications = createAsyncThunk(READ_NOTIFICATIONS, async (_, { rejectWithValue }) => {
  try {
    const data = await api.notifications.markAllRead()
    Notifications.ios.setBadgeCount(data.notifications.filter((n) => n.read_at === null).length)
    return data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const clearAllNotifications = createAsyncThunk(CLEAR_NOTIFICATIONS, async (_, { rejectWithValue }) => {
  try {
    const data = await api.notifications.clearNotification()
    Notifications.ios.setBadgeCount(data.notifications.filter((n) => n.read_at === null).length)
    return data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const initialState: INotification[] = []

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    clear: () => {
      return initialState
    },
    readNotification: {
      reducer: (state, action) => {
        const itemIndex = state.findIndex((x) => x.id === action.payload.id)
        return [...state.slice(0, itemIndex), action.payload, ...state.slice(itemIndex + 1)]
      },
      prepare: (payload: INotification) => {
        return {
          payload: payload,
          meta: {
            offline: {
              effect: { url: `/v3/notifications/${payload.id}/read`, method: 'GET' },
              commit: { type: READ_COMMIT, meta: payload },
              rollback: { type: READ_ROLLBACK, meta: payload },
            },
          },
          error: null,
        }
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getNotifications.fulfilled, (state, action) => {
        return action.payload.notifications ? action.payload.notifications : state
      })
      .addCase(getNotifications.rejected, (state) => {
        return state
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        return action.payload.notifications ? action.payload.notifications : state
      })
      .addCase(readAllNotifications.fulfilled, (state, action) => {
        return action.payload.notifications ? action.payload.notifications : state
      })
      .addCase(clearAllNotifications.fulfilled, (state, action) => {
        return action.payload.notifications ? action.payload.notifications : state
      })
      .addCase(READ_COMMIT, (state, action: AnyAction) => {
        const itemIndex = state.findIndex((x) => x.id === action.payload.id)
        return [...state.slice(0, itemIndex), action.payload, ...state.slice(itemIndex + 1)]
      })
      .addCase(READ_ROLLBACK, (state) => {
        return state
      })
  },
})

export const { clear, readNotification } = notificationSlice.actions

export default notificationSlice.reducer
