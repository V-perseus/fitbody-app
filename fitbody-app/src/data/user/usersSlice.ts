import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import api from '../../services/api'
import { isAppErrorResponse } from '../../services/api/api'
import { setErrorMessage } from '../../services/error'

// import api from '../../services/api'
import { IProgram, ProgramTypes } from '../workout/types'
import {
  ACCEPT_DISCLAIMER_COMMIT,
  ACCEPT_DISCLAIMER_ROLLBACK,
  ActionWithPayload,
  isProgramType,
  IUpdateCurrentWeekPayload,
  IUser,
  UPDATE_USER_META_COMMIT,
  UPDATE_USER_META_ROLLBACK,
  UPDATE_USER_PROFILE_COMMIT,
  UPDATE_USER_PROFILE_ONLINE,
  UPDATE_USER_PROFILE_ROLLBACK,
} from './types'

export const updateUserProfileOnline = createAsyncThunk(UPDATE_USER_PROFILE_ONLINE, async (user: Partial<IUser>, { rejectWithValue }) => {
  try {
    return await api.users.updateUserProfile(user)
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

export const initialState: Partial<IUser> = {}

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    update: (state, action: PayloadAction<Partial<IUser>>) => ({
      ...state,
      ...action.payload,
    }),
    clear: (state) => ({
      // preserve these two fields on logout
      tooltips_viewed: state.tooltips_viewed,
      week_disclaimers_viewed: state.week_disclaimers_viewed,
    }),
    // TODO deprecated but would need to be moved to thunk action
    // getEvents: async (state) => {
    //   const resp = await api.users.getEvents()
    //   const evts = resp.events || []

    //   for (const event of evts) {
    //     console.log(`logging event ${event.event}`)
    //     logEvent(null, event.event, {
    //       plan_name: event.payload.plan_name,
    //       start_date: event.payload.start_date,
    //     })
    //   }
    //   return state
    // },
    updateCurrentWeek: (state, action: PayloadAction<IUpdateCurrentWeekPayload>) => {
      if (!state || !state.workout_goal || !state.meta || !state.meta.programs) {
        return state
      }
      let goal = state.workout_goal.toLowerCase()
      return {
        ...state,
        meta: {
          ...state.meta,
          programs: {
            ...state.meta.programs,
            [goal]: {
              ...state.meta.programs[goal],
              current_week: action.payload.week,
            },
          },
        },
      }
    },
    updateCurrentGoal: (state, action: PayloadAction<ProgramTypes>) => {
      state.workout_goal = action.payload
    },
    updateTooltipsViewed: (state, action: PayloadAction<string>) => {
      state.tooltips_viewed = { ...state.tooltips_viewed, [action.payload]: true }
    },
    updateWeekDisclaimersViewed: (state, action: PayloadAction<string>) => {
      state.week_disclaimers_viewed = { ...state.week_disclaimers_viewed, [action.payload]: moment().format('YYYY-MM-DD hh:mm:ss') }
    },
    updateUserIsRestricted: (state, action: PayloadAction<boolean>) => {
      state.is_restricted = action.payload
    },
    updateUserProfile: {
      reducer: (state, action: PayloadAction<Partial<IUser>>) => {
        return {
          ...state,
          ...action.payload,
        }
      },
      prepare: (payload: Partial<IUser>) => {
        return {
          payload: payload,
          meta: {
            offline: {
              // // the network action to execute:
              effect: { url: `/v3/user/update/${payload.id}`, method: 'POST', json: payload },
              // // action to dispatch when effect succeeds:
              commit: { type: UPDATE_USER_PROFILE_COMMIT, meta: { payload } },
              // // action to dispatch if network action fails permanently:
              rollback: { type: UPDATE_USER_PROFILE_ROLLBACK, payload },
            },
          },
        }
      },
    },
    // Deprecated
    // updateUserMeta: {
    //   reducer: (state, action) => {
    //     const { keys, value } = action.payload
    //     if (state.meta) {
    //       state.meta[keys[0]][keys[1]][keys[2]] = value
    //     }
    //   },
    //   prepare: (payload) => {
    //     return {
    //       payload: payload,
    //       meta: {
    //         offline: {
    //           // // the network action to execute:
    //           effect: { url: `/v3/user/update/${payload.id}/meta`, method: 'PATCH', json: payload },
    //           // // action to dispatch when effect succeeds:
    //           commit: { type: UPDATE_USER_META_COMMIT, meta: { payload } },
    //           // // action to dispatch if network action fails permanently:
    //           rollback: { type: UPDATE_USER_META_ROLLBACK, meta: { payload } },
    //         },
    //       },
    //     }
    //   },
    // },
    acceptDisclaimer: {
      reducer: (state, action: PayloadAction<IProgram>) => {
        const slug = action.payload.slug
        state.disclaimer_accepts
          ? (state.disclaimer_accepts[slug] = moment().format('YYYY-MM-DD hh:mm:ss'))
          : (state.disclaimer_accepts = {
              [slug]: moment().format('YYYY-MM-DD hh:mm:ss'),
            } as Record<ProgramTypes, string>)
      },
      prepare: (payload: IProgram) => {
        return {
          payload: { ...payload },
          meta: {
            offline: {
              effect: { url: `/v4/programs/${payload.id}/accept`, method: 'POST', json: {} },
              commit: { type: ACCEPT_DISCLAIMER_COMMIT, meta: { payload, date: moment().format('YYYY-MM-DD hh:mm:ss') } },
              rollback: { type: ACCEPT_DISCLAIMER_ROLLBACK },
            },
          },
        }
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(updateUserProfileOnline.fulfilled, (state, action) => {
        console.log('online updateUserProfile fulfilled', action.payload)
        return {
          ...state,
          ...action.payload.user,
          // events is deprecated but still gets populated server side for now
          // it can put lots of data into app state which we don't want
          events: [],
        }
      })
      .addCase(UPDATE_USER_PROFILE_COMMIT, (state, action: ActionWithPayload<'users/updateUserProfile/commit', { user: IUser }>) => {
        // console.log('offline updateUserProfile commit', JSON.stringify(action.payload.user, null, 2))
        return {
          ...state,
          ...action.payload.user,
          // events is deprecated but still gets populated server side for now
          // it can put lots of data into app state which we don't want
          events: [],
        }
      })
      .addCase(UPDATE_USER_PROFILE_ROLLBACK, (state) => {
        console.log('updateUserProfile rollback')
        return state
      })
      .addCase(UPDATE_USER_META_COMMIT, (state, action: ActionWithPayload<'users/updateUserMeta/commit', { user: IUser }>) => {
        return {
          ...state,
          ...action.payload.user,
        }
      })
      .addCase(UPDATE_USER_META_ROLLBACK, (state) => {
        console.log('updateUserMeta rollback')
        return state
      })
      .addCase(ACCEPT_DISCLAIMER_COMMIT, (state, action: ActionWithPayload<'users/acceptDisclaimer/commit', { slug: ProgramTypes }>) => {
        console.log('offline acceptDisclaimer commit', action)
        const slug = action.payload.slug
        if (state.disclaimer_accepts && isProgramType(slug)) {
          state.disclaimer_accepts[slug] = action.meta.date
        }
      })
      .addCase(ACCEPT_DISCLAIMER_ROLLBACK, (state) => {
        console.log('acceptDisclaimer rollback')
        return state
      })
    // [`${UPDATE_USER_PROFILE}/rollback`]: (state, action) => {
    //   console.log('updateUserProfile rollback', action)
    // },
    // 'users/updateUserMeta/commit': (state, action) => {
    //   return {
    //     ...state,
    //     ...action.payload.user,
    //   }
    // },
    // 'users/updateUserMeta/rollback': (state, action) => {
    //   console.log('updateUserMeta rollback', action)
    // },
    // 'users/acceptDisclaimer/commit': (state, action) => {
    //   console.log('offline acceptDisclaimer commit', action)
    //   const slug = action.payload.slug as ProgramTypes
    //   if (state.disclaimer_accepts && isProgramType(slug)) {
    //     state.disclaimer_accepts[slug] = action.meta.date
    //   }
    // },
    // 'users/acceptDisclaimer/rollback': (state, action) => {
    //   console.log('acceptDisclaimer rollback', action)
    // },
  },
})

export const {
  update,
  clear,
  updateCurrentWeek,
  updateCurrentGoal,
  // getEvents,
  updateTooltipsViewed,
  updateUserProfile,
  // updateUserMeta,
  acceptDisclaimer,
  updateWeekDisclaimersViewed,
  updateUserIsRestricted,
} = usersSlice.actions

export default usersSlice.reducer
