import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import api from '../../services/api'
import { setErrorMessage } from '../../services/error'
import { isAppErrorResponse } from '../../services/api/api'

import {
  DELETE_PROGRESS_PHOTOS,
  GET_PROGRESS_PHOTOS,
  GET_WEEK_PHOTOS,
  SAVE_PROGRESS_PHOTOS_COMMIT,
  SAVE_PROGRESS_PHOTOS_ROLLBACK,
  ISendProgessPhotosPayload,
  ProgressPhotoDays,
  ProgressPhotosState,
  SendProgressPhotosPayloadPhoto,
  IProgressPhoto,
  ActionWithPayload,
} from './types'

export const getProgressPhotos = createAsyncThunk(GET_PROGRESS_PHOTOS, async (_, { rejectWithValue }) => {
  try {
    return await api.progress_photos.getPhotos()
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

// not being used / incomplete implementation
export const getWeekPhotos = createAsyncThunk(GET_WEEK_PHOTOS, async (week_id: string, { rejectWithValue }) => {
  try {
    return await api.progress_photos.getPhotos(week_id)
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

// not being used / incomplete implementation
export const deleteProgressPhotos = createAsyncThunk(DELETE_PROGRESS_PHOTOS, async (photoId: string, { rejectWithValue }) => {
  try {
    return await api.progress_photos.getDeleteProgressPhoto(photoId)
  } catch (error) {
    if (isAppErrorResponse(error)) {
      setErrorMessage({ error: error.response.data.message })
    }
    return rejectWithValue(error)
  }
})

export const initialState: ProgressPhotosState = {
  message: '',
  days: {},
  loading: 0,
}

const progressPhotosSlice = createSlice({
  name: 'progress_photos',
  initialState,
  reducers: {
    sendProgressPhotos: {
      reducer: (state, action: PayloadAction<ISendProgessPhotosPayload>) => {
        const { date, photos } = action.payload
        const days = state.days as ProgressPhotoDays
        const newPhotos = photos.reduce(
          (acc: ISendProgessPhotosPayload, current: SendProgressPhotosPayloadPhoto) => ({
            ...acc,
            [current.type]: {
              // we want to strip out current.image, which is base64, from redux
              type: current.type,
              guid: current.guid,
              photo_url: current.photo_url,
            },
          }),
          {} as ISendProgessPhotosPayload,
        )

        return {
          ...state,
          loading: state.loading - 1,
          days: {
            ...days,
            [date]: {
              ...days[date],
              ...newPhotos,
            },
          },
        }
      },
      prepare: (payload: ISendProgessPhotosPayload) => {
        const formData = new FormData()
        Object.keys(payload).forEach((_key) => {
          const key = _key as keyof typeof payload
          if (key === 'photos') {
            payload[key].forEach((photo, idx) => {
              formData.append(`photos[${idx}][guid]`, photo.guid)
              formData.append(`photos[${idx}][type]`, photo.type)
              formData.append(`photos[${idx}][image]`, photo.image)
            })
          } else {
            formData.append(key, payload[key])
          }
        })
        return {
          payload: payload,
          meta: {
            offline: {
              effect: {
                url: '/v3/progress-photos/store',
                method: 'POST',
                headers: {
                  'content-type': 'multipart/form-data',
                },
                body: formData,
              },
              commit: { type: SAVE_PROGRESS_PHOTOS_COMMIT, meta: { payload } },
              rollback: { type: SAVE_PROGRESS_PHOTOS_ROLLBACK, payload },
            },
            error: (error: any) => {
              console.log('sendProgressPhotos commit error', error)
            },
          },
        }
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProgressPhotos.fulfilled, (state, action) => {
        state.days = action.payload.photos || {}
      })
      .addCase(getProgressPhotos.rejected, (state) => {
        // console.log('getProgressPhotos rejected')
        return state
      })
      .addCase(
        SAVE_PROGRESS_PHOTOS_COMMIT,
        (state, action: ActionWithPayload<'SAVE_PROGRESS_PHOTOS_COMMIT', { photos: IProgressPhoto[] }>) => {
          const { date } = action.meta.payload
          const days = state.days as ProgressPhotoDays
          const newPhotos = action.payload.photos.reduce<IProgressPhoto[]>(
            (acc: any, current: { view_type: any }) => ({
              ...acc,
              [current.view_type]: current,
            }),
            {} as IProgressPhoto[],
          )
          return {
            ...state,
            loading: state.loading + 1,
            days: {
              ...days,
              [date]: {
                ...days[date],
                ...newPhotos,
              },
            },
          }
        },
      )
      .addCase(SAVE_PROGRESS_PHOTOS_ROLLBACK, (state) => {
        return state
      })
      .addCase(deleteProgressPhotos.fulfilled, (state, _) => {
        return state
      })
      .addCase(deleteProgressPhotos.rejected, (state) => {
        return state
      })
  },
  // extraReducers: {
  //   [getProgressPhotos.fulfilled]: (state, action) => {
  //     // console.log('GET ACTION PAYLOAD', action)
  //     state.days = action.payload.photos ?? []
  //   },
  //   [getWeekPhotos.fulfilled]: (state, action) => {
  //     // TODO this isn't being used at the moment
  //     // if (!Object.keys(action.payload.photos).length) {
  //     //   store.dispatch(changeReminderState({ active: true, week: action.payload.week_id }))
  //     // }
  //   },
  //   [deleteProgressPhotos.fulfilled]: (state, action) => {
  //     // TODO this isn't being used at the moment
  //     //alert(JSON.stringify(data));
  //     // store.dispatch({ type: DELETE_PROGRESS_PHOTOS, payload: data });
  //   },
  //   [SAVE_PROGRESS_PHOTOS_COMMIT]: (state, action) => {
  //     const { date } = action.payload.photos[0]
  //     const newPhotos = action.payload.photos.reduce(
  //       (acc, current) => ({
  //         ...acc,
  //         [current.view_type]: current,
  //       }),
  //       {},
  //     )

  //     return {
  //       ...state,
  //       loading: state.loading + 1,
  //       days: {
  //         ...state.days,
  //         [date]: {
  //           ...state.days[date],
  //           ...newPhotos,
  //         },
  //       },
  //     }
  //   },
  //   [SAVE_PROGRESS_PHOTOS_ROLLBACK]: (state, action) => {
  //     console.log('ROLLBACK', action)
  //     return state
  //   },
  // },
})

export const { sendProgressPhotos } = progressPhotosSlice.actions

export default progressPhotosSlice.reducer
